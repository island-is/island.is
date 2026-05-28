export const printBlobUrl = (blobUrl: string) => {
  const iframe = document.createElement('iframe')
  iframe.style.display = 'none'
  iframe.src = blobUrl
  document.body.appendChild(iframe)

  const cleanup = () => {
    if (document.body.contains(iframe)) document.body.removeChild(iframe)
  }

  iframe.onload = () => {
    try {
      iframe.contentWindow?.focus()
      iframe.contentWindow?.print()
    } catch {
      // Firefox treats PDF plugin iframes as cross-origin — fall back to new tab
      window.open(blobUrl, '_blank')
    }
    // afterprint on contentWindow is blocked cross-origin in Firefox; clean up after a delay
    setTimeout(cleanup, 60_000)
  }

  // If the blob URL is revoked before load, onerror fires instead — clean up and open in new tab
  iframe.onerror = () => {
    cleanup()
    window.open(blobUrl, '_blank')
  }
}
