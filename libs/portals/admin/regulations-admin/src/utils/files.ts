export const downloadUrl = (url: string, fileName?: string) => {
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('target', '_blank')
  fileName && link.setAttribute('download', fileName)
  document.body.appendChild(link)

  link.click()
  setTimeout(() => link.remove(), 100)
}
