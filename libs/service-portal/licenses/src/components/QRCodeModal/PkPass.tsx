import React, { useEffect, useState } from 'react'
import * as styles from './QRCodeModal.css'
import {
  Box,
  Button,
  Link,
  LoadingDots,
  SkeletonLoader,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useUserProfile } from '@island.is/service-portal/graphql'
import { Locale } from '@island.is/shared/types'
import { useMutation } from '@apollo/client'
import { CREATE_PK_PASS } from '@island.is/service-portal/graphql'
import { m } from '../../lib/messages'
import { GraphQLAstExplorer } from '@nestjs/graphql'
import QRCodeModal from './QRCodeModal'
import { theme } from '@island.is/island-ui/theme'
import { useWindowSize } from 'react-use'

type PkPassProps = {
  expireDate: string
}
export const PkPass = ({ expireDate }: PkPassProps) => {
  const [pkpassQRCode, setPkpassQRCode] = useState<string | null>(null)
  const [pkpassUrl, setPkpassUrl] = useState<string | null>(null)
  const { data: userProfile } = useUserProfile()
  const locale = (userProfile?.locale as Locale) ?? 'is'
  const [generatePkPass, { loading }] = useMutation(CREATE_PK_PASS)
  const { formatMessage } = useLocale()
  const [modalOpen, setModalOpen] = useState(false)

  const toggleModal = () => {
    setModalOpen(!modalOpen)
  }

  useEffect(() => {
    const licenseType = 'DriversLicense'
    const getCode = async () => {
      const response = await generatePkPass({
        variables: { locale, input: { licenseType } },
      })

      if (!response.errors) {
        setPkpassQRCode(response?.data?.generatePkPass?.pkpassQRCode ?? null)
        setPkpassUrl(response?.data?.generatePkPass?.pkpassUrl ?? null)
      }
    }
    getCode()
  }, [])

  const { width } = useWindowSize()
  const [isMobile, setIsMobile] = useState(false)

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
            onClick={toggleModal}
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
              {loading && <SkeletonLoader height={180} width={180} />}
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
      {isMobile && pkpassUrl && (
        <Link href={pkpassUrl}>
          <Button variant="text" size="small" icon="QRCode" iconType="outline">
            {formatMessage(m.sendToPhone)}
          </Button>
        </Link>
      )}
    </>
  )
}
