"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import ScoreCard from "@/components/score-card"
import { HelpCircle, User, Sword } from "lucide-react"

interface GameBoardProps {
  preview?: boolean
}

// Location data with images - using placeholder images instead of Vercel Blob Storage URLs
const LOCATIONS = [
  {
    id: 0,
    name: "Library", // First location
    image: "/placeholder.svg?height=200&width=200&text=Library",
    x: 0,
    y: 0,
  },
  {
    id: 1,
    name: "Secret Den", // Second location
    image: "/placeholder.svg?height=200&width=200&text=Secret+Den",
    x: 1,
    y: 0,
  },
  {
    id: 2,
    name: "Warp Pub", // Third location
    image: "/placeholder.svg?height=200&width=200&text=Warp+Pub",
    x: 2,
    y: 0,
  },
  {
    id: 3,
    name: "Market", // Fourth location
    image: "/placeholder.svg?height=200&width=200&text=Market",
    x: 0,
    y: 1,
  },
  {
    id: 4,
    name: "Town Square", // Fifth location
    image: "/placeholder.svg?height=200&width=200&text=Town+Square",
    x: 1,
    y: 1,
  },
  {
    id: 5,
    name: "Watchtower", // Sixth location
    image: "/placeholder.svg?height=200&width=200&text=Watchtower",
    x: 2,
    y: 1,
  },
  {
    id: 6,
    name: "Beach Cove", // Seventh location
    image: "/placeholder.svg?height=200&width=200&text=Beach+Cove",
    x: 0,
    y: 2,
  },
  {
    id: 7,
    name: "Blacksmith", // Eighth location
    image: "/placeholder.svg?height=200&width=200&text=Blacksmith",
    x: 1,
    y: 2,
  },
  {
    id: 8,
    name: "Farm", // Ninth location
    image: "/placeholder.svg?height=200&width=200&text=Farm",
    x: 2,
    y: 2,
  },
]

// Character cards
const CHARACTERS = ["DWR", "V", "Ted not lasso", "Linda", "Horsefacts", "woj", "gt", "sds", "deodad"]

// Weapon cards
const WEAPONS = ["Gas Fee", "Toxic Meme", "Private Key", "Social Hack", "NFT Rug", "Bad Take"]

// Random Farverse events
const RANDOM_EVENTS = [
  "DAQ price fluctuation",
  "Warplet connection issues",
  "Memecoin rugpull",
  "Controversial cast",
  "Verification drama",
  "Frame exploit discovered",
  "Channel spam attack",
  "Purple checkmark debate",
  "FID registry glitch",
  "Airdrop rumors",
]

// Player names (for demo)
const PLAYERS = ["You", "Player 1", "Player 2", "Player 3"]

// Card types
type CardType = "suspect" | "weapon" | "room"

// Card ownership tracking
interface CardOwnership {
  type: CardType
  name: string
  owner: string | null
  revealed: boolean
}

// Define round limits for different game modes
const SINGLE_PLAYER_MAX_ROUNDS = 7
const MULTIPLAYER_MAX_ROUNDS = 5

// Function to determine max rounds based on player count
const getMaxRounds = (playerCount: number) => {
  return playerCount <= 1 ? SINGLE_PLAYER_MAX_ROUNDS : MULTIPLAYER_MAX_ROUNDS
}

// Add round counter and max rounds constant at the top with other constants
const MAX_ROUNDS = 5

