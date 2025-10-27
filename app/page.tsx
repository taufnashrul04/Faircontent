"use client"

import { useState } from "react"
import IDFlyerTab from "@/components/id-flyer-tab"
import TweetFlyerTab from "@/components/tweet-flyer-tab"

export default function Home() {
  const [activeTab, setActiveTab] = useState<"id" | "tweet" | "coming">("id")
  const [clickedCard, setClickedCard] = useState<string | null>(null)

  const handleCardClick = (cardType: string) => {
    setClickedCard(cardType)
    setTimeout(() => setClickedCard(null), 600)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] p-8 relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#D4FA62] rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-72 h-72 bg-[#F6AAFF] rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-[#58BDF6] rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10 flex-1">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold neon-primary mb-2 drop-shadow-lg">Fairblock Content Generator</h1>
          <p className="text-[#58BDF6] text-lg opacity-90 drop-shadow-md">
            Create stunning Fairblock content in seconds
          </p>
        </div>

        <div className="flex gap-4 justify-center mb-8 flex-wrap">
          <button
            onClick={() => setActiveTab("id")}
            className={`px-8 py-3 rounded-2xl font-semibold transition-all duration-300 ${
              activeTab === "id"
                ? "bg-neon-primary text-[#0a0e27] shadow-lg border-2 border-neon-primary"
                : "bg-transparent text-[#D4FA62] border-2 border-[#D4FA62] hover:shadow-lg hover:shadow-[#D4FA62]/50"
            }`}
          >
            FairCard
          </button>
          <button
            onClick={() => setActiveTab("tweet")}
            className={`px-8 py-3 rounded-2xl font-semibold transition-all duration-300 ${
              activeTab === "tweet"
                ? "bg-neon-secondary text-[#0a0e27] shadow-lg border-2 border-neon-secondary"
                : "bg-transparent text-[#F6AAFF] border-2 border-[#F6AAFF] hover:shadow-lg hover:shadow-[#F6AAFF]/50"
            }`}
          >
            FairTweet
          </button>
          <button
            onClick={() => setActiveTab("coming")}
            className={`px-8 py-3 rounded-2xl font-semibold transition-all duration-300 ${
              activeTab === "coming"
                ? "bg-neon-tertiary text-[#0a0e27] shadow-lg border-2 border-neon-tertiary"
                : "bg-transparent text-[#FFB164] border-2 border-[#FFB164] hover:shadow-lg hover:shadow-[#FFB164]/50"
            }`}
          >
            Coming Soon
          </button>
        </div>

        {/* Tab Content */}
        <div className="transition-opacity duration-300">
          {activeTab === "id" && (
            <div onClick={() => handleCardClick("id")} className={clickedCard === "id" ? "animate-click-pulse" : ""}>
              <IDFlyerTab />
            </div>
          )}
          {activeTab === "tweet" && (
            <div
              onClick={() => handleCardClick("tweet")}
              className={clickedCard === "tweet" ? "animate-click-pulse" : ""}
            >
              <TweetFlyerTab />
            </div>
          )}
          {activeTab === "coming" && (
            <div className="text-center py-20">
              <h2 className="text-4xl font-bold neon-secondary mb-4">Coming Soon</h2>
              <p className="text-[#58BDF6] text-xl opacity-80">More exciting content templates are on the way!</p>
            </div>
          )}
        </div>
      </div>

      <footer className="relative z-10 mt-12 text-center py-6 border-t border-[#58BDF6]/30">
        <p className="text-[#58BDF6] text-sm opacity-80">
          Creator{" "}
          <a
            href="https://x.com/taufnashrul"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link font-semibold"
          >
            Skypots
          </a>
          <span className="footer-separator">|</span>
          <a
            href="https://x.com/0xfairblock"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link font-semibold"
          >
            X Fairblock
          </a>
          <span className="footer-separator">|</span>
          <a
            href="https://fairblock.network"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link font-semibold"
          >
            Fairblock website
          </a>
        </p>
      </footer>
    </main>
  )
}
