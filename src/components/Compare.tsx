import { useRef } from "react";

interface Props { before: string; after: string; caption?: string }

export default function Compare({ before, after, caption }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const afterImg = useRef<HTMLImageElement>(null);
  const knob = useRef<HTMLDivElement>(null);

  const set = (x: number) => {
    const r = box.current!.getBoundingClientRect();
    const p = Math.min(100, Math.max(0, ((x - r.left) / r.width) * 100));
    afterImg.current!.style.clipPath = `inset(0 0 0 ${p}%)`;
    knob.current!.style.left = p + "%";
  };

  return (
    <>
      <div
        className="compare"
        ref={box}
        onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); set(e.clientX); }}
        onPointerMove={(e) => { if (e.buttons) set(e.clientX); }}
      >
        <img src={before} alt="before" />
        <img className="after" ref={afterImg} src={after} alt="after" />
        <span className="lb l">BEFORE</span>
        <span className="lb r">AFTER</span>
        <div className="knob" ref={knob} />
      </div>
      {caption && <div className="cap">{caption}</div>}
    </>
  );
}
