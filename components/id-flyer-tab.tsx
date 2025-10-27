"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import FlyerCanvas from "./flyer-canvas"

const TEMPLATES = {
  id1: {
    name: "Template 1",
    backgroundImage: "/backgrounds/id1.png",
  },
  id2: {
    name: "Template 2",
    backgroundImage: "/backgrounds/id2.png",
  },
  id3: {
    name: "Template 3",
    backgroundImage: "/backgrounds/id3.png",
  },
  id4: {
    name: "Template 4",
    backgroundImage: "/backgrounds/id4.png",
  },
  id5: {
    name: "Template 5",
    backgroundImage: "/backgrounds/id5.png",
  },
  id6: {
    name: "Template 6",
    backgroundImage: "/backgrounds/id6.png",
  },
}

export default function IDFlyerTab() {
  const [username, setUsername] = useState("")
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof TEMPLATES>("id1")
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setProfileImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDownload = () => {
    if (canvasRef.current) {
      const link = document.createElement("a")
      link.href = canvasRef.current.toDataURL("image/png")
      link.download = "fairblock-id-flyer.png"
      link.click()
    }
  }

  const handleShare = () => {
    const text = `Just joined the #Fairblock community 🧩 #Gfairy`
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
    window.open(url, "_blank")
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Input Section */}
      <Card className="p-8 bg-white shadow-lg rounded-3xl">
        <h2 className="text-2xl font-bold text-[#2f4f84] mb-6">Create FairCard</h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-[#2f4f84] mb-3">Template</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(TEMPLATES).map(([key, template]) => (
                <button
                  key={key}
                  onClick={() => setSelectedTemplate(key as keyof typeof TEMPLATES)}
                  className={`px-4 py-3 rounded-xl font-semibold transition-all text-sm ${
                    selectedTemplate === key
                      ? "bg-[#2f4f84] text-white"
                      : "bg-[#f0f8ff] text-[#2f4f84] border-2 border-[#7fc8f8]"
                  }`}
                >
                  {template.name}
                </button>
              ))}
            </div>
          </div>

          {/* Profile Picture Upload */}
          <div>
            <label className="block text-sm font-semibold text-[#2f4f84] mb-3">Profile Picture</label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleProfileImageUpload}
                className="hidden"
                id="profile-upload"
              />
              <label
                htmlFor="profile-upload"
                className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-[#7fc8f8] rounded-full cursor-pointer hover:bg-[#f0f8ff] transition-colors"
              >
                {profileImage ? (
                  <img
                    src={profileImage || "/placeholder.svg"}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-center text-[#7fc8f8] text-sm">Click to upload</span>
                )}
              </label>
            </div>
          </div>

          {/* Username Input */}
          <div>
            <label className="block text-sm font-semibold text-[#2f4f84] mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full px-4 py-3 border-2 border-[#7fc8f84] rounded-xl focus:outline-none focus:border-[#2f4f84] transition-colors"
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
          <div className="absolute inset-0 bg-gradient-to-r from-[#58BDF6] via-[#718BD2] to-[#D4FA62] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl -z-10"></div>
          <div className="relative p-1 rounded-2xl bg-gradient-to-r from-[#58BDF6] via-[#718BD2] to-[#D4FA62] animate-pulse">
            <div className="bg-white rounded-2xl overflow-hidden">
              <FlyerCanvas
                ref={canvasRef}
                type="id"
                username={username}
                profileImage={profileImage}
                templateKey={selectedTemplate}
                backgroundImage={TEMPLATES[selectedTemplate].backgroundImage}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
