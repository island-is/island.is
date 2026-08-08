import * as FileSystem from 'expo-file-system'
import * as Share from 'expo-sharing'

import { getAndRefreshToken } from '@/graphql/client'
import {
  clearLockScreenSuppression,
  suppressLockScreen,
} from '@/stores/auth-store'
import { isAndroid } from '@/utils/devices'

interface DownloadHealthAttachmentProps {
  /** Download-service URL from the attachment (accepts an authorized POST) */
  url: string
  fileName: string
}

/**
 * Downloads a health conversation attachment (e.g. a certificate) from the
 * download service and opens the OS share sheet, like the inbox does for
 * PDF documents. Unlike inbox documents the content isn't available through
 * GraphQL, so the bytes are fetched from the download service with the same
 * bearer token the API client uses.
 */
export const downloadHealthAttachment = async ({
  url,
  fileName,
}: DownloadHealthAttachmentProps) => {
  if (isAndroid) {
    suppressLockScreen()
  }

  try {
    const token = await getAndRefreshToken()
    const response = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!response.ok) {
      throw new Error(`Failed to download attachment (${response.status})`)
    }

    const data = new Uint8Array(await response.arrayBuffer())
    const cacheDir = new FileSystem.Directory(FileSystem.Paths.cache)
    const file = new FileSystem.File(cacheDir, fileName.replace(/[/\\]/g, '_'))
    file.write(data)

    const mimeType = response.headers.get('content-type') ?? undefined
    await Share.shareAsync(file.uri, {
      dialogTitle: fileName,
      mimeType,
      UTI: mimeType, // For iOS, to specify the file type
    })
  } finally {
    clearLockScreenSuppression()
  }
}
