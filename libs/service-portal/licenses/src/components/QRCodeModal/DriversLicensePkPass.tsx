import React, { useEffect, useState } from 'react'
import * as styles from './QRCodeModal.css'
import {
  AlertMessage,
  Box,
  Button,
  LoadingDots,
  SkeletonLoader,
  toast,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Locale } from '@island.is/shared/types'
import { useMutation } from '@apollo/client'
import {
  CREATE_PK_PASS_QR_CODE,
  useUserProfile,
} from '@island.is/service-portal/graphql'
import { m } from '../../lib/messages'
import QRCodeModal from './QRCodeModal'
import { isTimeMoreThen30Minutes } from '../../utils/dateUtils'

type PkPassButtonProps = {
  textButton?: boolean
  expireDate?: string
}
export const DriversLicensePkPass = ({
  textButton = false,
  expireDate,
}: PkPassButtonProps) => {
  const [pkpassQRCode, setPkpassQRCode] = useState<string | null>(null)
  const [generatePkPassQrCode, { loading: QRCodeLoading }] = useMutation(
    CREATE_PK_PASS_QR_CODE,
  )
  const { data: userProfile } = useUserProfile()
  const [modalOpen, setModalOpen] = useState(false)
  const [disablePkpass, setDisablePkpass] = useState(false)
  const [QRCodeError, setQRCodeError] = useState(false)
  const locale = (userProfile?.locale as Locale) ?? 'is'
  const { formatMessage } = useLocale()

  const timeFetched = new Date() // Used to compare if license is expired

  const toggleModal = () => {
    setModalOpen(!modalOpen)
  }

  const getPkPassQRCode = async () => {
    if (pkpassQRCode && !isTimeMoreThen30Minutes(timeFetched)) {
      return
    }
    await generatePkPassQrCode({
      variables: { locale, input: { licenseType: 'DriversLicense' } },
    })
      .then((response) => {
        setPkpassQRCode(response?.data?.generatePkPassQrCode?.pkpassQRCode)
      })
      .catch(() => {
        setQRCodeError(true)
        toast.error(formatMessage(m.licenseFetchError))
        return
      })
  }

  return (
    <>
      <Button
        colorScheme="default"
        preTextIconType="filled"
        size={textButton ? 'small' : 'default'}
        disabled={disablePkpass}
        type="button"
        variant={textButton ? 'text' : 'utility'}
        icon="QRCode"
        iconType="outline"
        onClick={() => {
          setDisablePkpass(true)
          getPkPassQRCode()
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
        </QRCodeModal>
      )}
    </>
  )
}
