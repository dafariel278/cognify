"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

interface Props { onComplete: (score: number, timeTaken: number, accuracy: number) => void; }

type Phase = "ready" | "show" | "input" | "round-ok" | "done";

const ROUNDS = [
  { length: 3, showMs: 2200 },
  { length: 4, showMs: 2800 },
  { length: 5, showMs: 3400 },
  { length: 6, showMs: 4000 },
  { length: 7, showMs: 4600 },
];

function useAudio() {
  const ctx = useRef<AudioContext | null>(null);
  const muted = useRef(false);
  const [isMuted, setIsMuted] = useState(false);

  const play = useCallback((freq: number, dur = 0.12, vol = 0.14, type: OscillatorType = "sine", delay = 0) => {
    if (muted.current) return;
    try {
      if (!ctx.current) ctx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (ctx.current.state === "suspended") ctx.current.resume();
      const o = ctx.current.createOscillator(), g = ctx.current.createGain();
      o.connect(g); g.connect(ctx.current.destination);
      o.type = type; o.frequency.setValueAtTime(freq, ctx.current.currentTime + delay);
      g.gain.setValueAtTime(vol, ctx.current.currentTime + delay);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.current.currentTime + delay + dur);
      o.start(ctx.current.currentTime + delay); o.stop(ctx.current.currentTime + delay + dur + 0.02);
    } catch {}
  }, []);

  return {
    isMuted, toggle: () => { muted.current = !muted.current; setIsMuted(muted.current); },
    reveal:  () => { play(440, 0.35, 0.1); play(554, 0.3, 0.08, "sine", 0.12); },
    correct: (n: number) => play(440 * Math.pow(1.09, n), 0.1, 0.15),
    wrong:   () => { play(160, 0.3, 0.2, "sawtooth"); play(130, 0.25, 0.15, "sawtooth", 0.12); },
    win:     () => [523,659,784,1047].forEach((f,i) => play(f, 0.3, 0.13, "sine", i*0.1)),
  };
}

function shuffle(n: number) {
  const a = Array.from({ length: n }, (_, i) => i + 1);
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
  return a;
}

