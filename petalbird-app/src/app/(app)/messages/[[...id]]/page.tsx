"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useParams } from "next/navigation";
import {
  Search,
  MoreVertical,
  SendHorizontal,
  ArrowLeft,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { Conversation, Message } from "@/types";

/* ─── Avatar ──────────────────────────────────────────────────────────── */
function AvatarCircle({
  initials,
  avatarUrl,
  size = "md",
}: {
  initials: string;
  avatarUrl?: string | null;
  size?: "sm" | "md" | "lg";
}) {
  const sz =
    size === "sm" ? "w-8 h-8 text-xs" :
    size === "lg" ? "w-12 h-12 text-base" :
    "w-10 h-10 text-sm";

  return (
    <div className={cn("rounded-full shrink-0 overflow-hidden border-2 border-white bg-gradient-to-br from-[#C4C6FA] to-[#7B7FEF]/60 flex items-center justify-center text-white font-bold", sz)}>
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}

/* ─── Conversation list item ──────────────────────────────────────────── */
function ConvItem({
  conv,
  active,
  onClick,
}: {
  conv: Conversation;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={cn(
        "w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors border",
        active
          ? "bg-primary/10 border-primary/20"
          : "hover:bg-surface-container-low border-transparent"
      )}
      onClick={onClick}
    >
      <AvatarCircle
        initials={conv.with.displayName[0] || "?"}
        avatarUrl={conv.with.avatarUrl}
        size="lg"
      />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-0.5">
          <h3 className="text-sm font-semibold text-on-surface truncate">
            {conv.with.displayName}
          </h3>
          <span className={cn("text-[10px] shrink-0 ml-2", active ? "text-primary font-bold" : "text-outline")}>
            {new Date(conv.updatedAt).toLocaleDateString()}
          </span>
        </div>
        <p className="text-xs text-on-surface-variant truncate">
          {conv.lastMessage || "No messages yet"}
        </p>
      </div>
    </button>
  );
}

/* ─── Message bubble ─────────────────────────────────────────────────── */
function MsgBubble({
  msg,
  currentUserId,
  otherDisplayName,
  otherAvatarUrl,
}: {
  msg: Message;
  currentUserId: string;
  otherDisplayName: string;
  otherAvatarUrl: string | null;
}) {
  const isMine = msg.senderId === currentUserId;
  return (
    <div className={cn("flex items-end gap-2", isMine ? "justify-end" : "justify-start")}>
      {!isMine && (
        <AvatarCircle
          initials={otherDisplayName[0] || "?"}
          avatarUrl={otherAvatarUrl}
          size="sm"
        />
      )}
      <div className={cn("flex items-end gap-1.5", isMine ? "flex-row-reverse" : "flex-row")}>
        <div
          className={cn(
            "max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed",
            isMine
              ? "bg-gradient-to-br from-[#7B7FEF] to-[#5A5DC0] text-white rounded-br-sm shadow-md"
              : "bg-white text-on-surface rounded-bl-sm shadow-sm border border-white/60"
          )}
        >
          {msg.content}
        </div>
        <span className="text-[10px] text-outline mb-1 shrink-0">
          {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────── */
export default function MessagesPage() {
  const params = useParams();
  const urlConvId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string | undefined) ?? null;

  const [currentUserId, setCurrentUserId] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(urlConvId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [search, setSearch] = useState("");
  const [showList, setShowList] = useState(!urlConvId);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [sending, setSending] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  const activeConv = conversations.find((c) => c.id === activeConvId) ?? null;

  const filteredConvs = useMemo(
    () =>
      search.trim()
        ? conversations.filter(
            (c) =>
              c.with.displayName.toLowerCase().includes(search.toLowerCase()) ||
              c.with.username.toLowerCase().includes(search.toLowerCase())
          )
        : conversations,
    [conversations, search]
  );

  /* ── Load conversations ───────────────────────────────────────────── */
  useEffect(() => {
    async function load() {
      setLoadingConvs(true);
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setCurrentUserId(user.id);

      const { data: myConvIds } = await supabase
        .from("conversation_participants")
        .select("conversation_id")
        .eq("user_id", user.id);

      if (!myConvIds || myConvIds.length === 0) {
        setLoadingConvs(false);
        return;
      }

      const ids = myConvIds.map((r) => r.conversation_id);

      const { data: convRows } = await supabase
        .from("conversations")
        .select(`
          id, last_message, updated_at,
          conversation_participants (
            user_id,
            profiles:user_id ( id, username, display_name, avatar_url )
          )
        `)
        .in("id", ids)
        .order("updated_at", { ascending: false });

      if (convRows) {
        const mapped: Conversation[] = convRows
          .map((c: any) => {
            const other = c.conversation_participants.find(
              (p: any) => p.user_id !== user.id
            );
            const op = other?.profiles;
            if (!op) return null;
            return {
              id: c.id,
              with: {
                id: op.id,
                username: op.username,
                displayName: op.display_name,
                avatarUrl: op.avatar_url ?? null,
              },
              lastMessage: c.last_message ?? "",
              unreadCount: 0,
              updatedAt: c.updated_at,
            };
          })
          .filter(Boolean) as Conversation[];

        setConversations(mapped);
        if (urlConvId && mapped.some((c) => c.id === urlConvId)) {
          setActiveConvId(urlConvId);
          setShowList(false);
        } else if (!urlConvId && mapped.length > 0) {
          setActiveConvId(mapped[0].id);
          // On desktop (md+) auto-open first conversation; on mobile keep list visible
          if (window.innerWidth >= 768) setShowList(false);
        }
      }
      setLoadingConvs(false);
    }
    load();
  }, []);

  /* ── Load + subscribe to messages ────────────────────────────────── */
  useEffect(() => {
    if (!activeConvId) return;
    setMessages([]);
    const supabase = createClient();

    supabase
      .from("messages")
      .select("id, conversation_id, sender_id, content, created_at")
      .eq("conversation_id", activeConvId)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (data) {
          setMessages(
            data.map((m) => ({
              id: m.id,
              conversationId: m.conversation_id,
              senderId: m.sender_id,
              content: m.content,
              createdAt: m.created_at,
            }))
          );
        }
      });

    const channel = supabase
      .channel(`messages:${activeConvId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${activeConvId}`,
        },
        (payload) => {
          const m = payload.new as any;
          setMessages((prev) => [
            ...prev,
            {
              id: m.id,
              conversationId: m.conversation_id,
              senderId: m.sender_id,
              content: m.content,
              createdAt: m.created_at,
            },
          ]);
          // Keep sidebar last-message in sync without needing a DB trigger policy
          setConversations((prev) =>
            prev.map((c) =>
              c.id === activeConvId
                ? { ...c, lastMessage: m.content, updatedAt: m.created_at }
                : c
            )
          );
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [activeConvId]);

  /* ── Auto-scroll ─────────────────────────────────────────────────── */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ── Send ────────────────────────────────────────────────────────── */
  async function handleSend() {
    const content = messageInput.trim();
    if (!content || !activeConvId || !currentUserId || sending) return;
    setSending(true);
    setMessageInput("");
    const supabase = createClient();
    await supabase
      .from("messages")
      .insert({ conversation_id: activeConvId, sender_id: currentUserId, content });
    setSending(false);
    inputRef.current?.focus();
  }

  async function handleDeleteConversation() {
    if (!activeConvId) return;
    setMenuOpen(false);
    const supabase = createClient();
    await supabase.from("messages").delete().eq("conversation_id", activeConvId);
    await supabase.from("conversation_participants").delete().eq("conversation_id", activeConvId);
    await supabase.from("conversations").delete().eq("id", activeConvId);
    setConversations((prev) => prev.filter((c) => c.id !== activeConvId));
    setActiveConvId(null);
    setMessages([]);
    setShowList(true);
  }

  return (
    <div
      className="-mx-4 md:-mx-6 lg:-mx-8 -my-6 flex overflow-hidden bg-surface messages-container"
      style={{ height: "calc(100dvh - 4rem)" }}
    >
      {/* ── Conversation sidebar ───────────────────────────────────── */}
      <aside
        className={cn(
          "flex-col border-r border-white/40 bg-white/70 backdrop-blur-xl",
          "w-full md:w-72 lg:w-80 md:flex",
          showList ? "flex" : "hidden"
        )}
      >
        <div className="p-4 border-b border-white/40 shrink-0">
          <h2 className="font-heading text-lg font-semibold text-on-surface mb-3">Messages</h2>
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none"
            />
            <input
              className="w-full bg-surface-container-low rounded-full py-2.5 pl-9 pr-4 text-sm focus:outline-none placeholder:text-outline focus:bg-white transition-colors border border-transparent focus:border-primary/30"
              placeholder="Search conversations…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {loadingConvs ? (
            <p className="text-sm text-on-surface-variant text-center py-8">Loading…</p>
          ) : filteredConvs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
              <MessageCircle size={32} className="text-outline mb-3" />
              <p className="text-sm font-semibold text-on-surface mb-1">
                {search ? "No results" : "No conversations yet"}
              </p>
              <p className="text-xs text-on-surface-variant">
                {search
                  ? "Try a different name"
                  : "Tap Message on someone's post to start chatting"}
              </p>
            </div>
          ) : (
            filteredConvs.map((conv) => (
              <ConvItem
                key={conv.id}
                conv={conv}
                active={conv.id === activeConvId}
                onClick={() => {
                  setActiveConvId(conv.id);
                  setShowList(false);
                }}
              />
            ))
          )}
        </div>
      </aside>

      {/* ── Chat window ───────────────────────────────────────────────── */}
      <div
        className={cn(
          "flex-1 flex flex-col min-h-0",
          !showList ? "flex" : "hidden md:flex"
        )}
      >
        {activeConv ? (
          <>
            {/* Header */}
            <div className="h-16 px-4 md:px-6 flex items-center justify-between border-b border-white/40 bg-white/70 backdrop-blur-xl shrink-0">
              <div className="flex items-center gap-3">
                <button
                  className="md:hidden p-1.5 hover:bg-surface-container-low rounded-full transition-colors text-on-surface"
                  onClick={() => setShowList(true)}
                >
                  <ArrowLeft size={20} />
                </button>
                <AvatarCircle
                  initials={activeConv.with.displayName[0] || "?"}
                  avatarUrl={activeConv.with.avatarUrl}
                  size="md"
                />
                <div>
                  <h2 className="text-sm font-semibold text-on-surface leading-none mb-0.5">
                    {activeConv.with.displayName}
                  </h2>
                  <p className="text-xs text-outline">@{activeConv.with.username}</p>
                </div>
              </div>
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((o) => !o)}
                  className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors"
                >
                  <MoreVertical size={18} />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-11 z-30 w-48 bg-white/95 backdrop-blur-xl border border-white/40 rounded-xl shadow-xl overflow-hidden">
                    <button
                      onClick={() => { setMenuOpen(false); window.location.href = `/profile/${activeConv.with.username}`; }}
                      className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-medium text-on-surface hover:bg-surface-container-low transition-colors text-left"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={handleDeleteConversation}
                      className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors text-left"
                    >
                      Delete Conversation
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-4">
              {messages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <AvatarCircle
                    initials={activeConv.with.displayName[0] || "?"}
                    avatarUrl={activeConv.with.avatarUrl}
                    size="lg"
                  />
                  <p className="mt-3 text-sm font-semibold text-on-surface">
                    {activeConv.with.displayName}
                  </p>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Send a message to start the conversation
                  </p>
                </div>
              ) : (
                messages.map((msg) => (
                  <MsgBubble
                    key={msg.id}
                    msg={msg}
                    currentUserId={currentUserId}
                    otherDisplayName={activeConv.with.displayName}
                    otherAvatarUrl={activeConv.with.avatarUrl}
                  />
                ))
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input bar */}
            <div className="p-3 md:p-4 bg-white/60 backdrop-blur-xl border-t border-white/40 shrink-0">
              <div className="flex items-center gap-2 bg-surface-container-low rounded-full px-4 py-2 border border-outline-variant/40 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                <input
                  ref={inputRef}
                  className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-sm py-1 text-on-surface placeholder:text-outline"
                  placeholder="Type a message…"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
                <button
                  disabled={!messageInput.trim() || sending}
                  className="p-2 bg-primary text-white rounded-full hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                  onClick={handleSend}
                >
                  <SendHorizontal size={16} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <MessageCircle size={28} className="text-primary" />
            </div>
            <p className="text-base font-semibold text-on-surface mb-1">Your messages</p>
            <p className="text-sm text-on-surface-variant">
              Select a conversation or tap Message on someone's post
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
