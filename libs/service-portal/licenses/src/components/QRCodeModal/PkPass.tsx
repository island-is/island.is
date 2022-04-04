import React, { useEffect, useState } from 'react'
import * as styles from './QRCodeModal.css'
import {
  Box,
  Button,
  LoadingDots,
  SkeletonLoader,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Locale } from '@island.is/shared/types'
import { useMutation } from '@apollo/client'
import {
  CREATE_PK_PASS_QR_CODE,
  CREATE_PK_PASS,
  useUserProfile,
} from '@island.is/service-portal/graphql'
import { m } from '../../lib/messages'
import QRCodeModal from './QRCodeModal'
import { theme } from '@island.is/island-ui/theme'
import { useWindowSize } from 'react-use'

type PkPassProps = {
  expireDate: string
}
export const PkPass = ({ expireDate }: PkPassProps) => {
  const [pkpassQRCode, setPkpassQRCode] = useState<string | null>(null)
  const [pkpassUrl, setPkpassUrl] = useState<string | null>(null)
  const [generatePkPass, { loading: urlLoading }] = useMutation(CREATE_PK_PASS)
  const [generatePkPassQrCode, { loading: QRCodeLoading }] = useMutation(
    CREATE_PK_PASS_QR_CODE,
  )
  const { data: userProfile } = useUserProfile()
  const [displayLoader, setDisplayLoader] = useState<boolean>(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const locale = (userProfile?.locale as Locale) ?? 'is'
  const { formatMessage } = useLocale()
  const { width } = useWindowSize()
  const timeFetched = new Date() // Used to compare if license is expired

  const toggleModal = () => {
    setModalOpen(!modalOpen)
  }

  const licenseType = 'DriversLicense'

  useEffect(() => {
    if (width < theme.breakpoints.md) {
      return setIsMobile(true)
    }
    setIsMobile(false)
  }, [width])

  /* Fetch pkpass on load  */
  useEffect(() => {
    width < theme.breakpoints.md ? getLink() : getCode()
  }, [])

  const getCode = async () => {
    const response = await generatePkPassQrCode({
      variables: { locale, input: { licenseType } },
    })

    if (!response.errors) {
      setPkpassQRCode(response?.data?.generatePkPassQrCode?.pkpassQRCode)
    }
  }

  const getLink = async () => {
    const response = await generatePkPass({
      variables: { locale, input: { licenseType } },
    })

    if (!response.errors) {
      setPkpassUrl(response?.data?.generatePkPass?.pkpassUrl)
    }
  }

  /* License is expired if 30 minutes has passed -> fetch pkpass again */
  const isTimeMoreThen30Minutes = () => {
    const now = new Date()
    const timeDiff = Math.abs(now.getTime() - timeFetched?.getTime())
    const diffMinutes = Math.ceil(timeDiff / (1000 * 60))
    return diffMinutes > 30
  }

  return (
    <>
      {!isMobile && (
        <>
          <Button
            variant="text"
            size="small"
            icon="QRCode"
            iconType="outline"
            onClick={() => {
              const isExpired = isTimeMoreThen30Minutes()
              if (isExpired) getCode()
              toggleModal()
            }}
          >
            {formatMessage(m.sendToPhone)}
          </Button>
          {modalOpen && (
            <QRCodeModal
              id="qrcode-modal"
              toggleClose={modalOpen}
              onCloseModal={toggleModal}
              expires={expireDate}
            >
              {QRCodeLoading && <SkeletonLoader height={180} width={180} />}
              {pkpassQRCode && !QRCodeLoading && (
                <Box>
                  <img
                    src={pkpassQRCode}
                    alt={formatMessage(m.qrCodeAltText)}
                    className={styles.code}
                  />
                </Box>
              )}
            </QRCodeModal>
          )}
        </>
      )}

      {/* Display "fake" button with loading dots if user clicks when url not ready */}
      {isMobile && urlLoading && (
        <Box className={styles.pkpassButton}>
          <Button
            variant="text"
            size="small"
            icon={displayLoader ? undefined : 'QRCode'}
            iconType="outline"
            onClick={() => setDisplayLoader(true)}
          >
            {formatMessage(m.sendToPhone)}{' '}
            {displayLoader && (
              <span className={styles.loader}>
                <LoadingDots single />
              </span>
            )}
          </Button>
        </Box>
      )}
      {/* Display link button when url is ready. */}
      {isMobile && pkpassUrl && !urlLoading && (
        <a
          className={styles.pkpassButton}
          href={pkpassUrl}
          id="pkpass-url"
          target="_blank"
          rel="noreferrer"
          onClick={(e) => {
            const isExpired = isTimeMoreThen30Minutes()
            if (isExpired) {
              e.preventDefault
              getLink()
              document
                .getElementById('pkpass-url')
                ?.setAttribute('href', pkpassUrl)
            }
          }}
        >
          <Button variant="text" size="small" icon="QRCode" iconType="outline">
            {formatMessage(m.sendToPhone)}{' '}
          </Button>
        </a>
      )}
    </>
  )
}
