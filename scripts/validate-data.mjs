// ตรวจ data/days/*.json (ชื่อไฟล์=date, id ไม่ซ้ำ, status ถูกต้อง, groups ซ้อนได้)
import { readdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const dir = join(dirname(fileURLToPath(import.meta.url)), "..", "data", "days");
const STATUS = ["todo", "doing", "done", "blocked"];
let n = 0;

function walk(f, groups, ids, path) {
  for (const g of groups ?? []) {
    if (!g.name) throw new Error(`${f}: group ไม่มี name (${path})`);
    const here = `${path}/${g.name}`;
    for (const t of g.tasks ?? []) {
      if (!t.id || ids.has(t.id)) throw new Error(`${f}: task id ว่างหรือซ้ำ (${t.id}) ใน ${here}`);
      ids.add(t.id);
      if (!STATUS.includes(t.status)) throw new Error(`${f}: status ผิด (${t.status}) ใน ${here}`);
      if (t.status === "done" && !t.checked) throw new Error(`${f}: ${t.id} status done แต่ checked เป็น false`);
    }
    walk(f, g.groups, ids, here);
  }
}

for (const f of readdirSync(dir).filter((f) => f.endsWith(".json"))) {
  if (!/^\d{4}-\d{2}-\d{2}\.json$/.test(f)) throw new Error(`${f}: ชื่อไฟล์ต้องเป็น YYYY-MM-DD.json`);
  const day = JSON.parse(readFileSync(join(dir, f), "utf8"));
  if (f.replace(".json", "") !== day.date) throw new Error(`${f}: date ไม่ตรงกับชื่อไฟล์`);
  if (!Array.isArray(day.groups)) throw new Error(`${f}: ต้องมี groups (ไม่ใช้ tasks ระดับบนสุดแล้ว)`);
  walk(f, day.groups, new Set(), "");
  n++;
}
console.log(`OK: ${n} day(s)`);
