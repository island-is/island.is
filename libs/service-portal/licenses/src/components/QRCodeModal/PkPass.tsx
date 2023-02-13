import React, { useEffect, useState } from 'react'
import * as styles from './QRCodeModal.css'
import {
  AlertMessage,
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
  GenericLicenseType,
} from '@island.is/service-portal/graphql'
import { m } from '../../lib/messages'
import QRCodeModal from './QRCodeModal'
import { theme } from '@island.is/island-ui/theme'
import { useWindowSize } from 'react-use'

type PkPassProps = {
  licenseType: string
  expireDate?: string
  textButton?: boolean
}
export const PkPass = ({
  licenseType,
  expireDate,
  textButton = false,
}: PkPassProps) => {
  const [pkpassQRCode, setPkpassQRCode] = useState<string | null>(null)
  const [pkpassUrl, setPkpassUrl] = useState<string | null>(null)
  const [generatePkPass] = useMutation(CREATE_PK_PASS)
  const [generatePkPassQrCode, { loading: QRCodeLoading }] = useMutation(
    CREATE_PK_PASS_QR_CODE,
  )
  const { data: userProfile } = useUserProfile()
  const [displayLoader, setDisplayLoader] = useState<boolean>(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [fetched, setFetched] = useState(false)
  const [QRCodeError, setQRCodeError] = useState(false)
  const [linkError, setLinkError] = useState(false)
  const locale = (userProfile?.locale as Locale) ?? 'is'
  const { formatMessage } = useLocale()
  const { width } = useWindowSize()
  const timeFetched = new Date() // Used to compare if license is expired
  const isDriversLicense = licenseType === GenericLicenseType.DriversLicense

  const toggleModal = () => {
    setModalOpen(!modalOpen)
  }

  useEffect(() => {
    if (width < theme.breakpoints.md) {
      return setIsMobile(true)
    }
    setIsMobile(false)
  }, [width])

  const getCode = async () => {
    if (pkpassQRCode && !isTimeMoreThen30Minutes()) {
      return
    }
    await generatePkPassQrCode({
      variables: { locale, input: { licenseType } },
    })
      .then((response) => {
        setPkpassQRCode(response?.data?.generatePkPassQrCode?.pkpassQRCode)
      })
      .catch(() => {
        setQRCodeError(true)
        return
      })
  }

  const getLink = async () => {
    if (pkpassUrl && !isTimeMoreThen30Minutes()) {
      window.open(pkpassUrl)
      setDisplayLoader(false)
      return
    }
    await generatePkPass({
      variables: { locale, input: { licenseType } },
    })
      .then((response) => {
        const windowReference = window.open()
        if (windowReference) {
          setPkpassUrl(response?.data?.generatePkPass?.pkpassUrl)
          windowReference.location = response?.data?.generatePkPass?.pkpassUrl
          setFetched(true)
          setDisplayLoader(false)
        } else {
          setDisplayLoader(false)
          setLinkError(true)
        }
      })
      .catch(() => {
        setDisplayLoader(false)
        setLinkError(true)
        return
      })
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
      {!isMobile && isDriversLicense && (
        <>
          <Button
            colorScheme="default"
            preTextIconType="filled"
            size={textButton ? 'small' : 'default'}
            type="button"
            variant={textButton ? 'text' : 'utility'}
            icon="QRCode"
            iconType="outline"
            onClick={() => {
              getCode()
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
              {!QRCodeError && QRCodeLoading && (
                <SkeletonLoader height={180} width={180} />
              )}
              {!QRCodeError && pkpassQRCode && !QRCodeLoading && (
                <Box>
                  <img
                    src={pkpassQRCode}
                    alt={formatMessage(m.qrCodeAltText)}
                    className={styles.code}
                  />
                </Box>
              )}
              {QRCodeError && (
                <Box marginTop={3}>
                  <AlertMessage
                    type="error"
                    title={formatMessage(m.licenseFetchError)}
                  />
                </Box>
              )}
            </QRCodeModal>
          )}
        </>
      )}

      {(isMobile || !isDriversLicense) && (
        <Box>
          <Button
            variant="utility"
            size="small"
            icon={
              fetched && !linkError
                ? 'checkmark'
                : displayLoader
                ? undefined
                : linkError
                ? 'warning'
                : 'QRCode'
            }
            iconType="outline"
            onClick={() => {
              setDisplayLoader(true)
              getLink()
            }}
          >
            {formatMessage(m.sendToPhone)}
            {displayLoader && (
              <span className={styles.loader}>
                <LoadingDots single />
              </span>
            )}
          </Button>

          {linkError && (
            <Box marginTop={2}>
              <AlertMessage
                type="error"
                title={formatMessage(m.licenseFetchError)}
              />
            </Box>
          )}
        </Box>
      )}
    </>
  )
}
