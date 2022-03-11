import React, { FC, useEffect, useState } from 'react'
import * as styles from './QRCodeModal.css'
import {
  Box,
  ModalBase,
  Button,
  Tag,
  Text,
  SkeletonLoader,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  CREATE_PK_PASS_QR_CODE,
  CREATE_PK_PASS,
  useUserProfile,
} from '@island.is/service-portal/graphql'
import { Locale } from '@island.is/shared/types'
import { useMutation } from '@apollo/client'

import { m } from '../../lib/messages'
interface Props {
  id: string
  onCloseModal: () => void
  toggleClose?: boolean
  expires?: string
}

type PkPassProps = {
  licenseType: string
}

const PkPass = ({ licenseType }: PkPassProps) => {
  const [pkpassQRCode, setPkpassQRCode] = useState<string | null>(null)
  const { data: userProfile } = useUserProfile()
  const locale = (userProfile?.locale as Locale) ?? 'is'
  // Might be used later if mobile users gets urls instead of qr code
  const [generatePkPass, { loading: urlLoading }] = useMutation(CREATE_PK_PASS)
  const [generatePkPassQrCode, { loading: QRCodeLoading }] = useMutation(
    CREATE_PK_PASS_QR_CODE,
  )

  const { formatMessage } = useLocale()

  useEffect(() => {
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
    getCode()
  }, [])

  return (
    <>
      {QRCodeLoading && <SkeletonLoader width="100%" height={158} />}
      {pkpassQRCode && (
        <Box>
          <img
            src={pkpassQRCode}
            alt={formatMessage(m.qrCodeAltText)}
            className={styles.code}
          />
        </Box>
      )}
    </>
  )
}

export const QRCodeModal: FC<Props> = ({
  id,
  toggleClose,
  expires,
  onCloseModal,
}) => {
  const { formatMessage } = useLocale()
  return (
    <ModalBase
      baseId={id}
      initialVisibility={false}
      className={styles.modal}
      toggleClose={toggleClose}
      isVisible={toggleClose}
    >
      <Box
        background="white"
        padding={3}
        display="flex"
        alignItems={['center', 'flexStart']}
        flexDirection={['columnReverse', 'row']}
        justifyContent="spaceBetween"
      >
        <Box className={styles.closeButton}>
          <Button
            circle
            colorScheme="negative"
            icon="close"
            onClick={onCloseModal}
            size="medium"
          />
        </Box>
        <Box className={styles.code} marginRight={3}>
          <PkPass licenseType="DriversLicense" />
        </Box>
        <Box marginRight={7} marginY={2}>
          <Tag disabled>
            {formatMessage(m.validUntil)}
            {'\xa0'}
            {expires}
          </Tag>
          <Box marginY={1}>
            <Text variant="h3">{formatMessage(m.sendLicenseToPhone)}</Text>
          </Box>
          <Text>{formatMessage(m.qrCodeText)}</Text>
        </Box>
      </Box>
    </ModalBase>
  )
}

export default QRCodeModal
