export const printBlobUrl = (blob: Blob) => {
  const blobUrl = URL.createObjectURL(blob)
  const iframe = document.createElement('iframe')
  iframe.style.display = 'none'
  iframe.src = blobUrl
  document.body.appendChild(iframe)

  const cleanup = () => {
    if (document.body.contains(iframe)) document.body.removeChild(iframe)
    URL.revokeObjectURL(blobUrl)
  }

  iframe.onload = () => {
    try {
      iframe.contentWindow?.focus()
      iframe.contentWindow?.print()
    } catch {
      // Firefox treats PDF plugin iframes as cross-origin — fall back to new tab
      window.open(blobUrl, '_blank')
    }
    setTimeout(cleanup, 60_000)
  }

  iframe.onerror = () => {
    cleanup()
    window.open(blobUrl, '_blank')
  }
}
