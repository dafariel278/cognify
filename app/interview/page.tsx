"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { useWallet } from "@/context/WalletContext";
import { getBadges } from "@/lib/data/storage";
import { BadgeRecord } from "@/lib/types";
import { Send, Bot, User, Loader2, Sparkles } from "lucide-react";

interface Message { role:"user"|"assistant"; content:string; }

const NOUS_API = "https://inference-api.nousresearch.com/v1/chat/completions";

export default function InterviewPage() {
  const { address, isConnected, connect } = useWallet();
  const [badges, setBadges] = useState<BadgeRecord[]>([]);
  const [apiKey] = useState(process.env.NEXT_PUBLIC_AI_KEY || "");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [role, setRole] = useState("Software Engineer");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if(address) setBadges(getBadges(address)); }, [address]);
  useEffect(() => { bottomRef.current?.scrollIntoView({behavior:"smooth"}); }, [messages]);

  const buildSystemPrompt = () => {
    const badgeSummary = badges.map(b=>`${b.testTitle}: ${b.tier} (${b.score}/100, Top ${b.percentile}%)`).join(", ");
    return `You are an expert technical interviewer for a ${role} position. The candidate has verified cognitive assessments: ${badgeSummary || "no badges yet"}.

Your role:
- Ask relevant interview questions based on their cognitive profile
- If they have Gold memory badges, ask about complex system design
- If they have strong logic scores, probe analytical thinking
- Give encouraging but honest feedback after each answer
- After 5 questions, provide a detailed hiring recommendation

Start with a warm professional greeting, mention their badge performance, and ask your first interview question. Keep responses concise and conversational.`;
  };

  const startInterview = async () => {
    if (!apiKey.trim()) return alert("Please enter your Nous API key");
    setStarted(true);
    setLoading(true);
    try {
      const res = await fetch(NOUS_API, {
        method:"POST",
        headers:{"Content-Type":"application/json","Authorization":"Bearer "+apiKey},
        body: JSON.stringify({
          model:"Hermes-4-70B",
          max_tokens:512,
          messages:[{role:"system",content:buildSystemPrompt()},{role:"user",content:"Start the interview."}]
        })
      });
      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || "Hello! Let's begin your interview.";
      setMessages([{role:"assistant",content:reply}]);
    } catch(e) { setMessages([{role:"assistant",content:"Hello! I'm ready to conduct your interview. Please tell me about yourself."}]); }
    setLoading(false);
  };

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = {role:"user", content:input};
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs); setInput(""); setLoading(true);
    try {
      const res = await fetch(NOUS_API, {
        method:"POST",
        headers:{"Content-Type":"application/json","Authorization":"Bearer "+apiKey},
        body: JSON.stringify({
          model:"Hermes-4-70B",
          max_tokens:512,
          messages:[
            {role:"system",content:buildSystemPrompt()},
            ...newMsgs.map(m=>({role:m.role,content:m.content}))
          ]
        })
      });
      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || "Interesting answer. Let me ask you something else.";
      setMessages(p=>[...p,{role:"assistant",content:reply}]);
    } catch(e) { setMessages(p=>[...p,{role:"assistant",content:"Thank you for that answer. Let's continue."}]); }
    setLoading(false);
  };

  if (!isConnected) return (
    <main className="min-h-screen bg-base dot-grid">
      <Navbar />
      <div className="flex items-center justify-center min-h-[80vh] pt-16">
        <div className="text-center max-w-sm px-6">
          <Bot className="h-16 w-16 text-lo mx-auto mb-4"/>
          <h2 className="font-display text-2xl font-bold text-hi mb-3">AI Interview Prep</h2>
          <p className="text-mid mb-6">Practice interviews powered by COGNIFY AI, personalized to your skill badges.</p>
          <button onClick={connect} className="px-7 py-3 rounded-lg bg-brand text-white font-medium shadow-brand hover:bg-brand-dark transition-all">Connect Wallet</button>
        </div>
      </div>
    </main>
  );

  return (
    <main className="min-h-screen bg-base dot-grid flex flex-col">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 pt-24 pb-6 w-full flex-1 flex flex-col">
        {!started ? (
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} className="space-y-5">
            <div>
              <p className="text-xs font-mono text-brand-light uppercase tracking-widest mb-2">AI Interview Prep</p>
              <h1 className="font-display text-4xl font-bold text-hi mb-2">Practice with COGNIFY AI.</h1>
              <p className="text-mid">Get a personalized mock interview based on your verified COGNIFY badges.</p>
            </div>

            {badges.length > 0 && (
              <div className="p-4 bg-surface border border-border rounded-xl">
                <p className="text-xs text-lo font-mono mb-2">Your badges (used to personalize questions)</p>
                <div className="flex flex-wrap gap-2">
                  {badges.map(b=>(
                    <span key={b.id} className="text-xs px-2 py-1 rounded-lg bg-brand-dim border border-brand/15 text-brand-light">
                      {b.tier==="gold"?"🥇":b.tier==="silver"?"🥈":"🥉"} {b.testTitle} · {b.score}/100
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="text-xs text-lo font-mono block mb-1.5">Target role</label>
                <select value={role} onChange={e=>setRole(e.target.value)}
                  className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-hi text-sm focus:border-brand/50 focus:outline-none">
                  {["Software Engineer","Data Scientist","Product Manager","Finance Analyst","Research Scientist","DevOps Engineer"].map(r=>(
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

            </div>

            <motion.button whileHover={{scale:1.01,y:-1}} onClick={startInterview}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-brand text-white font-display font-bold shadow-brand hover:bg-brand-dark transition-all">
              <Sparkles className="h-5 w-5"/>Start COGNIFY AI Interview
            </motion.button>
          </motion.div>
        ) : (
          <div className="flex flex-col flex-1">
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border">
              <div className="w-9 h-9 rounded-xl bg-brand-dim border border-brand/20 flex items-center justify-center">
                <Bot className="h-5 w-5 text-brand-light"/>
              </div>
              <div>
                <p className="font-display font-bold text-hi">COGNIFY AI Interviewer</p>
                <p className="text-xs text-lo">{role} Interview · Personalized to your badges</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5 text-xs text-success">
                <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"/>Live
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-[50vh]">
              {messages.map((m,i)=>(
                <motion.div key={i} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
                  className={`flex gap-3 ${m.role==="user"?"flex-row-reverse":""}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${m.role==="user"?"bg-raised border border-border":"bg-brand-dim border border-brand/20"}`}>
                    {m.role==="user"?<User className="h-4 w-4 text-mid"/>:<Bot className="h-4 w-4 text-brand-light"/>}
                  </div>
                  <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${m.role==="user"?"bg-brand text-white":"bg-surface border border-border text-mid"}`}>
                    {m.content}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-dim border border-brand/20 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-brand-light"/>
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-surface border border-border">
                    <Loader2 className="h-4 w-4 text-brand-light animate-spin"/>
                  </div>
                </div>
              )}
              <div ref={bottomRef}/>
            </div>

            <div className="flex gap-3">
              <input value={input} onChange={e=>setInput(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send()}
                placeholder="Type your answer..."
                className="flex-1 px-4 py-3 bg-surface border border-border rounded-xl text-hi text-sm placeholder:text-lo focus:border-brand/50 focus:outline-none transition-colors"/>
              <button onClick={send} disabled={loading||!input.trim()}
                className="px-4 py-3 rounded-xl bg-brand text-white hover:bg-brand-dark disabled:opacity-40 transition-all">
                <Send className="h-4 w-4"/>
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
