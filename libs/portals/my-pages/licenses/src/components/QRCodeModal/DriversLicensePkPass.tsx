import { useState } from 'react'
import * as styles from './QRCodeModal.css'
import { Box, Button, SkeletonLoader, toast } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Locale } from '@island.is/shared/types'
import { useMutation } from '@apollo/client'
import {
  CREATE_PK_PASS_QR_CODE,
  useUserProfile,
} from '@island.is/portals/my-pages/graphql'
import { m } from '../../lib/messages'
import QRCodeModal from './QRCodeModal'
import { hasPassedTimeout } from '../../utils/dateUtils'

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
  const [QRCodeError, setQRCodeError] = useState(false)
  const [linkTimestamp, setLinkTimestamp] = useState<Date>()
  const locale = (userProfile?.locale as Locale) ?? 'is'
  const { formatMessage } = useLocale()

  const toggleModal = () => {
    setModalOpen(!modalOpen)
  }

  const getPkPassQRCode = async () => {
    setModalOpen(true)
    if (pkpassQRCode && !hasPassedTimeout(linkTimestamp, 10)) {
      return
    }
    await generatePkPassQrCode({
      variables: { locale, input: { licenseType: 'DriversLicense' } },
    })
      .then((response) => {
        setPkpassQRCode(response?.data?.generatePkPassQrCode?.pkpassQRCode)
        setLinkTimestamp(new Date())
      })
      .catch(() => {
        setQRCodeError(true)
        setModalOpen(false)
        toast.error(formatMessage(m.licenseFetchError))
        setTimeout(() => setQRCodeError(false), 5000)
        return
      })
  }

  return (
    <>
      <Button
        colorScheme="default"
        preTextIconType="filled"
        size={textButton ? 'small' : 'default'}
        disabled={QRCodeError}
        type="button"
        variant={textButton ? 'text' : 'utility'}
        icon="QRCode"
        iconType="outline"
        onClick={getPkPassQRCode}
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
