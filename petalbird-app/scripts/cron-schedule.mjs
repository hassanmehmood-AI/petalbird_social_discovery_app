import { readFileSync, writeFileSync } from "node:fs";

const schedules = {
  test: "*/3 * * * *",
  production: "0 9 */3 * *",
  daily: "0 9 * * *",
};
const mode = process.argv[2];
if (!Object.hasOwn(schedules, mode)) {
  console.error("Usage: node scripts/cron-schedule.mjs test|production|daily");
  process.exit(1);
}
const configPath = new URL("../vercel.json", import.meta.url);
const config = JSON.parse(readFileSync(configPath, "utf8"));
const job = config.crons?.find((cron) => cron.path === "/api/health");
if (!job) throw new Error("Missing /api/health cron configuration");
job.schedule = schedules[mode];
writeFileSync(configPath, JSON.stringify(config, null, 2) + "\n");
console.log(`Keep-alive schedule: ${job.schedule}. Redeploy to production to apply it.`);
if (mode === "test") console.log("Three-minute Vercel Cron requires Pro/Enterprise. Hobby: use the external test in KEEP_ALIVE.md.");
