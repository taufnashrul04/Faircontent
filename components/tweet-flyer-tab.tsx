"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import FlyerCanvas from "./flyer-canvas"

export default function TweetFlyerTab() {
  const [name, setName] = useState("")
  const [tweet, setTweet] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState("default")
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleDownload = () => {
    if (canvasRef.current) {
      const link = document.createElement("a")
      link.href = canvasRef.current.toDataURL("image/png")
      link.download = "fairblock-tweet-flyer.png"
      link.click()
    }
  }

  const handleShare = () => {
    const text = tweet || "Check out this amazing Fairblock flyer! #Gfairy"
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
    window.open(url, "_blank")
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Input Section */}
      <Card className="p-8 bg-white shadow-lg rounded-3xl">
        <h2 className="text-2xl font-bold text-[#2f4f84] mb-6">Create FairTweet</h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-[#2f4f84] mb-2">Template</label>
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedTemplate("default")}
                className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${
                  selectedTemplate === "default"
                    ? "bg-[#2f4f84] text-white"
                    : "bg-[#f0f8ff] text-[#2f4f84] border-2 border-[#7fc8f8]"
                }`}
              >
                Default
              </button>
              <button
                disabled
                className="flex-1 px-4 py-3 rounded-xl font-semibold bg-gray-200 text-gray-500 cursor-not-allowed"
              >
                Coming Soon
              </button>
            </div>
          </div>

          {/* Name Input */}
          <div>
            <label className="block text-sm font-semibold text-[#2f4f84] mb-2">Username</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter username"
              className="w-full px-4 py-3 border-2 border-[#7fc8f8] rounded-xl focus:outline-none focus:border-[#2f4f84] transition-colors"
            />
          </div>

          {/* Tweet Input */}
          <div>
            <label className="block text-sm font-semibold text-[#2f4f84] mb-2">Tweet Text</label>
            <textarea
              value={tweet}
              onChange={(e) => setTweet(e.target.value)}
              placeholder="Enter your tweet text"
              rows={5}
              className="w-full px-4 py-3 border-2 border-[#7fc8f8] rounded-xl focus:outline-none focus:border-[#2f4f84] transition-colors resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleDownload}
              className="flex-1 bg-[#2f4f84] text-white rounded-2xl py-3 hover:opacity-90 transition-opacity"
            >
              Download PNG
            </Button>
            <Button
              onClick={handleShare}
              className="flex-1 bg-[#7fc8f8] text-[#2f4f84] rounded-2xl py-3 hover:opacity-90 transition-opacity"
            >
              Share on Twitter
            </Button>
          </div>
        </div>
      </Card>

      {/* Preview Section */}
      <Card className="p-8 bg-white shadow-lg rounded-3xl flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-[#2f4f84] mb-6 w-full">Preview</h2>
        <div className="w-full flex justify-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#F6AAFF] via-[#58BDF6] to-[#D4FA62] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl -z-10"></div>
          <div className="relative p-1 rounded-2xl bg-gradient-to-r from-[#F6AAFF] via-[#58BDF6] to-[#D4FA62] animate-pulse">
            <div className="bg-white rounded-2xl overflow-hidden">
              <FlyerCanvas ref={canvasRef} type="tweet" name={name} tweet={tweet} />
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
