import React, { useEffect, useRef } from 'react'

import { Box, ModalBase, SkeletonLoader } from '@island.is/island-ui/core'

import { generateFormHtml } from '../../utils/3ds'
import * as styles from './ThreeDSecure.css'

interface ThreeDSecureProps {
  isActive: boolean
  postUrl: string
  scriptPath?: string
  verificationFields: { name: string; value: string }[]
  hasData: boolean
  onClose: () => void
}

export const ThreeDSecure: React.FC<ThreeDSecureProps> = ({
  isActive,
  postUrl,
  scriptPath,
  verificationFields,
  hasData,
}) => {
  const iframeContainerRef = useRef<HTMLIFrameElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const formReadyRef = useRef(false)

  useEffect(() => {
    if (!isActive) {
      if (iframeRef.current) {
        iframeRef.current.contentWindow?.document.close()
        iframeRef.current = null
      }
      formReadyRef.current = false
    }

    if (isActive && iframeRef.current && !formReadyRef.current) {
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
        formReadyRef.current = true
      }
    }
  }, [isActive, postUrl, scriptPath, verificationFields])

  return (
    <ModalBase
      baseId="3ds"
      isVisible={isActive}
      className={styles.container}
      hideOnClickOutside={false}
    >
      <Box
        position="relative"
        width="full"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box
          borderRadius="large"
          overflow="hidden"
          background="white"
          width="full"
          height="full"
          justifyContent="center"
          padding={1}
          className={styles.iframeContainer}
        >
          <Box
            position="relative"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            width="full"
            height="full"
            ref={iframeContainerRef}
            rowGap={2}
          >
            <div className={styles.loaderContainer}>
              <SkeletonLoader display="block" height="100%" width="100%" />
            </div>
            {isActive && hasData && (
              <iframe
                ref={(el) => {
                  iframeRef.current = el
                }}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  zIndex: 2,
                }}
              />
            )}
          </Box>
        </Box>
      </Box>
    </ModalBase>
  )
}
