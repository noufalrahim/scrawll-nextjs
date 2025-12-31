import { useEffect, useState } from "react"

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export default function InstallPromptBanner() {
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const ios =
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !(window as any).MSStream

    setIsIOS(ios)

    setIsStandalone(
      window.matchMedia("(display-mode: standalone)").matches ||
        (navigator as any).standalone === true
    )

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }

    window.addEventListener("beforeinstallprompt", handler)

    return () => {
      window.removeEventListener("beforeinstallprompt", handler)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const choice = await deferredPrompt.userChoice
    if (choice.outcome === "accepted") {
      setVisible(false)
    }
    setDeferredPrompt(null)
  }

  if (isStandalone || !visible) return null

  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-xl border bg-white p-4 shadow-lg">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <h3 className="text-sm font-semibold">Install this app</h3>
          <p className="text-xs text-gray-600">
            Get a faster, app-like experience on your device.
          </p>

          {isIOS && !deferredPrompt && (
            <p className="mt-2 text-xs text-gray-500">
              Tap the Share button ⎋ and choose <b>Add to Home Screen ➕</b>
            </p>
          )}
        </div>

        <button
          onClick={() => setVisible(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      {!isIOS && deferredPrompt && (
        <button
          onClick={handleInstall}
          className="mt-3 w-full rounded-md bg-black px-3 py-2 text-sm text-white"
        >
          Install
        </button>
      )}
    </div>
  )
}
