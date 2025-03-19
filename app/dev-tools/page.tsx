"use client"

import { useState } from "react"
import PlaceholderImageGenerator from "@/components/placeholder-image-generator"
import Image from "next/image"

/**
 * Development tools page to help generate placeholder images
 * for the game before you have the actual assets
 */
export default function DevToolsPage() {
  const [selectedTool, setSelectedTool] = useState<string>("placeholders")

  // Location images from the provided URLs
  const locations = [
    {
      name: "Farm",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Farm00-a6Jau1B42cN5W8MQGuwTb52ScfmDkC.webp",
    },
    {
      name: "Beach Cove",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Ocean00-En4ICfFZr4KM6Xe0ncCeXbna3v38Nq.webp",
    },
    {
      name: "Blacksmith",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Blacksmith00-fZFACCpQpQcVIkC1KUDYwtYaxQ7c21.webp",
    },
    {
      name: "Market",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Market00-Hz03E6hlV3StjXe8aTT8K9rvIyWcAW.webp",
    },
    {
      name: "Secret Den",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Den00-MPJ6jAyMCWEIHNWLico8VlcGT5p2eq.webp",
    },
    {
      name: "Watchtower",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Tower00-zA0RnOSAR1EEjHkP3NfVk4HBBdgvHF.webp",
    },
    {
      name: "Library",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LIbrary00-9ats7YxyEzLxjZtMpx6BBLf7Rz5ShB.webp",
    },
    {
      name: "Town Square",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Square00-g1MdMn6ktLux8pVzbDNf5JCf9ovWDj.webp",
    },
    {
      name: "Warp Pub",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Pub00-3Sv2QkacU3ACXe3mYktjg9RjZbzvhh.webp",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">Development Tools</h1>

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setSelectedTool("placeholders")}
          className={`px-4 py-2 rounded-md ${
            selectedTool === "placeholders" ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-800"
          }`}
        >
          Placeholder Images
        </button>
        <button
          onClick={() => setSelectedTool("locations")}
          className={`px-4 py-2 rounded-md ${
            selectedTool === "locations" ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-800"
          }`}
        >
          Game Locations
        </button>
      </div>

      {selectedTool === "placeholders" && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">Placeholder Image Generator</h2>
          <p className="mb-6">
            Use this tool to generate placeholder images for your game. These images can be used during development
            until you have the final assets ready.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <PlaceholderImageGenerator
              text="Warpstery\nNefarious activities afoot"
              width={1200}
              height={630}
              bgColor="#6d28d9"
              fontSize={64}
              filename="warpstery-title"
            />

            <PlaceholderImageGenerator
              text="You rolled a 4!"
              width={1200}
              height={630}
              bgColor="#1e40af"
              fontSize={64}
              filename="roll-4"
            />

            <PlaceholderImageGenerator
              text="Make your accusation!"
              width={1200}
              height={630}
              bgColor="#9f1239"
              fontSize={64}
              filename="accusation"
            />

            <PlaceholderImageGenerator
              text="Choose a suspect"
              width={1200}
              height={630}
              bgColor="#7e22ce"
              fontSize={64}
              filename="question-suspect"
            />

            <PlaceholderImageGenerator
              text="Choose a weapon"
              width={1200}
              height={630}
              bgColor="#0e7490"
              fontSize={64}
              filename="question-weapon"
            />

            <PlaceholderImageGenerator
              text="Choose a location"
              width={1200}
              height={630}
              bgColor="#15803d"
              fontSize={64}
              filename="question-room"
            />

            <PlaceholderImageGenerator
              text="Question Results"
              width={1200}
              height={630}
              bgColor="#7c3aed"
              fontSize={64}
              filename="question-result"
            />

            <PlaceholderImageGenerator
              text="You solved the case!\nCongratulations!"
              width={1200}
              height={630}
              bgColor="#15803d"
              fontSize={64}
              filename="solved"
            />

            <PlaceholderImageGenerator
              text="Wrong guess!\nTry again"
              width={1200}
              height={630}
              bgColor="#b91c1c"
              fontSize={64}
              filename="wrong-guess"
            />

            <PlaceholderImageGenerator
              text="Error\nSomething went wrong"
              width={1200}
              height={630}
              bgColor="#475569"
              fontSize={64}
              filename="error"
            />
          </div>
        </div>
      )}

      {selectedTool === "locations" && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">Game Locations</h2>
          <p className="mb-6">
            These are the locations used in your Warpstery game. Each location can be a scene for the mystery.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {locations.map((location, index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                <div className="aspect-square relative">
                  <Image
                    src={location.image || "/placeholder.svg"}
                    alt={location.name}
                    width={400}
                    height={400}
                    className="object-cover w-full h-full"
                    crossOrigin="anonymous"
                  />
                </div>
                <div className="p-3 bg-gray-100 border-t">
                  <h3 className="font-bold text-lg">{location.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

