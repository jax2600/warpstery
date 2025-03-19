"use client"

import { useEffect, useRef } from "react"

interface PlaceholderImageGeneratorProps {
  text: string
  width: number
  height: number
  bgColor?: string
  textColor?: string
  fontSize?: number
  filename?: string
}

/**
 * Component to generate placeholder images for the game
 * This is useful for development before you have the actual game assets
 */
export default function PlaceholderImageGenerator({
  text,
  width,
  height,
  bgColor = "#6d28d9",
  textColor = "#ffffff",
  fontSize = 32,
  filename = "placeholder",
}: PlaceholderImageGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = width
    canvas.height = height

    // Fill background
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, width, height)

    // Add text
    ctx.fillStyle = textColor
    ctx.font = `${fontSize}px Arial, sans-serif`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    // Handle multiline text
    const lines = text.split("\n")
    const lineHeight = fontSize * 1.2
    const totalHeight = lines.length * lineHeight
    const startY = (height - totalHeight) / 2 + lineHeight / 2

    lines.forEach((line, i) => {
      ctx.fillText(line, width / 2, startY + i * lineHeight)
    })

    // Add border
    ctx.strokeStyle = "#ffffff33"
    ctx.lineWidth = 8
    ctx.strokeRect(4, 4, width - 8, height - 8)
  }, [text, width, height, bgColor, textColor, fontSize])

  const downloadImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement("a")
    link.download = `${filename}.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <canvas ref={canvasRef} className="border border-gray-300 rounded-lg shadow-lg" style={{ width, height }} />
      <button
        onClick={downloadImage}
        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
      >
        Download Image
      </button>
    </div>
  )
}

