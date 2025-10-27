"use client"
import { forwardRef, useEffect, useRef } from "react"

// Load custom fonts using FontFace API
async function loadCustomFonts() {
  // EB Garamond
  const ebGaramond = new FontFace(
    "EB Garamond",
    "url(/fonts/EBGaramond-VariableFont_wght.ttf)"
  );
  // Marlide
  const marlide = new FontFace(
    "MarlideDisplay",
    "url(/fonts/MarlideDisplay_Light.ttf)"
  );

  await ebGaramond.load();
  await marlide.load();
  (document as any).fonts.add(ebGaramond);
  (document as any).fonts.add(marlide);
}

interface FlyerCanvasProps {
  type: "id" | "tweet"
  username?: string
  profileImage?: string | null
  name?: string
  tweet?: string
  templateKey?: string
  backgroundImage?: string
}

const FlyerCanvas = forwardRef<HTMLCanvasElement, FlyerCanvasProps>(
  (
    {
      type,
      username = "",
      profileImage = null,
      name = "",
      tweet = "",
      templateKey = "id1",
      backgroundImage = "/backgrounds/id1.png",
    },
    ref,
  ) => {
    const internalRef = useRef<HTMLCanvasElement>(null)
    const canvasRef = (ref as any) || internalRef

    useEffect(() => {
      (async () => {
        await loadCustomFonts();

        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const width = 1366
        const height = 768
        canvas.width = width
        canvas.height = height

        // Load background image
        const bgImage = new window.Image()
        bgImage.crossOrigin = "anonymous"
        bgImage.src = type === "id" ? backgroundImage : "/backgrounds/tweet1.png"
        bgImage.onload = () => {
          ctx.drawImage(bgImage, 0, 0, width, height)
          if (type === "id") {
            drawIDFlyer(ctx, width, height, username, profileImage)
          } else {
            drawTweetFlyer(ctx, width, height, name, tweet)
          }
        }
        bgImage.onerror = () => {
          ctx.fillStyle = "#7fc8f8"
          ctx.fillRect(0, 0, width, height)
          if (type === "id") {
            drawIDFlyer(ctx, width, height, username, profileImage)
          } else {
            drawTweetFlyer(ctx, width, height, name, tweet)
          }
        }
      })()
    }, [type, username, profileImage, name, tweet, templateKey, backgroundImage, canvasRef])

    return <canvas ref={canvasRef} className="max-w-full h-auto border-2 border-[#7fc8f8] rounded-2xl shadow-lg" />
  },
)
FlyerCanvas.displayName = "FlyerCanvas"

// --- ID FLYER ---
function drawIDFlyer(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  username: string,
  profileImage: string | null,
) {
  const pfpSize = 170
  const pfpX = width * 0.24
  const pfpY = height / 2 - 40

  if (profileImage) {
    const img = new window.Image()
    img.crossOrigin = "anonymous"
    img.src = profileImage
    img.onload = () => {
      ctx.save()
      ctx.beginPath()
      ctx.arc(pfpX, pfpY, pfpSize / 2 + 8, 0, Math.PI * 2)
      ctx.fillStyle = "#718bd2"
      ctx.fill()
      ctx.closePath()

      ctx.beginPath()
      ctx.arc(pfpX, pfpY, pfpSize / 2, 0, Math.PI * 2)
      ctx.closePath()
      ctx.clip()

      // COVER CROP
      const imgAspect = img.width / img.height
      const frameAspect = 1
      let sx = 0,
        sy = 0,
        sw = img.width,
        sh = img.height
      if (imgAspect > frameAspect) {
        sw = img.height * frameAspect
        sx = (img.width - sw) / 2
      } else {
        sh = img.width / frameAspect
        sy = (img.height - sh) / 2
      }
      ctx.drawImage(img, sx, sy, sw, sh, pfpX - pfpSize / 2, pfpY - pfpSize / 2, pfpSize, pfpSize)
      ctx.restore()

      ctx.font = "bold 46px 'MarlideDisplay', serif"
      ctx.fillStyle = "#000"
      ctx.textAlign = "center"
      ctx.fillText(username || "Username", pfpX, pfpY + pfpSize / 2 + 48)
    }
  } else {
    ctx.save()
    ctx.beginPath()
    ctx.arc(pfpX, pfpY, pfpSize / 2, 0, Math.PI * 2)
    ctx.fillStyle = "#eee"
    ctx.fill()
    ctx.closePath()
    ctx.restore()
    ctx.font = "bold 46px 'MarlideDisplay', serif"
    ctx.fillStyle = "#000"
    ctx.textAlign = "center"
    ctx.fillText(username || "Username", pfpX, pfpY + pfpSize / 2 + 48)
  }
}

