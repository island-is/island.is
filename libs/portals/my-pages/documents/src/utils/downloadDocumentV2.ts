import { ServicePortalPaths } from '@island.is/portals/my-pages/core'
import { createBffUrlGenerator } from '@island.is/react-spa/bff'
import { ActiveDocumentType2 } from '../lib/types'

type DownloadFileArgs = {
  doc: ActiveDocumentType2
  query?: string
}

export const downloadFile = async ({ doc, query }: DownloadFileArgs) => {
  let html: string | undefined = undefined

  if (doc?.document.type === 'HTML') {
    html =
      doc.document.value && doc.document.value.length > 0
        ? doc?.document.value
        : undefined
  }

  if (html) {
    setTimeout(() => {
      const win = window.open('', '_blank')
      win && html && win.document.write(html)
      win?.focus()
    }, 250)
  } else {
    const bffUrlGenerator = createBffUrlGenerator(ServicePortalPaths.Base)
    const bffUrl = bffUrlGenerator('/api', {
      url: query ? `${doc?.downloadUrl}?action=${query}` : doc?.downloadUrl,
    })

    window.open(bffUrl, '_blank')
  }
}
