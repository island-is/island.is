import React, { useEffect, useRef } from 'react'

import { Box, ModalBase, SkeletonLoader } from '@island.is/island-ui/core'

import {
  generateFormHtml,
  ThreeDSFormData,
  watchGatewayFormSubmit,
} from '../../utils/3ds'
import * as styles from './ThreeDSecure.css'

const cancelSubmitWatch = (
  cancelRef: React.MutableRefObject<(() => void) | null>,
) => {
  cancelRef.current?.()
  cancelRef.current = null
}

interface ThreeDSecureProps extends ThreeDSFormData {
  isActive: boolean
  hasData: boolean
  onClose: () => void
}

export const ThreeDSecure: React.FC<ThreeDSecureProps> = ({
  isActive,
  postUrl,
  scriptPath,
  cardVerificationRawResponse,
  verificationFields,
  tdsMethodPostUrl,
  tdsMethodFields,
  authenticationType,
  hasData,
}) => {
  const iframeContainerRef = useRef<HTMLIFrameElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const formReadyRef = useRef(false)
  const cancelSubmitWatchRef = useRef<(() => void) | null>(null)

  // Stop watching the form when the modal goes away
  useEffect(() => () => cancelSubmitWatch(cancelSubmitWatchRef), [])

  useEffect(() => {
    if (!isActive) {
      cancelSubmitWatch(cancelSubmitWatchRef)
      if (iframeRef.current) {
        iframeRef.current.contentWindow?.document.close()
        iframeRef.current = null
      }
      formReadyRef.current = false
    }

    if (isActive && iframeRef.current && !formReadyRef.current) {
      const iframeDoc = iframeRef.current.contentWindow?.document

      if (iframeDoc) {
        const formHtml = generateFormHtml({
          postUrl,
          scriptPath,
          cardVerificationRawResponse,
          verificationFields,
          tdsMethodPostUrl,
          tdsMethodFields,
          authenticationType,
        })
        iframeDoc.open()
        iframeDoc.write(formHtml)
        iframeDoc.close()
        formReadyRef.current = true

        // After writing, document.open() removes the window's listeners
        const iframeWindow = iframeRef.current.contentWindow
        if (iframeWindow) {
          cancelSubmitWatch(cancelSubmitWatchRef)
          cancelSubmitWatchRef.current = watchGatewayFormSubmit(iframeWindow)
        }
      }
    }
  }, [
    isActive,
    postUrl,
    scriptPath,
    cardVerificationRawResponse,
    verificationFields,
    tdsMethodPostUrl,
    tdsMethodFields,
    authenticationType,
  ])

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