export default function GameBoard({ preview = false }: GameBoardProps) {
  // Add these state variables in the GameBoard component
  const [currentRound, setCurrentRound] = useState<number>(1)
  const [gameOver, setGameOver] = useState<boolean>(false)

  // Add state variable to track players
  // Add this near the other state variables:
  const [gameState, setGameState] = useState<{
    players?: number[]
  }>({ players: [] })

  // Game state
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null)
  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(null)
  const [selectedWeapon, setSelectedWeapon] = useState<number | null>(null)
  const [playerCards, setPlayerCards] = useState<string[]>([])
  const [currentEvent, setCurrentEvent] = useState<string | null>(null)
  const [solution, setSolution] = useState<{ suspect: number; weapon: number; room: number } | null>(null)

  // Enhanced question log with revealed cards
  const [questionLog, setQuestionLog] = useState<
    {
      asker: string
      suspect: string
      weapon: string
      room: string
      answeredBy: string
      revealedCard: string | null
    }[]
  >([])

  // Card ownership tracking
  const [cardOwnership, setCardOwnership] = useState<CardOwnership[]>([])

  // Show question form
  const [showQuestionForm, setShowQuestionForm] = useState<boolean>(false)

  // Show suggestion result modal
  const [showSuggestionResult, setShowSuggestionResult] = useState<boolean>(false)
  const [suggestionResult, setSuggestionResult] = useState<{
    suspect: string
    weapon: string
    room: string
    answeredBy: string
    revealedCard: string | null
  } | null>(null)

  // Initialize the game
  useEffect(() => {
    if (preview) {
      initializeGame()
    }
  }, [preview])

  // Function to initialize or reset the game
  const initializeGame = () => {
    // Reset detective notes first
    const resetEvent = new CustomEvent("resetDetectiveNotes")
    document.dispatchEvent(resetEvent)

    // Generate a completely random solution
    const randomSuspect = Math.floor(Math.random() * CHARACTERS.length)
    const randomWeapon = Math.floor(Math.random() * WEAPONS.length)
    const randomRoom = Math.floor(Math.random() * LOCATIONS.length)

    setSolution({
      suspect: randomSuspect,
      weapon: randomWeapon,
      room: randomRoom,
    })

    // Reset selections
    setSelectedCharacter(null)
    setSelectedWeapon(null)
    setSelectedLocation(null)

    // Reset round counter
    setCurrentRound(1)
    setGameOver(false)

    // Reset question log
    setQuestionLog([])

    // Initialize card ownership tracking
    const initialCardOwnership: CardOwnership[] = [
      // All suspects
      ...CHARACTERS.map((name) => ({
        type: "suspect" as CardType,
        name,
        owner: null,
        revealed: false,
      })),
      // All weapons
      ...WEAPONS.map((name) => ({
        type: "weapon" as CardType,
        name,
        owner: null,
        revealed: false,
      })),
      // All rooms
      ...LOCATIONS.map((location) => ({
        type: "room" as CardType,
        name: location.name,
        owner: null,
        revealed: false,
      })),
    ]

    // Mark solution cards
    initialCardOwnership.find((card) => card.type === "suspect" && card.name === CHARACTERS[randomSuspect])!.owner =
      "solution"
    initialCardOwnership.find((card) => card.type === "weapon" && card.name === WEAPONS[randomWeapon])!.owner =
      "solution"
    initialCardOwnership.find((card) => card.type === "room" && card.name === LOCATIONS[randomRoom].name)!.owner =
      "solution"

    // Distribute remaining cards to players
    const remainingCards = initialCardOwnership.filter((card) => card.owner === null)
    const shuffledCards = [...remainingCards].sort(() => 0.5 - Math.random())

    // Assign cards to players (including you)
    const playerCount = 4 // You + 3 other players
    const playerCardCounts = Array(playerCount).fill(Math.floor(shuffledCards.length / playerCount))
    // Distribute any remainder
    for (let i = 0; i < shuffledCards.length % playerCount; i++) {
      playerCardCounts[i]++
    }

    let cardIndex = 0
    // First assign your cards
    const yourCards = []
    for (let i = 0; i < playerCardCounts[0]; i++) {
      if (cardIndex < shuffledCards.length) {
        shuffledCards[cardIndex].owner = PLAYERS[0] // "You"
        yourCards.push(`${shuffledCards[cardIndex].type}:${shuffledCards[cardIndex].name}`)

        cardIndex++
      }
    }

    // Then assign other players' cards
    for (let playerIndex = 1; playerIndex < playerCount; playerIndex++) {
      for (let i = 0; i < playerCardCounts[playerIndex]; i++) {
        if (cardIndex < shuffledCards.length) {
          shuffledCards[cardIndex].owner = PLAYERS[playerIndex]
          cardIndex++
        }
      }
    }

    setCardOwnership(initialCardOwnership)
    setPlayerCards(yourCards)

    // Now mark your cards in detective notes with "yours" mark type
    // We do this after setting the state to ensure all cards are properly marked
    setTimeout(() => {
      yourCards.forEach((cardString) => {
        const [type, name] = cardString.split(":")
        updateDetectiveNotes(type as CardType, name, "yours")
      })
    }, 100)

    // Set a random event
    setCurrentEvent(RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)])

    // Add some example questions to the log with revealed cards
    setQuestionLog([
      {
        asker: "Player 1",
        suspect: "DWR",
        weapon: "Gas Fee",
        room: "Farm",
        answeredBy: "Player 2",
        revealedCard: "Gas Fee", // Example of a revealed card
      },
      {
        asker: "Player 3",
        suspect: "V",
        weapon: "Toxic Meme",
        room: "Warp Pub",
        answeredBy: "You",
        revealedCard: "V", // Example of a revealed card
      },
    ])
  }

  // Update detective notes when cards are revealed
  const updateDetectiveNotes = (type: CardType, name: string, markType: "confirmed" | "x" | "yours") => {
    // Find the index of the item in the appropriate array
    let index = -1
    if (type === "suspect") {
      index = CHARACTERS.findIndex((c) => c === name)
    } else if (type === "weapon") {
      index = WEAPONS.findIndex((w) => w === name)
    } else if (type === "room") {
      index = LOCATIONS.findIndex((l) => l.name === name)
    }

    if (index !== -1) {
      // Create an event that ScoreCard can listen to
      const event = new CustomEvent("updateDetectiveNotes", {
        detail: {
          type,
          index,
          markType,
        },
      })
      document.dispatchEvent(event)
    }
  }

  // Make a suggestion based on selected items
  const makeSuggestion = () => {
    if (selectedLocation !== null && selectedCharacter !== null && selectedWeapon !== null) {
      // Increment round counter
      const nextRound = currentRound + 1
      setCurrentRound(nextRound)

      // Check if we've reached the maximum rounds
      const maxRounds = getMaxRounds(preview ? 1 : gameState.players?.length || 1)
      if (nextRound > maxRounds) {
        setTimeout(() => {
          alert(`You've reached the maximum of ${maxRounds} rounds! Game over.`)
          resetGame()
        }, 1000)
      }

      const suspect = CHARACTERS[selectedCharacter]
      const weapon = WEAPONS[selectedWeapon]
      const room = LOCATIONS[selectedLocation].name

      // Find which players have these cards (excluding solution cards)
      const suspectCard = cardOwnership.find((card) => card.type === "suspect" && card.name === suspect)
      const weaponCard = cardOwnership.find((card) => card.type === "weapon" && card.name === weapon)
      const roomCard = cardOwnership.find((card) => card.type === "room" && card.name === room)

      // Determine which card to reveal (prioritize in order: suspect, weapon, room)
      let revealedCard: string | null = null
      let answeredBy = "No one"

      if (suspectCard?.owner && suspectCard.owner !== "solution" && suspectCard.owner !== "You") {
        revealedCard = suspect
        answeredBy = suspectCard.owner
        suspectCard.revealed = true
        // Mark in detective notes
        updateDetectiveNotes("suspect", suspect, "x")
      } else if (weaponCard?.owner && weaponCard.owner !== "solution" && weaponCard.owner !== "You") {
        revealedCard = weapon
        answeredBy = weaponCard.owner
        weaponCard.revealed = true
        // Mark in detective notes
        updateDetectiveNotes("weapon", weapon, "x")
      } else if (roomCard?.owner && roomCard.owner !== "solution" && roomCard.owner !== "You") {
        revealedCard = room
        answeredBy = roomCard.owner
        roomCard.revealed = true
        // Mark in detective notes
        updateDetectiveNotes("room", room, "x")
      }

      // Update card ownership state
      setCardOwnership([...cardOwnership])

      // Create the suggestion result
      const result = {
        suspect,
        weapon,
        room,
        answeredBy,
        revealedCard,
      }

      // Show the suggestion result
      setSuggestionResult(result)
      setShowSuggestionResult(true)

      // Add to question log
      setQuestionLog([
        ...questionLog,
        {
          asker: "You",
          suspect,
          weapon,
          room,
          answeredBy,
          revealedCard,
        },
      ])
    } else {
      alert("Please select a character, weapon, and location to make a suggestion")
    }
  }

  // Make an accusation based on selected items
  const makeAccusation = () => {
    if (selectedLocation !== null && selectedCharacter !== null && selectedWeapon !== null) {
      // Check against the solution
      const isCorrect =
        selectedCharacter === solution?.suspect &&
        selectedWeapon === solution?.weapon &&
        selectedLocation === solution?.room

      if (isCorrect) {
        // Show success modal instead of alert
        alert(
          `Correct! The solution was ${CHARACTERS[solution.suspect]} with the ${WEAPONS[solution.weapon]} in the ${LOCATIONS[solution.room].name}`,
        )

        // Add option to share victory on Farcaster
        if (confirm("Would you like to share your victory on Farcaster?")) {
          window.open(
            `https://warpcast.com/~/compose?text=I%20solved%20the%20Warpstery%20case%20in%20the%20Farverse!%20The%20culprit%20was%20${encodeURIComponent(CHARACTERS[solution.suspect])}%20with%20the%20${encodeURIComponent(WEAPONS[solution.weapon])}%20in%20the%20${encodeURIComponent(LOCATIONS[solution.room].name)}`,
            "_blank",
          )
        }

        // Reset the game for a new round
        resetGame()
      } else {
        // Show failure message
        alert(
          `Incorrect accusation! The solution was ${CHARACTERS[solution.suspect]} with the ${WEAPONS[solution.weapon]} in the ${LOCATIONS[solution.room].name}`,
        )

        // Always reset the game after an accusation
        resetGame()
      }
    } else {
      alert("Please select a character, weapon, and location to make an accusation")
    }
  }

  // Add a complete game reset function
  const resetGame = () => {
    initializeGame()
  }

  // Get card status for visual feedback
  const getCardStatus = (type: CardType, name: string) => {
    const card = cardOwnership.find((c) => c.type === type && c.name === name)
    if (!card) return { owner: null, revealed: false }
    return { owner: card.owner, revealed: card.revealed }
  }

  // Assuming 'state' is managed by a context or prop, ensure it's accessible here.
  // For example, if it's passed as a prop:
  // export default function GameBoard({ preview = false, state }: GameBoardProps) {
  // Or if it's from a context:
  // const { state } = useContext(SomeContext);
  //
  // Since we don't have the context or prop definition, we'll mock a state object for now.
  // Replace this with your actual state source.
  const state = { players: [] } // Replace with your actual state source

  return (
    <div className="flex flex-col gap-6">
      {/* Game board with locations, characters, and weapons */}
      <div className="bg-green-900 p-4 rounded-lg relative w-full">
        <h2 className="text-xl font-bold text-white mb-4">Warpstery Game Board</h2>

        {/* Current event notification */}
        {currentEvent && (
          <div className="bg-purple-800 text-white p-2 rounded-md mb-4 flex items-center">
            <span className="font-bold mr-2">BREAKING:</span> {currentEvent}
          </div>
        )}
        {/* Round counter */}
        <div className="bg-amber-700 text-white p-2 rounded-md mb-4 flex items-center justify-between">
          <span>
            Round: {currentRound} of {getMaxRounds(preview ? 1 : gameState.players?.length || 1)}
          </span>
          {currentRound >= getMaxRounds(preview ? 1 : gameState.players?.length || 1) && (
            <span className="text-yellow-300 font-bold">Final Round!</span>
          )}
        </div>

        {/* Game board layout with responsive design */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Locations grid (always on top for mobile) */}
          <div className="md:flex-1 order-1">
            <h3 className="text-white font-bold text-sm mb-2 text-center md:hidden">Locations</h3>
            <div className="grid grid-cols-3 gap-2">
              {LOCATIONS.map((location) => {
                const status = getCardStatus("room", location.name)
                return (
                  <div
                    key={location.id}
                    className={`relative aspect-square rounded-md overflow-hidden border-2 cursor-pointer transition-all ${
                      selectedLocation === location.id
                        ? "border-yellow-400 ring-2 ring-yellow-400"
                        : status.revealed
                          ? "border-green-400"
                          : "border-amber-900 hover:border-yellow-300"
                    }`}
                    onClick={() => setSelectedLocation(location.id)}
                  >
                    <div className="w-full h-full bg-green-800 flex items-center justify-center">
                      <span className="text-white font-bold text-center p-2">{location.name}</span>
                    </div>

                    {/* Overlay for selected character and weapon */}
                    {selectedLocation === location.id && (
                      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
                        {selectedCharacter !== null && (
                          <div className="bg-red-500 text-white px-2 py-1 rounded-md mb-2 text-sm">
                            {CHARACTERS[selectedCharacter]}
                          </div>
                        )}
                        {selectedWeapon !== null && (
                          <div className="bg-blue-500 text-white px-2 py-1 rounded-md text-sm">
                            {WEAPONS[selectedWeapon]}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Revealed card indicator */}
                    {status.revealed && (
                      <div className="absolute top-1 right-1 bg-white text-green-800 text-xs font-bold px-1 py-0.5 rounded">
                        {status.owner}
                      </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-1 text-center">
                      <h3 className="text-white font-bold text-sm">{location.name}</h3>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Characters panel (left side on desktop, below locations on mobile) */}
          <div className="md:w-1/6 bg-red-900/30 p-2 rounded-lg order-2">
            <h3 className="text-white font-bold text-sm mb-2 text-center">Suspects</h3>
            <div className="grid grid-cols-3 md:grid-cols-1 gap-2">
              {CHARACTERS.map((character, index) => {
                const status = getCardStatus("suspect", character)
                return (
                  <div
                    key={`char-${index}`}
                    className={`p-2 rounded-md cursor-pointer transition-all ${
                      selectedCharacter === index
                        ? "bg-red-500 text-white"
                        : status.revealed
                          ? "bg-red-300 text-red-900"
                          : "bg-red-100 text-red-900 hover:bg-red-200"
                    }`}
                    onClick={() => setSelectedCharacter(index)}
                  >
                    <div className="flex flex-col items-center">
                      <User className="h-6 w-6 mb-1" />
                      <span className="text-xs font-medium text-center">{character}</span>
                      {status.revealed && (
                        <div className="mt-1 text-xs font-bold bg-white text-red-800 px-1 rounded w-full text-center">
                          {status.owner}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Weapons panel (right side on desktop, below suspects on mobile) */}
          <div className="md:w-1/6 bg-blue-900/30 p-2 rounded-lg order-3">
            <h3 className="text-white font-bold text-sm mb-2 text-center">Weapons</h3>
            <div className="grid grid-cols-3 md:grid-cols-1 gap-2">
              {WEAPONS.map((weapon, index) => {
                const status = getCardStatus("weapon", weapon)
                return (
                  <div
                    key={`weapon-${index}`}
                    className={`p-2 rounded-md cursor-pointer transition-all ${
                      selectedWeapon === index
                        ? "bg-blue-500 text-white"
                        : status.revealed
                          ? "bg-blue-300 text-blue-900"
                          : "bg-blue-100 text-blue-900 hover:bg-blue-200"
                    }`}
                    onClick={() => setSelectedWeapon(index)}
                  >
                    <div className="flex flex-col items-center">
                      <Sword className="h-6 w-6 mb-1" />
                      <span className="text-xs font-medium text-center">{weapon}</span>
                      {status.revealed && (
                        <div className="mt-1 text-xs font-bold bg-white text-blue-800 px-1 rounded w-full text-center">
                          {status.owner}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Game Controls */}
        {preview && (
          <div className="flex justify-center gap-4 mt-4">
            <Button variant="default" className="bg-purple-600 hover:bg-purple-700" onClick={makeSuggestion}>
              <HelpCircle className="mr-2 h-4 w-4" />
              Suggest
            </Button>
            <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-50" onClick={makeAccusation}>
              Accuse
            </Button>
            <Button
              variant="outline"
              className="border-blue-500 text-blue-500 hover:bg-blue-50"
              onClick={() => {
                window.open(
                  `https://warpcast.com/~/compose?text=I'm%20playing%20Warpstery%20-%20a%20Clue-like%20mystery%20game%20in%20the%20Farverse!%20Come%20join%20the%20investigation!`,
                  "_blank",
                )
              }}
            >
              Share
            </Button>
            <Button variant="outline" className="border-green-500 text-green-500 hover:bg-green-50" onClick={resetGame}>
              New Game
            </Button>
          </div>
        )}
      </div>

      {/* Player Cards - Now second in order */}
      <div className="bg-green-100 p-4 rounded-lg">
        <h2 className="text-xl font-bold text-green-900 mb-4">Your Cards</h2>

        <div className="flex flex-wrap gap-2 justify-center">
          {playerCards.map((card, index) => {
            const [type, name] = card.split(":")
            let bgColor = "bg-gray-200"
            let textColor = "text-gray-800"
            let borderColor = "border-gray-300"
            let icon = <User className="h-10 w-10" />

            if (type === "suspect") {
              bgColor = "bg-red-100"
              textColor = "text-red-800"
              borderColor = "border-red-300"
              icon = <User className="h-10 w-10 text-red-700" />
            } else if (type === "weapon") {
              bgColor = "bg-blue-100"
              textColor = "text-blue-800"
              borderColor = "border-blue-300"
              icon = <Sword className="h-10 w-10 text-blue-700" />
            } else if (type === "room") {
              bgColor = "bg-green-100"
              textColor = "text-green-800"
              borderColor = "border-green-300"
              icon = <HelpCircle className="h-10 w-10 text-green-700" />
            }

            return (
              <div
                key={index}
                className={`${bgColor} p-3 rounded-lg border ${borderColor} w-32 h-48 flex flex-col shadow-md overflow-hidden`}
              >
                <div className="text-xs uppercase font-bold mb-2 text-center">{type}</div>
                <div className="flex-1 flex items-center justify-center">
                  {type === "room" ? (
                    <div className="w-full h-full flex items-center justify-center bg-green-700 text-white p-2">
                      <span className="text-center font-bold">{name}</span>
                    </div>
                  ) : (
                    icon
                  )}
                </div>
                <div className={`${textColor} font-bold text-center mt-2 px-1`}>{name}</div>
              </div>
            )
          })}

          {playerCards.length === 0 && <div className="text-gray-500 italic">No cards in your hand yet</div>}
        </div>
      </div>

      {/* Detective Notes - Now third in order and renamed to "Notes" */}
      <div className="bg-amber-100 p-4 rounded-lg">
        <h2 className="text-xl font-bold text-amber-900 mb-4">Notes</h2>
        <ScoreCard playerCards={playerCards} />
      </div>

      {/* Question Log - Now fourth in order */}
      <div className="bg-blue-100 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-blue-900">Question Log</h2>
          {preview && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowQuestionForm(!showQuestionForm)}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Ask Question
            </Button>
          )}
        </div>

        {showQuestionForm && (
          <div className="bg-white p-4 rounded-lg mb-4 shadow-md">
            <h3 className="font-bold text-lg mb-3">Ask a Question</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Suspect</label>
                <select className="w-full p-2 border rounded-md">
                  {CHARACTERS.map((character, idx) => (
                    <option key={idx} value={character}>
                      {character}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Weapon</label>
                <select className="w-full p-2 border rounded-md">
                  {WEAPONS.map((weapon, idx) => (
                    <option key={idx} value={weapon}>
                      {weapon}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Room</label>
                <select className="w-full p-2 border rounded-md">
                  {LOCATIONS.map((location) => (
                    <option key={location.id} value={location.name}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowQuestionForm(false)}>
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  makeSuggestion()
                  setShowQuestionForm(false)
                }}
              >
                Ask
              </Button>
            </div>
          </div>
        )}

        <div className="overflow-auto max-h-60">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-200">
                <th className="border border-blue-300 p-2 text-left">Asker</th>
                <th className="border border-blue-300 p-2 text-left">Suspect</th>
                <th className="border border-blue-300 p-2 text-left">Weapon</th>
                <th className="border border-blue-300 p-2 text-left">Room</th>
                <th className="border border-blue-300 p-2 text-left">Answered By</th>
                <th className="border border-blue-300 p-2 text-left">Card Shown</th>
              </tr>
            </thead>
            <tbody>
              {questionLog.map((question, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}>
                  <td className="border border-blue-300 p-2">{question.asker}</td>
                  <td className="border border-blue-300 p-2">{question.suspect}</td>
                  <td className="border border-blue-300 p-2">{question.weapon}</td>
                  <td className="border border-blue-300 p-2">{question.room}</td>
                  <td className="border border-blue-300 p-2">{question.answeredBy}</td>
                  <td className="border border-blue-300 p-2">
                    {question.asker === "You" && question.revealedCard ? (
                      <span className="font-bold text-green-600">{question.revealedCard}</span>
                    ) : question.answeredBy === "You" ? (
                      <span className="font-bold text-purple-600">{question.revealedCard}</span>
                    ) : (
                      <span className="text-gray-500">{question.revealedCard ? "Card shown" : "None"}</span>
                    )}
                  </td>
                </tr>
              ))}
              {questionLog.length === 0 && (
                <tr>
                  <td colSpan={6} className="border border-blue-300 p-2 text-center text-gray-500">
                    No questions asked yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Suggestion Result Modal */}
      {showSuggestionResult && suggestionResult && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Suggestion Result</h3>
            <p className="mb-4">
              You suggested: <span className="font-bold">{suggestionResult.suspect}</span> with the{" "}
              <span className="font-bold">{suggestionResult.weapon}</span> in the{" "}
              <span className="font-bold">{suggestionResult.room}</span>
            </p>

            {suggestionResult.answeredBy === "No one" ? (
              <div className="bg-yellow-100 p-3 rounded-md mb-4">
                <p className="text-yellow-800">No player could disprove your suggestion!</p>
              </div>
            ) : (
              <div className="bg-green-100 p-3 rounded-md mb-4">
                <p className="text-green-800">
                  <span className="font-bold">{suggestionResult.answeredBy}</span> showed you:
                </p>
                <div className="mt-2 p-2 bg-white rounded-md border border-green-300 font-bold text-center">
                  {suggestionResult.revealedCard}
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <Button variant="default" onClick={() => setShowSuggestionResult(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Debug: Show solution in preview mode */}
      {preview && solution && (
        <div className="mt-4 p-2 bg-gray-100 rounded-md text-xs text-gray-500">
          <p className="font-mono">Debug - Solution (only visible in preview):</p>
          <p className="font-mono">
            {CHARACTERS[solution.suspect]} with the {WEAPONS[solution.weapon]} in the {LOCATIONS[solution.room].name}
          </p>
        </div>
      )}
    </div>
  )
}

