export const printBlobUrl = (blobUrl: string) => {
  const iframe = document.createElement('iframe')
  iframe.style.display = 'none'
  iframe.src = blobUrl
  document.body.appendChild(iframe)
  iframe.onload = () => {
    iframe.contentWindow?.focus()
    iframe.contentWindow?.print()
    setTimeout(() => document.body.removeChild(iframe), 500)
  }
}
