import Share from 'react-native-share'

import { isAndroid } from '../../../utils/devices'
import { authStore } from '../../../stores/auth-store'
import { DocumentV2 } from '../../../graphql/types/schema'

interface ShareFileProps {
  document: DocumentV2
  hasPdf: boolean
  pdfUrl?: string
}

export const shareFile = ({ document, hasPdf, pdfUrl }: ShareFileProps) => {
  if (
    !document ||
    !document.subject ||
    !document.sender ||
    (hasPdf && !pdfUrl)
  ) {
    return
  }

  if (isAndroid) {
    authStore.setState({ noLockScreenUntilNextAppStateActive: true })
  }

  Share.open({
    title: document.subject,
    subject: document.subject,
    message: `${document.sender.name} \n ${document.subject}`,
    type: hasPdf ? 'application/pdf' : undefined,
    url: hasPdf ? `file://${pdfUrl}` : document.downloadUrl!,
  })
}
