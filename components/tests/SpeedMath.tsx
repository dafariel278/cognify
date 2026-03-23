"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props { onComplete: (score: number, timeTaken: number, accuracy: number) => void; }
type Op = "+" | "-" | "×" | "÷";

interface Q { a: number; b: number; op: Op; answer: number; options: number[]; }

const TOTAL = 15, TIME = 60;

function makeQ(diff: number): Q {
  const ops: Op[] = diff < 4 ? ["+","-"] : diff < 9 ? ["+","-","×"] : ["+","-","×","÷"];
  const op = ops[Math.floor(Math.random()*ops.length)];
  let a: number, b: number, answer: number;
  if (op === "+") { a=Math.floor(Math.random()*(15+diff*4))+5; b=Math.floor(Math.random()*(15+diff*4))+5; answer=a+b; }
  else if (op === "-") { a=Math.floor(Math.random()*(25+diff*5))+20; b=Math.floor(Math.random()*a)+1; answer=a-b; }
  else if (op === "×") { a=Math.floor(Math.random()*(4+Math.floor(diff/2)))+2; b=Math.floor(Math.random()*(4+Math.floor(diff/2)))+2; answer=a*b; }
  else { b=Math.floor(Math.random()*8)+2; answer=Math.floor(Math.random()*10)+2; a=b*answer; }
  const wrong = new Set<number>();
  while (wrong.size < 3) { const d=Math.floor(Math.random()*8)-4; const v=answer+d; if (d!==0&&v>0) wrong.add(v); }
  return { a, b, op, answer, options: [...Array.from(wrong), answer].sort(()=>Math.random()-0.5) as number[] };
}

export function SpeedMathTest({ onComplete }: Props) {
  const [qIdx, setQIdx]       = useState(0);
  const [q, setQ]             = useState<Q>(() => makeQ(0));
  const [correct, setCorrect] = useState(0);
  const [sel, setSel]         = useState<number | null>(null);
  const [time, setTime]       = useState(TIME);
  const [streak, setStreak]   = useState(0);
  const startTs               = useState(() => Date.now())[0];

  useEffect(() => {
    const t = setInterval(() => setTime(p => {
      if (p <= 1) {
        clearInterval(t);
        const elapsed = Math.round((Date.now()-startTs)/1000);
        const sc = Math.round((correct/TOTAL)*100);
        onComplete(sc, elapsed, Math.round((correct/Math.max(qIdx,1))*100));
        return 0;
      }
      return p - 1;
    }), 1000);
    return () => clearInterval(t);
  }, [correct, qIdx, startTs, onComplete]);

  const pick = useCallback((v: number) => {
    if (sel !== null) return;
    setSel(v);
    const ok = v === q.answer;
    const nc = ok ? correct + 1 : correct;
    const ns = ok ? streak + 1 : 0;
    if (ok) { setCorrect(nc); setStreak(ns); } else { setStreak(0); }
    setTimeout(() => {
      setSel(null);
      const ni = qIdx + 1;
      if (ni >= TOTAL) {
        const elapsed = Math.round((Date.now()-startTs)/1000);
        onComplete(Math.round((nc/TOTAL)*100), elapsed, Math.round((nc/TOTAL)*100));
      } else { setQIdx(ni); setQ(makeQ(Math.floor(ni/3))); }
    }, 350);
  }, [sel, q, correct, streak, qIdx, startTs, onComplete]);

  const pct = time / TIME;

  return (
    <div className="w-full max-w-sm mx-auto space-y-5">
      {/* Timer + progress */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-mono text-lo">
          <span>{qIdx+1}/{TOTAL} questions</span>
          <span className={pct<0.3?"text-red-400 font-bold":pct<0.5?"text-yellow-400":"text-mid"}>{time}s</span>
        </div>
        <div className="h-2 bg-border rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-1000 ${pct<0.3?"bg-red-500":pct<0.5?"bg-yellow-500":"bg-secure"}`}
            style={{ width:`${pct*100}%` }} />
        </div>
        {streak >= 3 && (
          <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }}
            className="text-center text-xs font-medium text-yellow-400">
            🔥 {streak} in a row!
          </motion.p>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={qIdx} initial={{ opacity:0, scale:0.96 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }}
          className="bg-surface border border-border rounded-2xl p-8 text-center"
        >
          <p className="font-mono text-[42px] font-bold text-hi leading-none mb-1">
            {q.a} <span className="text-brand-light">{q.op}</span> {q.b}
          </p>
          <p className="text-lo font-mono text-sm">= ?</p>
        </motion.div>
      </AnimatePresence>

      <div className="grid grid-cols-2 gap-3">
        {q.options.map(v => {
          const isSel = v === sel;
          const isOk  = v === q.answer;
          return (
            <motion.button key={v} whileTap={{ scale:0.93 }} onClick={() => pick(v)} disabled={sel !== null}
              className={`py-3.5 rounded-xl font-mono font-bold text-2xl border transition-all ${
                isSel && isOk  ? "bg-success/15 border-success/50 text-success"
                : isSel        ? "bg-red-500/15 border-red-500/50 text-red-400"
                : sel && isOk  ? "bg-success/10 border-success/30 text-success"
                : "bg-raised border-border text-hi hover:border-brand/40 hover:bg-brand/8"
              }`}>
              {v}
            </motion.button>
          );
        })}
      </div>

      <div className="flex justify-between text-xs font-mono text-lo">
        <span>Correct: {correct}</span>
        <span>Accuracy: {qIdx > 0 ? Math.round((correct/qIdx)*100) : 100}%</span>
      </div>
    </div>
  );
}
