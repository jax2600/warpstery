import { headers } from "next/headers"

// Define common types for Farcaster Frames
type FrameButtonAction = "post" | "post_redirect" | "link" | "mint" | "tx"

interface ButtonOptions {
  label: string
  action?: FrameButtonAction
  target?: string
}

interface FrameOptions {
  image: string
  buttons?: ButtonOptions[]
  post_url?: string
  input?: {
    text?: string
  }
  state?: string
  aspektRatio?: string
}

/**
 * Gets the base URL from the request headers or falls back to a default
 */
export function getBaseUrl(): string {
  // Try to get the host from headers in server components
  try {
    const headersList = headers()
    const host = headersList.get("host") || "localhost:3000"
    const protocol = host.includes("localhost") ? "http" : "https"
    return `${protocol}://${host}`
  } catch (e) {
    // Fallback for client components or if headers aren't available
    return process.env.NEXT_PUBLIC_HOST_URL || ""
  }
}

/**
 * Ensures a URL is absolute by prepending the base URL if needed
 */
export function ensureAbsoluteUrl(url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url
  }

  // Make sure the URL starts with a slash
  const normalizedUrl = url.startsWith("/") ? url : `/${url}`
  return `${getBaseUrl()}${normalizedUrl}`
}

/**
 * Generates the frame metadata for Farcaster Frames
 */
export function getFrameMetadata(options: FrameOptions): Record<string, string> {
  // Create the basic frame metadata
  const frameMetadata: Record<string, string> = {
    "fc:frame": "vNext",
    "fc:frame:image": ensureAbsoluteUrl(options.image),
  }

  // Add post URL if provided
  if (options.post_url) {
    frameMetadata["fc:frame:post_url"] = ensureAbsoluteUrl(options.post_url)
  }

  // Add input text field if specified
  if (options.input?.text) {
    frameMetadata["fc:frame:input:text"] = options.input.text
  }

  // Add state if provided
  if (options.state) {
    frameMetadata["fc:frame:state"] = options.state
  }

  // Add aspect ratio if provided
  if (options.aspektRatio) {
    frameMetadata["fc:frame:image:aspect_ratio"] = options.aspektRatio
  }

  // Add buttons if provided
  if (options.buttons && options.buttons.length > 0) {
    options.buttons.forEach((button, index) => {
      frameMetadata[`fc:frame:button:${index + 1}`] = button.label

      if (button.action) {
        frameMetadata[`fc:frame:button:${index + 1}:action`] = button.action
      }

      if (button.target && button.target.startsWith("http")) {
        frameMetadata[`fc:frame:button:${index + 1}:target`] = button.target
      } else if (button.target) {
        frameMetadata[`fc:frame:button:${index + 1}:target`] = ensureAbsoluteUrl(button.target)
      }
    })
  }

  return frameMetadata
}

