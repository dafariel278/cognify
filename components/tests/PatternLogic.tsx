"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props { onComplete: (score: number, timeTaken: number, accuracy: number) => void; }

interface Q { sequence: number[]; answer: number; options: number[]; }

const TOTAL = 10, TIME = 120;

function makeQ(): Q {
  const templates = [
    () => { const d=Math.floor(Math.random()*5)+2, a=Math.floor(Math.random()*8)+1; return [a,a+d,a+2*d,a+3*d,a+4*d]; },
    () => { const d=Math.floor(Math.random()*3)+2, a=Math.floor(Math.random()*5)+2; const s=[a]; for(let i=0;i<4;i++)s.push(s[s.length-1]*d); return s; },
    () => { const d=Math.floor(Math.random()*4)+2, a=Math.floor(Math.random()*20)+20; const s=[a]; for(let i=0;i<4;i++)s.push(s[s.length-1]-d); return s; },
    () => { const s=[1,1,2,3,5,8,13,21,34,55]; const i=Math.floor(Math.random()*5); return s.slice(i,i+5); },
    () => { const s=[1,4,9,16,25,36,49,64,81]; const i=Math.floor(Math.random()*4); return s.slice(i,i+5); },
    () => { const d=Math.floor(Math.random()*3)+1, a=Math.floor(Math.random()*5)+2; return [a,a+d,a+3*d,a+6*d,a+10*d]; },
  ];
  const tpl = templates[Math.floor(Math.random()*templates.length)]();
  const answer = tpl[4];
  const seq    = tpl.slice(0, 4);
  const wrong  = new Set<number>();
  while (wrong.size < 3) { const v = answer + (Math.floor(Math.random()*12)-6); if (v !== answer && v > 0) wrong.add(v); }
  const options = [...Array.from(wrong), answer].sort(() => Math.random()-0.5) as number[];
  return { sequence: seq, answer, options };
}

export function PatternLogicTest({ onComplete }: Props) {
  const [qs]          = useState<Q[]>(() => Array.from({ length: TOTAL }, makeQ));
  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [sel, setSel] = useState<number | null>(null);
  const [time, setTime] = useState(TIME);
  const [done, setDone] = useState(false);
  const startTs = useState(() => Date.now())[0];

  useEffect(() => {
    if (done) return;
    const t = setInterval(() => setTime(p => {
      if (p <= 1) {
        clearInterval(t);
        const elapsed = Math.round((Date.now() - startTs) / 1000);
        onComplete(Math.round((correct/TOTAL)*100), elapsed, Math.round((correct/Math.max(idx,1))*100));
        return 0;
      }
      return p - 1;
    }), 1000);
    return () => clearInterval(t);
  }, [done, correct, idx, startTs, onComplete]);

  const pick = useCallback((v: number) => {
    if (sel !== null || done) return;
    setSel(v);
    const ok = v === qs[idx].answer;
    const nc = ok ? correct + 1 : correct;
    if (ok) setCorrect(nc);
    setTimeout(() => {
      setSel(null);
      const ni = idx + 1;
      if (ni >= TOTAL) {
        setDone(true);
        const elapsed = Math.round((Date.now() - startTs) / 1000);
        onComplete(Math.round((nc/TOTAL)*100), elapsed, Math.round((nc/TOTAL)*100));
      } else { setIdx(ni); }
    }, 500);
  }, [sel, done, idx, qs, correct, startTs, onComplete]);

  const q = qs[idx];
  const pct = time / TIME;

  return (
    <div className="w-full max-w-lg mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-mono text-lo">
          <span>{idx+1}/{TOTAL}</span>
          <span className={pct < 0.3 ? "text-red-400 font-bold" : pct < 0.5 ? "text-yellow-400" : "text-mid"}>{time}s</span>
        </div>
        <div className="h-1 bg-border rounded-full overflow-hidden">
          <div className="h-full bg-brand rounded-full transition-all duration-500"
            style={{ width:`${(idx/TOTAL)*100}%` }} />
        </div>
        <div className="h-1 bg-border rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-1000 ${pct<0.3?"bg-red-500":pct<0.5?"bg-yellow-500":"bg-secure"}`}
            style={{ width:`${pct*100}%` }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={idx} initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}
          transition={{ duration: 0.2 }}
          className="bg-surface border border-border rounded-2xl p-6"
        >
          <p className="text-xs font-mono text-lo uppercase tracking-widest mb-5">What comes next in the sequence?</p>

          <div className="flex items-center gap-2.5 mb-6 flex-wrap">
            {q.sequence.map((n, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-raised border border-border flex items-center justify-center font-mono font-bold text-hi text-lg">
                  {n}
                </div>
                <span className="text-lo text-sm">→</span>
              </div>
            ))}
            <div className="w-12 h-12 rounded-xl border-2 border-dashed border-brand/30 flex items-center justify-center">
              <span className="font-bold text-xl text-brand-light">?</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {q.options.map(v => {
              const isOk  = v === q.answer;
              const isSel = v === sel;
              return (
                <motion.button key={v} whileTap={{ scale:0.95 }} onClick={() => pick(v)} disabled={sel !== null}
                  className={`h-13 py-3 rounded-xl font-mono font-bold text-xl border transition-all ${
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
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between text-xs font-mono text-lo">
        <span>Correct: {correct}/{idx > 0 ? idx : 1}</span>
        <span>Accuracy: {idx > 0 ? Math.round((correct/idx)*100) : 100}%</span>
      </div>
    </div>
  );
}
