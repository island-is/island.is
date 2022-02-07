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
import { useUserProfile } from '@island.is/service-portal/graphql'
import { Locale } from '@island.is/shared/types'
import { useMutation } from '@apollo/client'
import { CREATE_PK_PASS } from '@island.is/service-portal/graphql'
interface Props {
  id: string
  onCloseModal: () => void
  toggleClose?: boolean
}

type PkPassProps = {
  licenseType: string
}

const PkPass = ({ licenseType }: PkPassProps) => {
  const [pkpassQRCode, setPkpassQRCode] = useState<string | null>(null)
  const { data: userProfile } = useUserProfile()
  const locale = (userProfile?.locale as Locale) ?? 'is'
  const [generatePkPass, { loading }] = useMutation(CREATE_PK_PASS)

  useEffect(() => {
    const getCode = async () => {
      const response = await generatePkPass({
        variables: { locale, input: { licenseType } },
      })

      if (!response.errors) {
        setPkpassQRCode(response?.data?.generatePkPass?.pkpassQRCode ?? null)
      }
      response && console.log(response)
    }
    getCode()
    console.log(pkpassQRCode)
  }, [])

  return (
    <>
      {loading && <SkeletonLoader width="100%" height={158} />}
      {/* {pkpassQRCode && <p>{pkpassQRCode}</p>} */}
      {pkpassQRCode && (
        <>
          {/* <img src={pkpassQRCode} alt="QR Code for driving license" /> */}
          <a href={pkpassQRCode}>
            <Button>SÆKJA QR KÓÐA - TEMP</Button>
          </a>
        </>
      )}
    </>
  )
}
export const QRCodeModal: FC<Props> = ({ id, toggleClose, onCloseModal }) => {
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
        flexDirection="row"
        justifyContent="spaceBetween"
      >
        <Box className={styles.closeButton}>
          <Button
            circle
            colorScheme="negative"
            icon="close"
            onClick={onCloseModal}
            size="large"
          />
        </Box>
        <Box className={styles.code} marginRight={3}>
          {/* <img
            className={styles.code}
            alt="qr-code"
            src="assets/images/qrcode-temp.png"
          /> */}
          <PkPass licenseType="DriversLicense" />
        </Box>
        <Box marginRight={7} marginY={2}>
          <Tag>
            {formatMessage({
              id: 'sp.driving-license:valid-until',
              defaultMessage: 'Í gildi til ',
            })}
            24.02.2022
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
