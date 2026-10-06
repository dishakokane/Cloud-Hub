import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageContainer } from "@/components/PageContainer";
import { RobotAvatar } from "@/components/RobotAvatar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, User, Sparkles, Wifi, HardDrive, Server, KeyRound } from "lucide-react";

interface Message {
  id: string;
  role: "bot" | "user";
  content: string;
}

const FAQS = [
  { keywords: ["slow", "internet", "network", "wifi"], answer: "Network slowness is often caused by overloaded routers or ISP issues. Try restarting your router, switching to a wired connection, or running a speed test. If the problem persists for more than 30 minutes, file a Network ticket so our team can investigate." },
  { keywords: ["storage", "full", "space", "disk"], answer: "Storage issues usually mean a quota or volume is near capacity. Clear temporary files and old logs, then check your cloud storage usage in the provider console. If you need a quota increase, file a Storage ticket." },
  { keywords: ["server", "down", "503", "502", "outage", "crashed"], answer: "If a server is unreachable, first check the status page. Try restarting the affected service. If it stays down for more than 5 minutes, file a Server ticket marked High priority." },
  { keywords: ["hardware", "device", "monitor", "keyboard", "mouse", "printer"], answer: "For hardware faults, first restart the device and check cable connections. If the device is still not working, file a Hardware ticket with the model number and a description of the issue." },
  { keywords: ["software", "app", "application", "install", "update", "crash"], answer: "Software issues are often fixed by reinstalling the app or applying the latest update. Check the app's official documentation. If the problem persists, file a Software ticket with steps to reproduce." },
  { keywords: ["login", "sign in", "password", "forgot"], answer: "Use the Forgot Password link on the login page to receive a reset email. If you don't get an email within 5 minutes, check your spam folder or file a ticket." },
  { keywords: ["upload", "image", "screenshot"], answer: "When reporting an issue, you can attach a screenshot — supported formats are PNG, JPG, and WEBP. Max size is around 5 MB." },
];

const QUICK_PROMPTS = [
  { icon: Wifi, label: "My internet is slow", value: "My internet is very slow" },
  { icon: HardDrive, label: "Storage almost full", value: "My storage is almost full" },
  { icon: Server, label: "Server is down", value: "Server is down (503 error)" },
  { icon: KeyRound, label: "Forgot password", value: "I forgot my password" },
];

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "bot", content: "Hi! I'm your Cloud Hub assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    const query = text.toLowerCase();
    setTimeout(() => {
      let responseContent = "I'm not sure about that one. Please file a ticket and our team will help you out.";
      for (const faq of FAQS) {
        if (faq.keywords.some(kw => query.includes(kw))) {
          responseContent = faq.answer;
          break;
        }
      }
      const botMsg: Message = { id: (Date.now() + 1).toString(), role: "bot", content: responseContent };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 350 + Math.random() * 500);
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    sendMessage(input);
  };

  return (
    <PageContainer
      title="Chatbot Support"
      subtitle="Get quick answers to common cloud issues before filing a ticket."
    >
      <Card className="max-w-3xl mx-auto h-[640px] flex flex-col shadow-xl border-blue-100/60 overflow-hidden">
        {/* Header with gradient */}
        <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 text-white px-6 py-5">
          {/* Decorative grid */}
          <div
            className="absolute inset-0 opacity-[0.08] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
          <div className="relative flex items-center gap-3">
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="bg-white/15 backdrop-blur-md p-1.5 rounded-2xl ring-1 ring-white/20"
            >
              <RobotAvatar size={42} />
            </motion.div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">Chatbot</h3>
                <span className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider">
                  AI Assistant
                </span>
              </div>
              <p className="text-xs text-blue-100/90 flex items-center gap-1.5 mt-0.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-300" />
                </span>
                Online &middot; Replies in seconds
              </p>
            </div>
          </div>
        </div>

        <CardContent className="flex-1 p-0 overflow-hidden flex flex-col bg-gradient-to-b from-slate-50/50 to-white dark:from-slate-950/40 dark:to-slate-900/20">
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`flex gap-2.5 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : ""}`}
                  >
                    {msg.role === "bot" ? (
                      <div className="shrink-0">
                        <RobotAvatar size={36} animated={false} />
                      </div>
                    ) : (
                      <div className="h-9 w-9 shrink-0 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 text-white flex items-center justify-center shadow-md">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                    <div
                      className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                        msg.role === "bot"
                          ? "bg-white dark:bg-slate-800 border border-blue-100/70 dark:border-blue-900/40 text-foreground rounded-tl-sm"
                          : "bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-tr-sm"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2.5 max-w-[80%]"
                >
                  <div className="shrink-0">
                    <RobotAvatar size={36} />
                  </div>
                  <div className="bg-white dark:bg-slate-800 border border-blue-100/70 dark:border-blue-900/40 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1 shadow-sm">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
                  </div>
                </motion.div>
              )}

              {/* Quick prompts (shown only when conversation is fresh) */}
              {messages.length <= 1 && !isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="pl-12 pt-2"
                >
                  <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> Quick prompts
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_PROMPTS.map((q) => (
                      <button
                        key={q.label}
                        onClick={() => sendMessage(q.value)}
                        className="group flex items-center gap-1.5 text-xs bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-900/50 text-foreground rounded-full px-3 py-1.5 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:shadow-sm transition-all"
                      >
                        <q.icon className="h-3.5 w-3.5 text-blue-600 group-hover:text-blue-700" />
                        {q.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </ScrollArea>
        </CardContent>

        <CardFooter className="border-t bg-card p-3">
          <form onSubmit={handleSend} className="flex w-full gap-2">
            <Input
              placeholder="Ask the assistant anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 h-11 rounded-xl border-blue-100 focus-visible:ring-blue-400"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isTyping}
              className="h-11 w-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-600/30 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </PageContainer>
  );
}
