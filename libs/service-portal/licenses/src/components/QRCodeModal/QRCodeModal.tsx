import React, { FC, useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'

import {
  Box,
  Button,
  ModalBase,
  SkeletonLoader,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useUserProfile } from '@island.is/service-portal/graphql'
import { CREATE_PK_PASS } from '@island.is/service-portal/graphql'
import { Locale } from '@island.is/shared/types'

import * as styles from './QRCodeModal.css'
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
  const [generatePkPass, { loading }] = useMutation(CREATE_PK_PASS)
  const { formatMessage } = useLocale()

  useEffect(() => {
    const getCode = async () => {
      const response = await generatePkPass({
        variables: { locale, input: { licenseType } },
      })

      if (!response.errors) {
        setPkpassQRCode(response?.data?.generatePkPass?.pkpassQRCode ?? null)
      }
    }
    getCode()
  }, [])

  return (
    <>
      {loading && <SkeletonLoader width="100%" height={158} />}
      {pkpassQRCode && (
        <Box>
          <img
            src={pkpassQRCode}
            alt={formatMessage({
              id: 'sp.driving-license:QR-code-alt-text',
              defaultMessage: 'QR code for driving license',
            })}
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
          <Tag>
            {formatMessage({
              id: 'sp.driving-license:valid-until',
              defaultMessage: 'Í gildi til ',
            })}
            {expires}
          </Tag>
          <Box marginY={1}>
            <Text variant="h3">
              {formatMessage({
                id: 'sp.driving-license:send-license-to-phone',
                defaultMessage: 'Senda ökuskírteini í síma',
              })}
            </Text>
          </Box>
          <Text>
            {formatMessage({
              id: 'sp.driving-license:send-license-to-phone-text',
              defaultMessage:
                'Skannaðu QR kóðann hér til hliðar til að fá stafrænt ökuskírteini sent í símann þinn.',
            })}
          </Text>
        </Box>
      </Box>
    </ModalBase>
  )
}

export default QRCodeModal
