import { ActiveDocumentType2 } from '../lib/types'
import { useBffUrlGenerator } from '@island.is/react-spa/bff'

type DownloadFileArgs = {
  bffUrlGenerator: ReturnType<typeof useBffUrlGenerator>
  doc: ActiveDocumentType2
  query?: string
}

export const downloadFile = async ({
  bffUrlGenerator,
  doc,
  query,
}: DownloadFileArgs) => {
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
    const url = query ? `${doc?.downloadUrl}?action=${query}` : doc?.downloadUrl

    window.open(
      bffUrlGenerator('/api', {
        url,
      }),
      '_blank',
    )
  }
}
