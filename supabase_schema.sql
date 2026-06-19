-- ================================================================
-- PetalBird — Full Schema
-- Run this entire file in Supabase SQL Editor (new project)
-- ================================================================


-- ── 1. PROFILES ─────────────────────────────────────────────────
-- One row per user, auto-created when they sign up

create table if not exists profiles (
  id             uuid        references auth.users on delete cascade primary key,
  username       text        unique not null,
  display_name   text        not null,
  avatar_url     text,
  bio            text,
  created_at     timestamptz not null default now()
);

-- Trigger: auto-create profile row the moment a user signs up
create or replace function handle_new_user()
returns trigger as $$
declare
  base_username  text;
  final_username text;
  counter        int := 0;
begin
  -- Sanitize: lowercase, replace special chars with _
  base_username := lower(regexp_replace(
    coalesce(
      nullif(trim(new.raw_user_meta_data->>'username'), ''),
      split_part(new.email, '@', 1)
    ),
    '[^a-z0-9_]', '_', 'g'
  ));

  final_username := base_username;

  -- Ensure username is unique by appending a counter if needed
  while exists (select 1 from public.profiles where username = final_username) loop
    counter        := counter + 1;
    final_username := base_username || counter::text;
  end loop;

  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    final_username,
    coalesce(
      nullif(trim(new.raw_user_meta_data->>'display_name'), ''),
      split_part(new.email, '@', 1)
    )
  );

  return new;
exception
  when others then
    raise warning 'handle_new_user failed for %: %', new.id, sqlerrm;
    return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();


-- ── 2. POSTS ────────────────────────────────────────────────────
-- Posts created by users — shown in the feed
-- Each post has an image, optional caption, and a live avg rating

create table if not exists posts (
  id           uuid           primary key default gen_random_uuid(),
  user_id      uuid           references profiles(id) on delete cascade not null,
  image_url    text           not null,
  caption      text,
  avg_rating   numeric(3,1)   not null default 0,
  rating_count int            not null default 0,
  created_at   timestamptz    not null default now(),
  updated_at   timestamptz    not null default now()
);


-- ── 3. RATINGS ──────────────────────────────────────────────────
-- Users rate posts on a 1–10 scale
-- One rating per user per post (enforced by unique constraint)
-- Users cannot rate their own posts (enforced by RLS)

create table if not exists ratings (
  id         uuid        primary key default gen_random_uuid(),
  post_id    uuid        references posts(id) on delete cascade not null,
  rater_id   uuid        references profiles(id) on delete cascade not null,
  score      smallint    not null check (score between 1 and 10),
  created_at timestamptz not null default now(),
  unique(post_id, rater_id)
);

-- Trigger: recalculate avg_rating + rating_count on the post after every rating
create or replace function update_post_avg_rating()
returns trigger as $$
begin
  update posts
  set
    avg_rating   = coalesce((
      select round(avg(score)::numeric, 1)
      from ratings
      where post_id = new.post_id
    ), 0),
    rating_count = (
      select count(*)
      from ratings
      where post_id = new.post_id
    )
  where id = new.post_id;
  return new;
end;
$$ language plpgsql;

drop trigger if exists on_rating_change on ratings;
create trigger on_rating_change
  after insert or update on ratings
  for each row execute procedure update_post_avg_rating();


-- ── 4. CONVERSATIONS ────────────────────────────────────────────
-- A conversation is a direct chat between two users
-- Created when one user clicks "Message" on a post

create table if not exists conversations (
  id           uuid        primary key default gen_random_uuid(),
  last_message text,
  updated_at   timestamptz not null default now(),
  created_at   timestamptz not null default now()
);

-- Which users are in each conversation
create table if not exists conversation_participants (
  conversation_id uuid references conversations(id) on delete cascade,
  user_id         uuid references profiles(id)      on delete cascade,
  primary key (conversation_id, user_id)
);


-- ── 5. MESSAGES ─────────────────────────────────────────────────
-- Individual messages inside a conversation

