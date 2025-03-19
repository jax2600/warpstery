export type FrameButtonAction = "post" | "post_redirect" | "link" | "mint" | "tx"

export interface FrameButtonMetadata {
  label: string
  action?: FrameButtonAction
  target?: string
}

export interface FrameMetadata {
  image: string
  buttons?: FrameButtonMetadata[]
  post_url?: string
  input?: {
    text?: string
  }
  state?: string
  version?: string
}

export interface FrameRequest {
  untrustedData: {
    fid: number
    url: string
    messageHash: string
    timestamp: number
    network: number
    buttonIndex: number
    inputText?: string
    state?: string
  }
  trustedData?: {
    messageBytes: string
  }
}

export interface QuestionLogEntry {
  asker: string
  suspect: string
  weapon: string
  room: string
  answeredBy: string
}

export interface FrameState {
  gameId?: string
  round?: number
  players?: number[]
  roomId?: number
  suspectId?: number
  weaponId?: number
  stage?: "lobby" | "playing" | "guessing" | "questioning" | "finished"

  // For questions
  questionSuspect?: number
  questionWeapon?: number
  questionRoom?: number
  questionLog?: QuestionLogEntry[]

  // Current random event
  currentEvent?: string

  // Track player positions on the board
  playerPositions?: Record<
    number,
    {
      locationId: number
      x: number
      y: number
    }
  >

  // Track which cards each player has
  playerCards?: Record<
    number,
    {
      suspects: number[]
      weapons: number[]
      rooms: number[]
    }
  >

  // The solution (what cards are in the envelope)
  solution?: {
    suspect: number
    weapon: number
    room: number
  }
}

