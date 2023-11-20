import { useParams } from 'react-router-dom'
import React, { FC, useState } from 'react'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { m, Modal } from '@island.is/service-portal/core'

interface Props {
  formValue?: string
  postActionLoading?: boolean
  buttonRef: React.RefObject<HTMLButtonElement>
}

const MileageConfirmation: FC<React.PropsWithChildren<Props>> = ({
  postActionLoading,
  buttonRef,
  formValue,
}) => {
  useNamespaces('sp.vehicles')
  const { formatMessage } = useLocale()
  const [modalIsOpen, setModalIsOpen] = useState(false)

  return (
    <Modal
      id="confirmation-modal"
      isVisible={modalIsOpen}
      toggleClose={false}
      initialVisibility={false}
      disclosure={
        <Button
          variant="primary"
          size="small"
          fluid
          type="button"
          onClick={() => setModalIsOpen(true)}
          loading={postActionLoading}
        >
          {formatMessage(m.save)}2
        </Button>
      }
    >
      <Box>
        <Text>
          Þú ert að fara að færa inn kílómetrastöðu: {formValue || '0 km'}
        </Text>
        <Button
          variant="primary"
          size="small"
          type="button"
          disabled={!buttonRef.current}
          onClick={
            buttonRef.current
              ? () => {
                  buttonRef.current?.click()
                  setModalIsOpen(false)
                }
              : undefined
          }
        >
          {formatMessage(m.save)}2
        </Button>
      </Box>
    </Modal>
  )
}

export default MileageConfirmation
