import * as Share from 'expo-sharing'
import * as FileSystem from 'expo-file-system'

import { isAndroid } from '@/utils/devices'
import { authStore } from '@/stores/auth-store'
import { DocumentV2 } from '@/graphql/types/schema'

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
      const cacheDir = new FileSystem.Directory(FileSystem.Paths.cache)
      const htmlFile = new FileSystem.File(cacheDir, `${encodedSubject}.html`)
      htmlFile.write(formattedHtml)
      htmlUrl = htmlFile.uri
    } catch (error) {
      console.error('Failed to write html file', error)
      return
    }
  }

  try {
    const url = pdfUrl
      ? pdfUrl
      : isHtml
        ? htmlUrl
        : content ?? undefined;
    const mimeType = pdfUrl ? 'application/pdf' : isHtml ? 'text/html' : undefined;
    await Share.shareAsync(url ?? '', {
      dialogTitle: document.subject,
      mimeType,
      UTI: mimeType, // For iOS, to specify the file type
    });
  } catch (error) {
    console.error('Failed to share document', error)
    return
  }
}
