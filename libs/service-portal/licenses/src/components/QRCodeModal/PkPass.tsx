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
  const [generatePkPass, { loading: urlLoading }] = useMutation(CREATE_PK_PASS)
  const [generatePkPassQrCode, { loading: QRCodeLoading }] = useMutation(
    CREATE_PK_PASS_QR_CODE,
  )
  const [displayLoader, setDisplayLoader] = useState<boolean>(false)
  const { data: userProfile } = useUserProfile()
  const locale = (userProfile?.locale as Locale) ?? 'is'
  const { formatMessage } = useLocale()
  const [modalOpen, setModalOpen] = useState(false)
  const { width } = useWindowSize()
  const [isMobile, setIsMobile] = useState(false)

  const toggleModal = () => {
    setModalOpen(!modalOpen)
  }

  const licenseType = 'DriversLicense'

  const getCode = async () => {
    const response = await generatePkPassQrCode({
      variables: { locale, input: { licenseType } },
    })

    if (!response.errors) {
      setPkpassQRCode(
        response?.data?.generatePkPassQrCode?.pkpassQRCode ?? null,
      )
    }
  }

  const getLink = async () => {
    const response = await generatePkPass({
      variables: { locale, input: { licenseType } },
    })

    if (!response.errors) {
      const link = document.getElementById('pkpass-url')
      link?.setAttribute(
        'href',
        response?.data?.generatePkPass?.pkpassUrl ?? '',
      )
      setTimeout(() => {
        link?.click()
      }, 500)
    }
  }

  const handleClick = () => {
    setDisplayLoader(true)
    getLink()
    setDisplayLoader(false)
  }
  const handleQRCodeClick = () => {
    toggleModal()
    getCode()
  }

  useEffect(() => {
    if (width < theme.breakpoints.md) {
      return setIsMobile(true)
    }
    setIsMobile(false)
  }, [width])

  return (
    <>
      {!isMobile && (
        <>
          <Button
            variant="text"
            size="small"
            icon="QRCode"
            iconType="outline"
            onClick={handleQRCodeClick}
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
              {pkpassQRCode && (
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

      {isMobile && (
        <Button
          variant="text"
          size="small"
          icon={displayLoader ? undefined : 'QRCode'}
          iconType="outline"
          onClick={handleClick}
        >
          {formatMessage(m.sendToPhone)}{' '}
          {displayLoader && (
            <span className={styles.loader}>
              <LoadingDots single />
            </span>
          )}
        </Button>
      )}

      <Box display="none">
        <a id="pkpass-url" href={undefined} target="_blank" rel="noreferrer">
          {formatMessage(m.sendToPhone)}
        </a>
      </Box>
    </>
  )
}
