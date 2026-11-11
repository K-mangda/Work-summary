import { useState } from "react";
import { dayTasks, groupTasks, type Day, type Group } from "./types";
import DayCard, { dayLabel } from "./components/DayCard";

const modules = import.meta.glob<Day>("../data/days/*.json", { eager: true, import: "default" });
const DAYS: Day[] = Object.values(modules).sort((a, b) => b.date.localeCompare(a.date));

export interface Sel { date: string; path: string[] }

const same = (a: string[], b: string[]) => a.length === b.length && a.every((x, i) => x === b[i]);
const count = (ts: { checked: boolean }[]) => `${ts.filter((t) => t.checked).length}/${ts.length}`;

function Tree({ groups, base, sel, date, onPick }: {
  groups: Group[]; base: string[]; sel: Sel; date: string; onPick: (s: Sel) => void;
}) {
  return (
    <div className="tree">
      {groups.map((g) => {
        const path = [...base, g.name];
        const active = sel.date === date && same(sel.path, path);
        const open = sel.date === date && path.every((p, i) => sel.path[i] === p);
        return (
          <div key={g.name}>
            <button className={`item sub ${active ? "on" : ""}`} onClick={() => onPick({ date, path })}>
              {g.name}<span className="n">{count(groupTasks(g))}</span>
            </button>
            {open && g.groups && g.groups.length > 0 && (
              <Tree groups={g.groups} base={path} sel={sel} date={date} onPick={onPick} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function App() {
  const [sel, setSel] = useState<Sel>({ date: DAYS[0]?.date ?? "", path: [] });
  const day = DAYS.find((d) => d.date === sel.date);

  return (
    <div className="app">
      <aside className="side">
        <div className="brand"><div className="logo">W</div>Work Summary</div>
        <div className="sec">วันที่</div>
        {DAYS.map((d) => {
          const isDay = sel.date === d.date;
          return (
            <div key={d.date}>
              <button className={`item ${isDay && sel.path.length === 0 ? "on" : ""} ${isDay ? "cur" : ""}`}
                onClick={() => setSel({ date: d.date, path: [] })}>
                {dayLabel(d.date).short}
                <span className="n">{count(dayTasks(d))}</span>
              </button>
              {isDay && <Tree groups={d.groups} base={[]} sel={sel} date={d.date} onPick={setSel} />}
            </div>
          );
        })}
      </aside>

      <main className="main">
        {day ? <DayCard day={day} path={sel.path} onPick={setSel} /> : <div className="empty">ยังไม่มีข้อมูล</div>}
      </main>
    </div>
  );
}
