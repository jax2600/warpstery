import type { Metadata } from "next"
import GameBoard from "@/components/game-board"
import { getFrameMetadata } from "@/lib/frames"

export async function generateMetadata(): Promise<Metadata> {
  const frameMetadata = getFrameMetadata({
    buttons: [
      {
        label: "Start Game",
        action: "post",
      },
    ],
    image: `/images/warpstery-title.png`,
    post_url: `/api/frames`,
  })

  return {
    title: "Warpstery",
    description:
      "Nefarious activities have transpired in the World of Warpcast. You as a prolific caster and harbinger of transparency, have been selected to deduce the truth and uncover the truth behind these mysterious events.",
    openGraph: {
      title: "Warpstery",
      description:
        "Nefarious activities have transpired in the World of Warpcast. You as a prolific caster and harbinger of transparency, have been selected to deduce the truth and uncover the truth behind these mysterious events.",
      images: [`/images/warpstery-title.png`],
    },
    other: {
      ...frameMetadata,
    },
  }
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-900">
      <div className="max-w-5xl w-full">
        <h1 className="text-4xl font-bold text-center mb-2 text-purple-400">Warpstery</h1>
        <p className="text-center text-2xl mb-4 text-purple-200">
          Nefarious activities have transpired in the World of Warpcast.
        </p>
        <p className="text-center text-lg mb-8 text-white">
          You as a prolific caster and harbinger of transparency, have been selected to deduce the truth and uncover the
          truth behind these mysterious events.
        </p>
        <div className="bg-slate-800 p-6 rounded-lg shadow-xl">
          <GameBoard preview={true} />
        </div>
        <div className="text-center mt-6 text-sm text-gray-400">
          <p>View this in Warpcast to play the interactive frame game!</p>
        </div>
      </div>
    </main>
  )
}

