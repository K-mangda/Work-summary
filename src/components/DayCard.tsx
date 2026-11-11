import type { Day, Group, Task } from "../types";
import { dayTasks, groupTasks } from "../types";
import type { Sel } from "../App";
import Compare from "./Compare";

export const dayLabel = (iso: string) => {
  const dt = new Date(iso + "T00:00:00");
  return {
    main: dt.toLocaleDateString("th-TH", { day: "numeric", month: "long", year: "numeric" }),
    short: dt.toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "2-digit" }),
    wd: dt.toLocaleDateString("th-TH", { weekday: "long" }),
  };
};

function TaskRow({ t }: { t: Task }) {
  return (
    <div className={`task ${t.checked ? "is-checked" : ""}`}>
      <span className="tick" aria-label={t.checked ? "เสร็จแล้ว" : "ยังไม่เสร็จ"} />
      <div>
        <div className="t-title">{t.title}</div>
        <div className="meta">
          <span className={`badge s-${t.status}`}>{t.status}</span>
          {t.tags?.map((x) => <span key={x} className="tag">#{x}</span>)}
        </div>
        {t.result && <p className="line"><b>ผลลัพธ์</b>{t.result}</p>}
        {t.notes && <p className="line"><b>หมายเหตุ</b>{t.notes}</p>}
        {t.subtasks && t.subtasks.length > 0 && (
          <ul className="subs">
            {t.subtasks.map((s, i) => (
              <li key={i} className={s.checked ? "ck" : ""}>
                <i />
                <span>{s.title}{s.note && <small>{s.note}</small>}</span>
              </li>
            ))}
          </ul>
        )}
        {t.compare && <Compare {...t.compare} />}
      </div>
    </div>
  );
}

function Progress({ tasks }: { tasks: Task[] }) {
  const done = tasks.filter((t) => t.checked).length;
  const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  return (
    <div className="progress">
      <div className="bar"><i style={{ width: pct + "%" }} /></div>
      <span>เสร็จ {done} จาก {tasks.length} งาน</span>
    </div>
  );
}

function Section({ g, level }: { g: Group; level: number }) {
  const all = groupTasks(g);
  return (
    <section className={`grp lv${level}`}>
      <div className="grp-head">
        <h2>{g.name}</h2>
        <span className="grp-cnt">{all.filter((t) => t.checked).length}/{all.length}</span>
      </div>
      {g.tasks && g.tasks.length > 0 && (
        <div className="panel">{g.tasks.map((t) => <TaskRow key={t.id} t={t} />)}</div>
      )}
      {g.groups?.map((c) => <Section key={c.name} g={c} level={level + 1} />)}
    </section>
  );
}

export default function DayCard({ day, path, onPick }: { day: Day; path: string[]; onPick: (s: Sel) => void }) {
  const f = dayLabel(day.date);

  // หา group ตาม path
  let cur: Group | undefined;
  let list = day.groups;
  for (const name of path) {
    cur = list.find((g) => g.name === name);
    if (!cur) break;
    list = cur.groups ?? [];
  }

  // หน้าภาพรวมของวัน: การ์ดหมวด (ไม่เลื่อนยาว)
  if (!cur) {
    const all = dayTasks(day);
    return (
      <article className="day" key={day.date}>
        <div className="page-eyebrow">{f.wd}</div>
        <h1>{f.main}</h1>
        {day.summary && <p className="lead">{day.summary}</p>}
        <Progress tasks={all} />
        <div className="cards">
          {day.groups.map((g) => {
            const ts = groupTasks(g);
            const done = ts.filter((t) => t.checked).length;
            const pct = ts.length ? Math.round((done / ts.length) * 100) : 0;
            return (
              <button key={g.name} className="card" onClick={() => onPick({ date: day.date, path: [g.name] })}>
                <div className="card-top"><h3>{g.name}</h3><span>{done}/{ts.length}</span></div>
                {g.groups && g.groups.length > 0 && (
                  <div className="card-sub">{g.groups.map((c) => c.name).join(" · ")}</div>
                )}
                <div className="bar"><i style={{ width: pct + "%" }} /></div>
              </button>
            );
          })}
        </div>
      </article>
    );
  }

  const ts = groupTasks(cur);
  return (
    <article className="day" key={day.date + path.join("/")}>
      <div className="crumbs">
        <button onClick={() => onPick({ date: day.date, path: [] })}>{f.main}</button>
        {path.map((p, i) => (
          <span key={i}>
            <i>/</i>
            <button onClick={() => onPick({ date: day.date, path: path.slice(0, i + 1) })}>{p}</button>
          </span>
        ))}
      </div>
      <h1>{cur.name}</h1>
      <Progress tasks={ts} />
      {cur.tasks && cur.tasks.length > 0 && (
        <div className="panel">{cur.tasks.map((t) => <TaskRow key={t.id} t={t} />)}</div>
      )}
      {cur.groups?.map((c) => <Section key={c.name} g={c} level={2} />)}
    </article>
  );
}
