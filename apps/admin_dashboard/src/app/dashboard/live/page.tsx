"use client";

import React, { useState } from "react";
import {
  Radio,
  Video,
  Mic,
  MicOff,
  VideoOff,
  ScreenShare,
  Users,
  MessageSquare,
  Hand,
  Share2,
  ExternalLink,
  CheckCircle2,
  Settings,
  Sparkles,
  Volume2,
} from "lucide-react";
import { useSyncedStore } from "@/lib/syncedStore";

export default function LiveClassStudioPage() {
  const { courses, logAdminAction } = useSyncedStore();
  const [isBroadcasting, setIsBroadcasting] = useState(true);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(
    courses[0]?.title || "Physics Class 12: Electromagnetism & Wave Optics"
  );
  const [copiedLink, setCopiedLink] = useState(false);

  const roomUrl = "https://meet.jit.si/AetherEd_Physics_LiveClass_Master";

  const [raisedHands, setRaisedHands] = useState([
    { id: 1, name: "Aarav Patel", time: "2 min ago", topic: "Faraday Lenz Law sign convention" },
    { id: 2, name: "Priya Sharma", time: "Just now", topic: "Huygens Wavefront derivation" },
  ]);

  const [liveChat, setLiveChat] = useState([
    { sender: "Aarav Patel", text: "Sir, will this live class recording be saved in the Video Vault?", time: "18:32" },
    { sender: "Priya Sharma", text: "The ray diagram on slide 3 is so crystal clear! 🔥", time: "18:34" },
    { sender: "Neha Sundaram", text: "Can we review problem 4 from the assignment?", time: "18:35" },
  ]);

  const [chatInput, setChatInput] = useState("");

  const handleCopyLink = () => {
    navigator.clipboard.writeText(roomUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setLiveChat((prev) => [
      ...prev,
      { sender: "Dr. Vikram Seth (Host)", text: chatInput.trim(), time: "Now" },
    ]);
    setChatInput("");
  };

  const handleToggleBroadcast = () => {
    const nextState = !isBroadcasting;
    setIsBroadcasting(nextState);
    logAdminAction({
      user_id: "adm-001",
      user_name: "Dr. Vikram Seth",
      role: "Super Admin",
      action: nextState ? "Live Video Broadcast Started" : "Live Video Broadcast Ended",
      details: `${nextState ? "Started" : "Ended"} live classroom session for ${selectedCourse}`,
      ip_address: "103.21.244.12",
      status: "success",
    });
  };

  const handleDismissHand = (id: number) => {
    setRaisedHands((prev) => prev.filter((h) => h.id !== id));
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                isBroadcasting
                  ? "bg-red-500/20 text-red-400 border border-red-500/40"
                  : "bg-slate-800 text-slate-400 border border-slate-700"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isBroadcasting ? "bg-red-500 animate-ping" : "bg-slate-500"
                }`}
              />
              {isBroadcasting ? "LIVE BROADCAST ACTIVE" : "STUDIO STANDBY"}
            </span>
            <span className="text-xs text-cyan-400 font-medium tracking-wide">
              HD 1080P • JITSI MEET BRIDGE
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Live Classroom Studio
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Broadcast interactive video lectures, share your screen, and answer student questions in real-time.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 transition"
          >
            {copiedLink ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-cyan-400" />
                <span>Share Class Link</span>
              </>
            )}
          </button>

          <a
            href={roomUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open Zoom / Jitsi App</span>
          </a>

          <button
            onClick={handleToggleBroadcast}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg transition ${
              isBroadcasting
                ? "bg-red-600 hover:bg-red-700 text-white shadow-red-500/20"
                : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black shadow-cyan-500/20"
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>{isBroadcasting ? "End Broadcast" : "Start Live Class"}</span>
          </button>
        </div>
      </div>

      {/* Grid: Video Stage & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Main Video Broadcast Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex flex-col justify-between p-6">
            {/* Background Stage Graphic */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#090D16] via-[#0D1526] to-[#0A1020] -z-0" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-transparent to-transparent pointer-events-none" />

            {/* Stage Center Stage Display */}
            <div className="relative z-10 my-auto flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center p-1 shadow-2xl shadow-cyan-500/30">
                  <div className="w-full h-full rounded-full bg-[#0B101D] flex items-center justify-center">
                    <span className="text-2xl font-bold text-cyan-400">VS</span>
                  </div>
                </div>
                {isBroadcasting && (
                  <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center">
                    <Volume2 className="w-3 h-3 text-slate-950" />
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-white">Dr. Vikram Seth</h3>
              <p className="text-xs text-cyan-400 font-medium mt-0.5">
                Senior Instructor • Head of Physics
              </p>
              <div className="mt-3 px-3 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
                {selectedCourse}
              </div>
            </div>

            {/* Top Stage Bar */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md">
                <div className={`w-2 h-2 rounded-full ${isBroadcasting ? "bg-red-500" : "bg-slate-500"}`} />
                <span className="text-xs font-semibold text-white">
                  {isBroadcasting ? "01:24:18 Streaming" : "Paused"}
                </span>
                <span className="text-slate-500">|</span>
                <span className="text-xs text-slate-400">1080p Full HD</span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md text-xs text-slate-300">
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                <span>34 Students Attending</span>
              </div>
            </div>

            {/* Bottom Floating Action Bar */}
            <div className="relative z-10 flex items-center justify-center gap-3 pt-4">
              <button
                onClick={() => setIsMicMuted(!isMicMuted)}
                className={`p-3 rounded-xl border transition ${
                  isMicMuted
                    ? "bg-red-500/20 text-red-400 border-red-500/40 hover:bg-red-500/30"
                    : "bg-slate-900/90 text-slate-200 border-slate-700 hover:bg-slate-800"
                }`}
                title={isMicMuted ? "Unmute Mic" : "Mute Mic"}
              >
                {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setIsVideoOff(!isVideoOff)}
                className={`p-3 rounded-xl border transition ${
                  isVideoOff
                    ? "bg-red-500/20 text-red-400 border-red-500/40 hover:bg-red-500/30"
                    : "bg-slate-900/90 text-slate-200 border-slate-700 hover:bg-slate-800"
                }`}
                title={isVideoOff ? "Turn On Camera" : "Turn Off Camera"}
              >
                {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setIsScreenSharing(!isScreenSharing)}
                className={`p-3 rounded-xl border transition ${
                  isScreenSharing
                    ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/40 hover:bg-cyan-500/30"
                    : "bg-slate-900/90 text-slate-200 border-slate-700 hover:bg-slate-800"
                }`}
                title="Share Screen"
              >
                <ScreenShare className="w-5 h-5" />
              </button>

              <button
                onClick={handleCopyLink}
                className="p-3 rounded-xl bg-slate-900/90 text-slate-200 border border-slate-700 hover:bg-slate-800 transition"
                title="Share Live Room Link"
              >
                <Share2 className="w-5 h-5 text-cyan-400" />
              </button>
            </div>
          </div>

          {/* Broadcast Course Selector & Settings */}
          <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="flex-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Broadcast Course Session
                </label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-lg text-sm text-white px-3 py-1.5 mt-1 focus:border-cyan-500 focus:outline-none"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.title}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-xl">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Synced with Student Mobile App & In-App Video Vault</span>
            </div>
          </div>
        </div>

        {/* Right Col: Raised Hands Queue & Live Q&A Chat */}
        <div className="space-y-6">
          {/* Raised Hands Queue */}
          <div className="rounded-2xl bg-slate-900/50 border border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
              <div className="flex items-center gap-2">
                <Hand className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm text-white">Raised Hands Queue</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                {raisedHands.length} Waiting
              </span>
            </div>

            <div className="p-4 space-y-2.5 max-h-48 overflow-y-auto">
              {raisedHands.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4">No raised hands right now</p>
              ) : (
                raisedHands.map((h) => (
                  <div
                    key={h.id}
                    className="p-3 rounded-xl bg-slate-950/70 border border-amber-500/20 flex items-center justify-between gap-2"
                  >
                    <div>
                      <p className="text-xs font-semibold text-white">{h.name}</p>
                      <p className="text-[11px] text-amber-300/80 mt-0.5">{h.topic}</p>
                      <p className="text-[10px] text-slate-500">{h.time}</p>
                    </div>
                    <button
                      onClick={() => handleDismissHand(h.id)}
                      className="px-2.5 py-1 text-xs font-medium rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition"
                    >
                      Answer
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Live Classroom Q&A Chat */}
          <div className="rounded-2xl bg-slate-900/50 border border-slate-800 overflow-hidden flex flex-col h-80">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-sm text-white">Live Student Q&A</h3>
              </div>
              <span className="text-xs text-slate-400">{liveChat.length} messages</span>
            </div>

            <div className="flex-1 p-4 space-y-3 overflow-y-auto">
              {liveChat.map((msg, i) => (
                <div key={i} className="text-xs">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="font-bold text-slate-200">{msg.sender}</span>
                    <span className="text-[10px]">{msg.time}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-slate-300">
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendChat} className="p-3 border-t border-slate-800 bg-slate-950/70 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Broadcast response to students..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs rounded-xl transition"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