export function MemorySequenceTest({ onComplete }: Props) {
  const audio = useAudio();
  const [phase, setPhase]     = useState<Phase>("ready");
  const [rIdx, setRIdx]       = useState(0);
  const [seq, setSeq]         = useState<number[]>([]);
  const [input, setInput]     = useState<number[]>([]);
  const [lit, setLit]         = useState<number | null>(null);
  const [wrong, setWrong]     = useState(false);
  const [wonRounds, setWon]   = useState(0);
  const [startTs, setStartTs] = useState(0);
  const [mistakes, setMistakes] = useState(0);

  const startRound = useCallback((idx: number) => {
    const round = ROUNDS[idx];
    const s = shuffle(round.length);
    setSeq(s); setInput([]); setPhase("show"); audio.reveal();
    s.forEach((_, i) => {
      setTimeout(() => setLit(s[i]),       i * 550);
      setTimeout(() => setLit(null),        i * 550 + 380);
    });
    setTimeout(() => { setLit(null); setPhase("input"); }, s.length * 550 + 500);
  }, [audio]);

  const begin = () => { setStartTs(Date.now()); startRound(0); };

  const tap = useCallback((n: number) => {
    if (phase !== "input") return;
    const next = [...input, n];
    const pos  = next.length - 1;
    if (n !== seq[pos]) {
      audio.wrong(); setWrong(true); setMistakes(m => m + 1);
      setTimeout(() => { setWrong(false); setPhase("done"); }, 700);
      return;
    }
    audio.correct(pos); setInput(next);
    if (next.length === seq.length) {
      const won = wonRounds + 1; setWon(won); setPhase("round-ok");
      if (rIdx + 1 >= ROUNDS.length) {
        audio.win();
        setTimeout(() => {
          const elapsed = Math.round((Date.now() - startTs) / 1000);
          const score   = 100;
          const acc     = Math.round(((ROUNDS.reduce((s,r)=>s+r.length,0)) / (ROUNDS.reduce((s,r)=>s+r.length,0) + mistakes)) * 100);
          onComplete(score, elapsed, Math.min(100, acc));
        }, 900);
      } else {
        setTimeout(() => { setRIdx(r => r+1); startRound(rIdx+1); }, 1100);
      }
    }
  }, [phase, input, seq, rIdx, wonRounds, mistakes, startTs, audio, onComplete, startRound]);

  const score = Math.round((wonRounds / ROUNDS.length) * 100);

  return (
    <div className="flex flex-col items-center gap-7 w-full max-w-md mx-auto">
      {/* Top bar */}
      <div className="w-full flex items-center justify-between">
        <div className="flex gap-1.5">
          {ROUNDS.map((_, i) => (
            <div key={i} className={`h-1.5 w-8 rounded-full transition-all duration-500 ${
              i < wonRounds ? "bg-brand" : i === rIdx && phase !== "ready" ? "bg-brand/40 animate-pulse" : "bg-border"
            }`} />
          ))}
        </div>
        <button onClick={audio.toggle} className="p-2 rounded-lg border border-border text-lo hover:text-mid transition-colors">
          {audio.isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {phase === "ready" && (
          <motion.div key="ready" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="text-center space-y-4">
            <p className="text-mid text-sm">5 rounds · Sequences from 3 to 7 numbers</p>
            <p className="text-lo text-xs">Watch the numbers light up, then recall in the same order.</p>
            <button onClick={begin}
              className="px-8 py-3 rounded-lg bg-brand text-white font-medium shadow-brand hover:bg-brand-dark hover:-translate-y-0.5 transition-all">
              Begin Assessment
            </button>
          </motion.div>
        )}

        {(phase === "show" || phase === "input" || phase === "round-ok") && (
          <motion.div key="game" initial={{ opacity:0 }} animate={{ opacity:1 }} className="w-full space-y-5">
            <div className="text-center">
              <p className="font-mono text-xs text-lo uppercase tracking-widest mb-1">
                Round {rIdx+1} / {ROUNDS.length} — Sequence of {ROUNDS[rIdx].length}
              </p>
              <p className={`text-sm font-medium transition-colors ${
                phase === "show" ? "text-brand-light" :
                phase === "round-ok" ? "text-success" : "text-yellow-400"
              }`}>
                {phase === "show" ? "Memorize the sequence…" :
                 phase === "round-ok" ? "Round complete!" :
                 `Select ${seq.length} numbers in order`}
              </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-3 gap-3 max-w-[280px] mx-auto">
              {Array.from({ length: 9 }, (_, i) => i + 1).map(n => {
                const isLit      = lit === n;
                const isSelected = input.includes(n);
                const inSeq      = seq.includes(n);
                const selIdx     = input.indexOf(n);
                return (
                  <motion.button key={n}
                    whileTap={{ scale: 0.88 }}
                    animate={isLit ? { scale: 1.1 } : { scale: 1 }}
                    onClick={() => tap(n)}
                    disabled={phase !== "input" || isSelected}
                    className={`aspect-square rounded-xl font-mono font-bold text-lg border transition-all duration-150 ${
                      isLit
                        ? "bg-brand border-brand text-white shadow-brand scale-110"
                        : isSelected
                        ? "bg-success/15 border-success/40 text-success cursor-default"
                        : phase === "input"
                        ? "bg-raised border-border text-hi hover:border-brand/50 hover:bg-brand/8 cursor-pointer"
                        : "bg-surface border-border text-lo cursor-default"
                    }`}
                  >
                    {isSelected ? <span className="text-xs font-bold">{selIdx + 1}</span> : n}
                  </motion.button>
                );
              })}
            </div>

            {/* Progress dots */}
            <div className="flex gap-2 justify-center">
              {seq.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full transition-all ${
                  i < input.length ? "bg-success" : "bg-border"
                }`} />
              ))}
            </div>

            {wrong && (
              <motion.p initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }}
                className="text-center text-red-400 text-sm font-medium">
                Wrong order — sequence broken
              </motion.p>
            )}
          </motion.div>
        )}

        {phase === "done" && (
          <motion.div key="done" initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
            className="text-center space-y-3">
            <p className="text-4xl">❌</p>
            <p className="font-display font-bold text-hi text-xl">Sequence broken at round {rIdx + 1}</p>
            <p className="text-mid text-sm">Score: {score}% · {wonRounds}/{ROUNDS.length} rounds completed</p>
            <button onClick={begin}
              className="px-7 py-2.5 rounded-lg bg-brand text-white font-medium hover:bg-brand-dark transition-all">
              Retry
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full flex justify-between text-xs font-mono text-lo pt-2 border-t border-border">
        <span>Rounds: {wonRounds}/{ROUNDS.length}</span>
        <span>Score: {score}%</span>
      </div>
    </div>
  );
}
