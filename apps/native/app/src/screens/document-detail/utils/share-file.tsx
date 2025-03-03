import Share from 'react-native-share'
import RNFS from 'react-native-fs'

import { isAndroid } from '../../../utils/devices'
import { authStore } from '../../../stores/auth-store'
import { DocumentV2 } from '../../../graphql/types/schema'

interface ShareFileProps {
  document: DocumentV2
  type: 'pdf' | 'html' | 'url'
  pdfUrl?: string
  content?: string | null
}

export const shareFile = async ({
  document,
  pdfUrl,
  type,
  content,
}: ShareFileProps) => {
  if (!document || !document.subject || !document.sender) {
    return
  }
  const isHtml = type === 'html'
  let htmlUrl: string | undefined

  if (isAndroid) {
    authStore.setState({ noLockScreenUntilNextAppStateActive: true })
  }

  if (isHtml) {
    const utf8Prefix = '<meta charset="UTF-8">'
    const formattedHtml = utf8Prefix + content
    try {
      const encodedSubject = encodeURIComponent(document.subject)
      const path = `${RNFS.TemporaryDirectoryPath}/${encodedSubject}.html`
      await RNFS.writeFile(path, formattedHtml, 'utf8')
      htmlUrl = path
    } catch (error) {
      console.error('Failed to write html file', error)
      return
    }
  }

  try {
    await Share.open({
      title: document.subject,
      subject: document.subject,
      message: `${document.sender.name} \n ${document.subject}`,
      type: pdfUrl ? 'application/pdf' : isHtml ? 'text/html' : undefined,
      url: pdfUrl
        ? `file://${pdfUrl}`
        : isHtml
        ? `file://${htmlUrl}`
        : content ?? undefined,
    })
  } catch (error) {
    console.error('Failed to share document', error)
    return
  }
}
