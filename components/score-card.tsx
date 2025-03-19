"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, Circle, HelpCircle, X, SmileIcon } from "lucide-react"

const SUSPECTS = ["DWR", "V", "Ted not lasso", "Linda", "Horsefacts", "woj", "gt", "sds", "deodad"]

const WEAPONS = ["Gas Fee", "Toxic Meme", "Private Key", "Social Hack", "NFT Rug", "Bad Take"]

const ROOMS = [
  "Farm",
  "Beach Cove",
  "Blacksmith",
  "Market",
  "Secret Den",
  "Watchtower",
  "Library",
  "Town Square",
  "Warp Pub",
]

type MarkType = "none" | "maybe" | "confirmed" | "x" | "yours"

interface ScoreCardProps {
  playerCards: string[]
}

export default function ScoreCard({ playerCards = [] }: ScoreCardProps) {
  // Initialize state for each category
  const [suspectMarks, setSuspectMarks] = useState<MarkType[]>(Array(SUSPECTS.length).fill("none"))
  const [weaponMarks, setWeaponMarks] = useState<MarkType[]>(Array(WEAPONS.length).fill("none"))
  const [roomMarks, setRoomMarks] = useState<MarkType[]>(Array(ROOMS.length).fill("none"))
  const [notes, setNotes] = useState<string>("")

  // Mark player's cards with smiley faces when component mounts or playerCards change
  useEffect(() => {
    // Reset all marks first to avoid conflicts
    const newSuspectMarks = [...suspectMarks]
    const newWeaponMarks = [...weaponMarks]
    const newRoomMarks = [...roomMarks]

    // Mark all player cards with "yours"
    playerCards.forEach((card) => {
      const [type, name] = card.split(":")

      if (type === "suspect") {
        const index = SUSPECTS.findIndex((s) => s === name)
        if (index !== -1) {
          newSuspectMarks[index] = "yours"
        }
      } else if (type === "weapon") {
        const index = WEAPONS.findIndex((w) => w === name)
        if (index !== -1) {
          newWeaponMarks[index] = "yours"
        }
      } else if (type === "room") {
        const index = ROOMS.findIndex((r) => r === name)
        if (index !== -1) {
          newRoomMarks[index] = "yours"
        }
      }
    })

    setSuspectMarks(newSuspectMarks)
    setWeaponMarks(newWeaponMarks)
    setRoomMarks(newRoomMarks)
  }, [playerCards])

  // Listen for updates from the game board
  useEffect(() => {
    const handleUpdateDetectiveNotes = (event: Event) => {
      const { type, index, markType } = (event as CustomEvent).detail

      if (type === "suspect" && index >= 0 && index < suspectMarks.length) {
        const newMarks = [...suspectMarks]
        // Only update if it's not already marked as "yours" or if we're explicitly marking it as "yours"
        if (newMarks[index] !== "yours" || markType === "yours") {
          newMarks[index] = markType
          setSuspectMarks(newMarks)
        }
      } else if (type === "weapon" && index >= 0 && index < weaponMarks.length) {
        const newMarks = [...weaponMarks]
        // Only update if it's not already marked as "yours" or if we're explicitly marking it as "yours"
        if (newMarks[index] !== "yours" || markType === "yours") {
          newMarks[index] = markType
          setWeaponMarks(newMarks)
        }
      } else if (type === "room" && index >= 0 && index < roomMarks.length) {
        const newMarks = [...roomMarks]
        // Only update if it's not already marked as "yours" or if we're explicitly marking it as "yours"
        if (newMarks[index] !== "yours" || markType === "yours") {
          newMarks[index] = markType
          setRoomMarks(newMarks)
        }
      }
    }

    // Add event listener\
    document.addEventListener("updateDetectiveNotes", handleUpdateDetectiveNotes)

    // Clean up
    return () => {
      document.removeEventListener("updateDetectiveNotes", handleUpdateDetectiveNotes)
    }
  }, [suspectMarks, weaponMarks, roomMarks])

  // Add a function to reset all marks when a new game starts
  useEffect(() => {
    const handleResetDetectiveNotes = () => {
      setSuspectMarks(Array(SUSPECTS.length).fill("none"))
      setWeaponMarks(Array(WEAPONS.length).fill("none"))
      setRoomMarks(Array(ROOMS.length).fill("none"))
    }

    // Add event listener
    document.addEventListener("resetDetectiveNotes", handleResetDetectiveNotes)

    // Clean up
    return () => {
      document.removeEventListener("resetDetectiveNotes", handleResetDetectiveNotes)
    }
  }, [])

  // Function to cycle through marking states
  const cycleMark = (
    currentMarks: MarkType[],
    setMarks: React.Dispatch<React.SetStateAction<MarkType[]>>,
    index: number,
  ) => {
    const nextMarks = [...currentMarks]

    // Don't change if it's marked as "yours" (your card)
    if (nextMarks[index] === "yours") {
      return
    }

    // Cycle through the marks: none -> maybe -> confirmed -> x -> none
    switch (nextMarks[index]) {
      case "none":
        nextMarks[index] = "maybe"
        break
      case "maybe":
        nextMarks[index] = "confirmed"
        break
      case "confirmed":
        nextMarks[index] = "x"
        break
      case "x":
        nextMarks[index] = "none"
        break
    }

    setMarks(nextMarks)
  }

  // Render mark icon based on current state
  const renderMark = (mark: MarkType) => {
    switch (mark) {
      case "none":
        return <Circle className="h-5 w-5 text-gray-400" />
      case "maybe":
        return <HelpCircle className="h-5 w-5 text-amber-500" />
      case "confirmed":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "x":
        return <X className="h-5 w-5 text-red-600" />
      case "yours":
        return <SmileIcon className="h-5 w-5 text-blue-600" />
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Legend at the top of the entire Notes section */}
      <div className="bg-amber-200 p-3 rounded-md flex items-center justify-center gap-4 flex-wrap">
        <div className="flex items-center gap-1">
          <SmileIcon className="h-5 w-5 text-blue-600" /> <span>Your Card</span>
        </div>
        <div className="flex items-center gap-1">
          <X className="h-5 w-5 text-red-600" /> <span>Not This</span>
        </div>
        <div className="flex items-center gap-1">
          <HelpCircle className="h-5 w-5 text-amber-500" /> <span>Maybe</span>
        </div>
        <div className="flex items-center gap-1">
          <CheckCircle className="h-5 w-5 text-green-600" /> <span>Confirmed</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Suspects */}
        <div className="bg-red-100 p-3 rounded-md">
          <h3 className="font-bold text-lg mb-2 text-red-800">Suspects</h3>
          <ul className="space-y-2">
            {SUSPECTS.map((suspect, index) => (
              <li key={`suspect-${index}`} className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => cycleMark(suspectMarks, setSuspectMarks, index)}
                  disabled={suspectMarks[index] === "yours"}
                >
                  {renderMark(suspectMarks[index])}
                </Button>
                <span>{suspect}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weapons */}
        <div className="bg-blue-100 p-3 rounded-md">
          <h3 className="font-bold text-lg mb-2 text-blue-800">Weapons</h3>
          <ul className="space-y-2">
            {WEAPONS.map((weapon, index) => (
              <li key={`weapon-${index}`} className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => cycleMark(weaponMarks, setWeaponMarks, index)}
                  disabled={weaponMarks[index] === "yours"}
                >
                  {renderMark(weaponMarks[index])}
                </Button>
                <span>{weapon}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Rooms */}
        <div className="bg-green-100 p-3 rounded-md">
          <h3 className="font-bold text-lg mb-2 text-green-800">Rooms</h3>
          <ul className="space-y-2">
            {ROOMS.map((room, index) => (
              <li key={`room-${index}`} className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => cycleMark(roomMarks, setRoomMarks, index)}
                  disabled={roomMarks[index] === "yours"}
                >
                  {renderMark(roomMarks[index])}
                </Button>
                <span>{room}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

