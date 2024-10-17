import Share from 'react-native-share'

import { isAndroid } from '../../../utils/devices'
import { authStore } from '../../../stores/auth-store'
import { DocumentV2 } from '../../../graphql/types/schema'

interface ShareFileProps {
  document: DocumentV2
  pdfUrl?: string
}

export const shareFile = ({ document, pdfUrl }: ShareFileProps) => {
  if (!document || !document.subject || !document.sender) {
    return
  }

  if (isAndroid) {
    authStore.setState({ noLockScreenUntilNextAppStateActive: true })
  }

  Share.open({
    title: document.subject,
    subject: document.subject,
    message: `${document.sender.name} \n ${document.subject}`,
    type: pdfUrl ? 'application/pdf' : undefined,
    url: pdfUrl ? `file://${pdfUrl}` : document.downloadUrl!,
  })
}
