import {
  Box,
  Button,
  Icon,
  ModalBase,
  Select,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useEffect, useRef, useState } from 'react'
import { messages } from '../../lib/messages'
import * as styles from './RegisterModal.css'
import { HealthCenterDoctorOption } from '../../utils/types'

type RegisterModalProps = {
  onClose: () => void
  onAccept: (doctorId?: number) => void
  id: string
  title: string
  description: string
  buttonLoading?: boolean
  isVisible?: boolean
  healthCenterDoctors?: HealthCenterDoctorOption[]
}

export const RegisterModal = ({
  id,
  onAccept,
  onClose,
  title,
  description,
  buttonLoading = false,
  isVisible = false,
  healthCenterDoctors,
}: RegisterModalProps) => {
  const { formatMessage } = useLocale()
  const [doctorId, setDoctorId] = useState<number>()

  useEffect(() => {
    if (isVisible) {
      setDoctorId(undefined)
    }
  }, [isVisible])

  // Callers clear their selection on close, so hold the content through the fade-out
  const visibleContent = useRef({ title, healthCenterDoctors })
  if (isVisible) {
    visibleContent.current = { title, healthCenterDoctors }
  }
  const shownTitle = visibleContent.current.title
  const shownDoctors = visibleContent.current.healthCenterDoctors

  return (
    <ModalBase
      isVisible={isVisible}
      onVisibilityChange={(visible) => {
        if (!visible) {
          onClose()
        }
      }}
      baseId={id}
      modalLabel={shownTitle}
      className={styles.modalBaseStyle}
      preventBodyScroll
    >
      <Box paddingTop={10} paddingBottom={9} paddingX={3} background="white">
        <Box className={styles.closeModalButtonStyle}>
          <button
            aria-label={formatMessage(messages.closeModal)}
            onClick={onClose}
          >
            <Icon icon="close" size="large" />
          </button>
        </Box>
        <Box className={styles.modalGridStyle}>
          <Box className={styles.modalGridContentStyle}>
            <Text variant="h2">{shownTitle}</Text>
            {description ? (
              <Text marginTop={2} marginBottom={3}>
                {description}
              </Text>
            ) : (
              // Temp fix - will refactor and use core model component
              <Box marginY={15}></Box>
            )}
            {shownDoctors?.length ? (
              <Box marginBottom={3}>
                <Select
                  isClearable
                  options={shownDoctors}
                  value={
                    shownDoctors.find((doctor) => doctor.value === doctorId) ??
                    null
                  }
                  label={formatMessage(messages.chooseDoctorLabel)}
                  placeholder={formatMessage(messages.chooseDoctorPlaceholder)}
                  onChange={(val) => {
                    setDoctorId(val?.value)
                  }}
                />
              </Box>
            ) : null}
            <Box className={styles.modalGridButtonGroup}>
              <Button size="small" variant="primary" onClick={onClose}>
                {formatMessage(messages.healthRegisterModalDecline)}
              </Button>
              <Button
                size="small"
                variant="ghost"
                onClick={() => onAccept(doctorId)}
                loading={buttonLoading}
              >
                {formatMessage(messages.healthRegisterModalAccept)}
              </Button>
            </Box>
          </Box>
          <Box className={styles.modalGridImageStyle}>
            <img src="./assets/images/hourglass.svg" alt="" />
          </Box>
        </Box>
      </Box>
    </ModalBase>
  )
}
