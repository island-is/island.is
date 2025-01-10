import { createBffUrlGenerator } from '@island.is/react-spa/bff'
import { ActiveDocumentType2 } from '../lib/types'

type DownloadFileArgs = {
  doc: ActiveDocumentType2
  query?: string
}

export const downloadFile = async ({ doc, query }: DownloadFileArgs) => {
  let html: string | undefined = undefined

  if (doc.document?.type === 'HTML') {
    html =
      doc.document.value && doc.document.value.length > 0
        ? doc?.document.value
        : undefined
  }

  const downloadUrl = doc?.downloadUrl

  if (html) {
    setTimeout(() => {
      const win = window.open('', '_blank')
      win && html && win.document.write(html)
      win?.focus()
    }, 250)
  } else if (downloadUrl) {
    const bffUrlGenerator = createBffUrlGenerator()
    const bffUrl = bffUrlGenerator('/api', {
      url: query ? `${downloadUrl}?action=${query}` : downloadUrl,
    })

    window.open(bffUrl, '_blank')
  } else {
    console.error('No download url found')
  }
}