create table if not exists messages (
  id              uuid        primary key default gen_random_uuid(),
  conversation_id uuid        references conversations(id) on delete cascade not null,
  sender_id       uuid        references profiles(id)      on delete cascade not null,
  content         text        not null,
  created_at      timestamptz not null default now()
);

-- Trigger: keep conversation.last_message + updated_at in sync
create or replace function sync_conversation_last_message()
returns trigger as $$
begin
  update conversations
  set
    last_message = new.content,
    updated_at   = new.created_at
  where id = new.conversation_id;
  return new;
end;
$$ language plpgsql;

drop trigger if exists on_message_insert on messages;
create trigger on_message_insert
  after insert on messages
  for each row execute procedure sync_conversation_last_message();


-- ── 6. REALTIME ─────────────────────────────────────────────────
-- Enable live message delivery for the chat feature

alter publication supabase_realtime add table messages;


-- ── 7. ROW LEVEL SECURITY ────────────────────────────────────────

alter table profiles               enable row level security;
alter table posts                  enable row level security;
alter table ratings                enable row level security;
alter table conversations          enable row level security;
alter table conversation_participants enable row level security;
alter table messages               enable row level security;

-- PROFILES
-- Anyone can view any profile
create policy "profiles_read"
  on profiles for select using (true);

-- Only the trigger (security definer) inserts profiles on signup
create policy "profiles_own_update"
  on profiles for update using (auth.uid() = id);

-- POSTS
-- Anyone can read posts (feed is public to logged-in users)
create policy "posts_read"
  on posts for select using (true);

-- Only the post owner can create posts
create policy "posts_insert"
  on posts for insert with check (auth.uid() = user_id);

-- Only the post owner can edit their own posts
create policy "posts_update"
  on posts for update using (auth.uid() = user_id);

-- Only the post owner can delete their own posts
create policy "posts_delete"
  on posts for delete using (auth.uid() = user_id);

-- RATINGS
-- Anyone can see ratings
create policy "ratings_read"
  on ratings for select using (true);

-- Authenticated users can rate a post, but NOT their own
create policy "ratings_insert"
  on ratings for insert
  with check (
    auth.uid() = rater_id
    and auth.uid() != (select user_id from posts where id = post_id)
  );

-- Users can update only their own rating
create policy "ratings_update"
  on ratings for update using (auth.uid() = rater_id);

-- CONVERSATIONS
-- Only participants can see the conversation
create policy "conversations_read"
  on conversations for select
  using (
    exists (
      select 1 from conversation_participants
      where conversation_id = id and user_id = auth.uid()
    )
  );

-- Any authenticated user can create a conversation
create policy "conversations_insert"
  on conversations for insert with check (auth.role() = 'authenticated');

-- CONVERSATION PARTICIPANTS
-- Users can only see conversations they belong to
create policy "cp_read"
  on conversation_participants for select using (auth.uid() = user_id);

-- Authenticated users can add themselves to a new conversation
create policy "cp_insert"
  on conversation_participants for insert with check (auth.uid() = user_id);

-- MESSAGES
-- Only conversation participants can read messages
create policy "messages_read"
  on messages for select
  using (
    exists (
      select 1 from conversation_participants
      where conversation_id = messages.conversation_id
        and user_id = auth.uid()
    )
  );

-- Only participants can send messages to a conversation they belong to
create policy "messages_insert"
  on messages for insert
  with check (
    auth.uid() = sender_id
    and exists (
      select 1 from conversation_participants
      where conversation_id = messages.conversation_id
        and user_id = auth.uid()
    )
  );


-- ── 8. STORAGE BUCKET POLICIES ──────────────────────────────────
-- Run AFTER creating the "post-images" bucket in Storage dashboard

-- insert policy: only authenticated users can upload
create policy "post_images_upload"
  on storage.objects for insert
  with check (bucket_id = 'post-images' and auth.role() = 'authenticated');

-- select policy: anyone can view uploaded images
create policy "post_images_read"
  on storage.objects for select
  using (bucket_id = 'post-images');

-- delete policy: only the uploader can delete their own images
create policy "post_images_delete"
  on storage.objects for delete
  using (bucket_id = 'post-images' and auth.uid()::text = (storage.foldername(name))[1]);
