import React, { useEffect, useRef } from 'react'

import { Button } from '@island.is/island-ui/core'

import { generateFormHtml } from '../../utils/3ds'

interface ThreeDSecureProps {
  isActive: boolean
  postUrl: string
  scriptPath: string
  verificationFields: { name: string; value: string }[]
  onClose: () => void
}

export const ThreeDSecure: React.FC<ThreeDSecureProps> = ({
  isActive,
  postUrl,
  scriptPath,
  verificationFields,
  onClose,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (!isActive && iframeRef.current) {
      iframeRef.current.contentWindow?.document.close()
      iframeRef.current = null
    }

    if (isActive && iframeRef.current) {
      const iframeDoc = iframeRef.current.contentWindow?.document
      if (iframeDoc) {
        const formHtml = generateFormHtml(
          postUrl,
          scriptPath,
          verificationFields,
        )
        iframeDoc.open()
        iframeDoc.write(formHtml)
        iframeDoc.close()
      }
    }
  }, [isActive, postUrl, scriptPath, verificationFields])

  if (!isActive) return null

  return (
    <>
      <iframe
        ref={iframeRef}
        style={{ width: '100%', height: '400px', border: 'none' }}
      />
      <Button variant="text" onClick={onClose} fluid>
        Close
      </Button>
    </>
  )
}