// --- TWEET FLYER (RESPONSIVE FONT + PROPER WORD WRAP) ---
function drawTweetFlyer(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  name: string,
  tweet: string
) {
  // Username kanan atas
  ctx.save()
  ctx.font = "bold 50px 'MarlideDisplay', serif"
  ctx.fillStyle = "#083b6e"
  ctx.textAlign = "right"
  const unameY = 110
  ctx.fillText(name || "Username", width - 250, unameY)
  const unameWidth = ctx.measureText(name || "Username").width
  ctx.strokeStyle = "#083b6e"
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(width - 250 - unameWidth, unameY + 7)
  ctx.lineTo(width - 250, unameY + 7)
  ctx.stroke()
  ctx.restore()

  // Tweet area (horizontal+vertical bound)
  const tweetX = 100
  const tweetY = 200
  const tweetMaxWidth = width * 0.5
  const tweetMaxHeight = 500
  let fontSize = 48
  let lines: string[] = []
  let fits = false

  // Responsive font size, stops at min 20px
  while (fontSize >= 20 && !fits) {
    ctx.font = `${fontSize}px 'EB Garamond', serif`
    lines = hardWrapText(ctx, tweet || "Your tweet here", tweetMaxWidth)
    fits = lines.length * (fontSize + 8) <= tweetMaxHeight
    if (!fits) fontSize -= 2
  }

  ctx.font = `${fontSize}px 'EB Garamond', serif`
  ctx.fillStyle = "#111"
  ctx.textAlign = "left"
  let y = tweetY
  for (const line of lines) {
    ctx.fillText(line, tweetX, y)
    y += fontSize + 8
    if (y > tweetY + tweetMaxHeight) break
  }
}

// Helper: word wrap with hard break for long words
function breakWord(ctx: CanvasRenderingContext2D, word: string, maxWidth: number): string[] {
  let result: string[] = []
  let current = ""
  for (let i = 0; i < word.length; i++) {
    const test = current + word[i]
    if (ctx.measureText(test).width > maxWidth && current.length > 0) {
      result.push(current)
      current = word[i]
    } else {
      current = test
    }
  }
  if (current.length > 0) result.push(current)
  return result
}

function hardWrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const paragraphs = text.split("\n")
  const result: string[] = []
  for (const paragraph of paragraphs) {
    const words = paragraph.split(" ")
    let line = ""
    for (let n = 0; n < words.length; n++) {
      const testLine = line + (line ? " " : "") + words[n]
      if (ctx.measureText(testLine).width > maxWidth && line !== "") {
        result.push(line)
        // Cek jika satu kata terlalu panjang
        if (ctx.measureText(words[n]).width > maxWidth) {
          const broken = breakWord(ctx, words[n], maxWidth)
          for (let i = 0; i < broken.length - 1; i++) result.push(broken[i])
          line = broken[broken.length - 1]
        } else {
          line = words[n]
        }
      } else {
        line = testLine
      }
    }
    if (line !== "") result.push(line)
  }
  return result
}

export default FlyerCanvas
