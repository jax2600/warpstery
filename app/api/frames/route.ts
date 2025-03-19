import { type NextRequest, NextResponse } from "next/server"
import { getFrameMetadata } from "@/lib/frames"
import type { FrameRequest, FrameState } from "@/types/frames"

// Character cards
const CHARACTERS = ["DWR", "V", "Ted not lasso", "Linda", "Horsefacts", "woj", "gt", "sds", "deodad"]

// Weapon cards
const WEAPONS = ["Gas Fee", "Toxic Meme", "Private Key", "Social Hack", "NFT Rug", "Bad Take"]

// Locations
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

export async function POST(req: NextRequest) {
  try {
    // Parse the frame request from the client
    const body: FrameRequest = await req.json()
    const { buttonIndex, fid, inputText, state: encodedState } = body.untrustedData

    // Default state if no state is provided
    let state: FrameState = {
      stage: "lobby",
      round: 0,
      players: [],
      playerCards: {},
      questionLog: [],
      currentEvent: null,
    }

    // Decode state if it exists
    if (encodedState) {
      try {
        state = JSON.parse(Buffer.from(encodedState, "base64").toString())
      } catch (e) {
        console.error("Error decoding state:", e)
      }
    }

    // Add the player if they're not already in the game
    if (!state.players?.includes(fid)) {
      state.players = [...(state.players || []), fid]
    }

    // Handle different button actions
    switch (buttonIndex) {
      case 1: // Start Game or Make a Move
        if (state.stage === "lobby") {
          state.stage = "playing"
          state.round = 1

          // Generate a completely random solution
          const allCards = {
            suspects: [...Array(CHARACTERS.length).keys()],
            weapons: [...Array(WEAPONS.length).keys()],
            rooms: [...Array(ROOMS.length).keys()],
          }

          // Randomly select one card of each type for the solution
          const suspectIndex = Math.floor(Math.random() * allCards.suspects.length)
          const weaponIndex = Math.floor(Math.random() * allCards.weapons.length)
          const roomIndex = Math.floor(Math.random() * allCards.rooms.length)

          state.solution = {
            suspect: allCards.suspects[suspectIndex],
            weapon: allCards.weapons[weaponIndex],
            room: allCards.rooms[roomIndex],
          }

          // Remove solution cards from the deck
          const remainingCards = {
            suspects: allCards.suspects.filter((i) => i !== state.solution.suspect),
            weapons: allCards.weapons.filter((i) => i !== state.solution.weapon),
            rooms: allCards.rooms.filter((i) => i !== state.solution.room),
          }

          // Deal cards to players
          // This is a simplified version - in a real game you'd deal evenly
          state.playerCards = {}
          state.players.forEach((playerId) => {
            state.playerCards[playerId] = {
              suspects: [],
              weapons: [],
              rooms: [],
            }
          })

          // Randomly select an event
          state.currentEvent = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)]

          return NextResponse.json({
            frame: getFrameMetadata({
              image: `/images/game-board.png`,
              state: Buffer.from(JSON.stringify(state)).toString("base64"),
              buttons: [
                { label: "Roll Dice", action: "post" },
                { label: "Suggest", action: "post" },
                { label: "Accuse", action: "post" },
              ],
            }),
          })
        } else if (state.stage === "playing") {
          // Logic for dice roll
          const roll = Math.floor(Math.random() * 6) + 1

          return NextResponse.json({
            frame: getFrameMetadata({
              image: `/images/roll-${roll}.png`,
              state: Buffer.from(JSON.stringify(state)).toString("base64"),
              buttons: [
                { label: "Move", action: "post" },
                { label: "Suggest", action: "post" },
                { label: "Accuse", action: "post" },
              ],
            }),
          })
        }
        break

      case 2: // Make Accusation
        if (state.stage === "playing") {
          state.stage = "guessing"

          return NextResponse.json({
            frame: getFrameMetadata({
              image: `/images/accusation.png`,
              state: Buffer.from(JSON.stringify(state)).toString("base64"),
              buttons: [
                { label: CHARACTERS[0], action: "post" },
                { label: CHARACTERS[1], action: "post" },
                { label: CHARACTERS[2], action: "post" },
              ],
            }),
          })
        } else if (state.stage === "guessing") {
          // Process suspect selection
          state.suspectId = buttonIndex - 1

          return NextResponse.json({
            frame: getFrameMetadata({
              image: `/images/weapon-selection.png`,
              state: Buffer.from(JSON.stringify(state)).toString("base64"),
              buttons: [
                { label: WEAPONS[0], action: "post" },
                { label: WEAPONS[1], action: "post" },
                { label: WEAPONS[2], action: "post" },
              ],
            }),
          })
        }
        break

      case 3: // Ask Question or continue accusation flow
        if (state.stage === "playing") {
          // Start the question flow
          state.stage = "questioning"

          return NextResponse.json({
            frame: getFrameMetadata({
              image: `/images/question-suspect.png`,
              state: Buffer.from(JSON.stringify(state)).toString("base64"),
              buttons: [
                { label: CHARACTERS[0], action: "post" },
                { label: CHARACTERS[1], action: "post" },
                { label: CHARACTERS[2], action: "post" },
                { label: "More Suspects", action: "post" },
              ],
            }),
          })
        } else if (state.stage === "guessing") {
          // Process weapon selection
          state.weaponId = buttonIndex - 1

          // Now ask for the room
          return NextResponse.json({
            frame: getFrameMetadata({
              image: `/images/room-selection.png`,
              state: Buffer.from(JSON.stringify(state)).toString("base64"),
              buttons: [
                { label: ROOMS[0], action: "post" },
                { label: ROOMS[1], action: "post" },
                { label: ROOMS[2], action: "post" },
                { label: "More Rooms", action: "post" },
              ],
            }),
          })
        } else if (state.stage === "questioning") {
          // Process suspect selection for question
          state.questionSuspect = buttonIndex - 1

          return NextResponse.json({
            frame: getFrameMetadata({
              image: `/images/question-weapon.png`,
              state: Buffer.from(JSON.stringify(state)).toString("base64"),
              buttons: [
                { label: WEAPONS[0], action: "post" },
                { label: WEAPONS[1], action: "post" },
                { label: WEAPONS[2], action: "post" },
                { label: "More Weapons", action: "post" },
              ],
            }),
          })
        }
        break

      case 4: // More options or room selection
        if (state.stage === "guessing") {
          // Process room selection
          state.roomId = buttonIndex - 1

          // Check if the accusation is correct
          const isCorrect =
            state.suspectId === state.solution?.suspect &&
            state.weaponId === state.solution?.weapon &&
            state.roomId === state.solution?.room

          if (isCorrect) {
            const shareText = `I solved the Warpstery case in the Farverse! The culprit was ${CHARACTERS[state.suspectId]} with the ${WEAPONS[state.weaponId]} in the ${ROOMS[state.roomId]}`

            return NextResponse.json({
              frame: getFrameMetadata({
                image: `/images/solved.png`,
                buttons: [
                  { label: "Play Again", action: "post" },
                  {
                    label: "Share Victory",
                    action: "post_redirect",
                    target: `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}`,
                  },
                ],
              }),
            })
          } else {
            return NextResponse.json({
              frame: getFrameMetadata({
                image: `/images/wrong-guess.png`,
                state: Buffer.from(JSON.stringify({ ...state, stage: "playing" })).toString("base64"),
                buttons: [
                  { label: "Continue Playing", action: "post" },
                  { label: "New Round", action: "post" },
                  {
                    label: "Share Game",
                    action: "post_redirect",
                    target:
                      "https://warpcast.com/~/compose?text=I'm%20playing%20Warpstery%20-%20a%20Clue-like%20mystery%20game%20in%20the%20Farverse!%20Come%20join%20the%20investigation!",
                  },
                ],
              }),
            })
          }
        } else if (state.stage === "questioning") {
          // Handle "More" options or process weapon selection for question
          if (buttonIndex === 4) {
            // Show more suspects
            return NextResponse.json({
              frame: getFrameMetadata({
                image: `/images/question-suspect-more.png`,
                state: Buffer.from(JSON.stringify(state)).toString("base64"),
                buttons: [
                  { label: CHARACTERS[3], action: "post" },
                  { label: CHARACTERS[4], action: "post" },
                  { label: CHARACTERS[5], action: "post" },
                  { label: "More Suspects", action: "post" },
                ],
              }),
            })
          } else {
            // Process weapon selection and move to room selection
            state.questionWeapon = buttonIndex - 1

            return NextResponse.json({
              frame: getFrameMetadata({
                image: `/images/question-room.png`,
                state: Buffer.from(JSON.stringify(state)).toString("base64"),
                buttons: [
                  { label: ROOMS[0], action: "post" },
                  { label: ROOMS[1], action: "post" },
                  { label: ROOMS[2], action: "post" },
                  { label: "More Rooms", action: "post" },
                ],
              }),
            })
          }
        }
        break

      case 5: // Process final question part or handle more options
        if (state.stage === "questioning") {
          if (buttonIndex === 4) {
            // Show more weapons or rooms depending on the state
            if (state.questionSuspect !== undefined && state.questionWeapon === undefined) {
              return NextResponse.json({
                frame: getFrameMetadata({
                  image: `/images/question-weapon-more.png`,
                  state: Buffer.from(JSON.stringify(state)).toString("base64"),
                  buttons: [
                    { label: WEAPONS[3], action: "post" },
                    { label: WEAPONS[4], action: "post" },
                    { label: WEAPONS[5], action: "post" },
                    { label: "Back", action: "post" },
                  ],
                }),
              })
            } else {
              // Show more rooms
              return NextResponse.json({
                frame: getFrameMetadata({
                  image: `/images/question-room-more.png`,
                  state: Buffer.from(JSON.stringify(state)).toString("base64"),
                  buttons: [
                    { label: ROOMS[3], action: "post" },
                    { label: ROOMS[4], action: "post" },
                    { label: ROOMS[5], action: "post" },
                    { label: "Back", action: "post" },
                  ],
                }),
              })
            }
          } else {
            // Process room selection and complete the question
            state.questionRoom = buttonIndex - 1

            // Add the question to the log
            if (!state.questionLog) {
              state.questionLog = []
            }

            state.questionLog.push({
              asker: `Player ${state.players.indexOf(fid) + 1}`,
              suspect: CHARACTERS[state.questionSuspect],
              weapon: WEAPONS[state.questionWeapon],
              room: ROOMS[state.questionRoom],
              answeredBy: `Player ${Math.floor(Math.random() * state.players.length) + 1}`,
            })

            // Return to playing state
            state.stage = "playing"

            // Generate a new random event
            state.currentEvent = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)]

            return NextResponse.json({
              frame: getFrameMetadata({
                image: `/images/question-result.png`,
                state: Buffer.from(JSON.stringify(state)).toString("base64"),
                buttons: [{ label: "Continue", action: "post" }],
              }),
            })
          }
        }
        break

      default:
        // Return to main menu for any other button or fallback
        return NextResponse.json({
          frame: getFrameMetadata({
            image: `/images/warpstery-title.png`,
            buttons: [{ label: "Start Game", action: "post" }],
          }),
        })
    }

    // Default response if nothing else matches
    return NextResponse.json({
      frame: getFrameMetadata({
        image: `/images/warpstery-title.png`,
        buttons: [{ label: "Start Game", action: "post" }],
      }),
    })
  } catch (error) {
    console.error("Error handling frame request:", error)

    // Return a fallback response in case of error
    return NextResponse.json({
      frame: getFrameMetadata({
        image: `/images/error.png`,
        buttons: [{ label: "Try Again", action: "post" }],
      }),
    })
  }
}

