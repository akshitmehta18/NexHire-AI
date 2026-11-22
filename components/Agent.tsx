"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { interviewer } from "@/constants";
import { Bot, User, PhoneCall, PhoneOff } from "lucide-react";
import { Button } from "./ui/button";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface AgentProps {
  userName?: string;
  userId?: string;
  type?: string;
  questions?: string[];
}

const Agent = ({
  userName = "Candidate",
  userId = "user_1",
  type = "generate",
  questions,
}: AgentProps) => {
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
    const onCallEnd = () => setCallStatus(CallStatus.FINISHED);
    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
    };
  }, []);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);
    try {
      if (type === "generate") {
        await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID || "demo-workflow", {
          variableValues: {
            username: userName,
            userid: userId,
          },
        });
      } else {
        await vapi.start(interviewer);
      }
    } catch (e) {
      console.warn("Call connection note:", e);
      setCallStatus(CallStatus.FINISHED);
    }
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  return (
    <div className="glass-panel border-border/80 rounded-2xl p-8 space-y-6 max-w-lg mx-auto text-center">
      <div className="flex items-center justify-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center text-white relative">
            <Bot className="w-10 h-10" />
            {isSpeaking && <span className="absolute -inset-2 rounded-full bg-indigo-500/30 animate-ping" />}
          </div>
          <span className="text-xs font-semibold">AI Interviewer</span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center text-foreground">
            <User className="w-10 h-10" />
          </div>
          <span className="text-xs font-semibold">{userName}</span>
        </div>
      </div>

      <div className="pt-4">
        {callStatus !== CallStatus.ACTIVE ? (
          <Button
            onClick={handleCall}
            className="rounded-full px-8 py-6 text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white gap-2 shadow-lg"
          >
            <PhoneCall className="w-4 h-4" />
            {callStatus === CallStatus.CONNECTING ? "Connecting Audio..." : "Start Voice Call"}
          </Button>
        ) : (
          <Button
            onClick={handleDisconnect}
            variant="destructive"
            className="rounded-full px-8 py-6 text-sm font-bold gap-2 shadow-lg"
          >
            <PhoneOff className="w-4 h-4" />
            End Call
          </Button>
        )}
      </div>
    </div>
  );
};

export default Agent;
