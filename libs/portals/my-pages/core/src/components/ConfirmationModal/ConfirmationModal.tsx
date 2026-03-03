import {
  Box,
  Button,
  GridColumn,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { FC } from 'react'
import * as styles from './ConfirmationModal.css'
import Modal from '../Modal/Modal'
import LinkResolver from '../LinkResolver/LinkResolver'
import { m } from '../../lib/messages'

interface Props {
  onSubmit: () => void
  onCancel: () => void
  onClose: () => void
  loading: boolean
  modalTitle: string
  modalText: string
  redirectPath: string
}

export const ConfirmationModal: FC<React.PropsWithChildren<Props>> = ({
  onSubmit,
  onCancel,
  onClose,
  loading,
  modalTitle,
  modalText,
  redirectPath,
}) => {
  useNamespaces('service.portal')
  const { formatMessage } = useLocale()

  return (
    <Modal id="confirmation-modal-errand" onCloseModal={onClose}>
      <GridRow>
        <GridColumn span={['12/12', '12/12', '8/12']}>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="spaceBetween"
            marginTop={2}
          >
            <Box>
              <Text variant="h3">{modalTitle}</Text>
              <Text marginTop={3}>{modalText}</Text>
            </Box>
            <Box
              display="flex"
              justifyContent={['spaceBetween', 'spaceBetween', 'flexStart']}
              width="full"
              flexDirection="row"
              marginTop={5}
            >
              <Box>
                <Button size="small" variant="ghost" onClick={onCancel}>
                  {formatMessage(m.buttonCancel)}
                </Button>
              </Box>
              <Box marginLeft={2}>
                <LinkResolver href={redirectPath}>
                  <Button
                    colorScheme="default"
                    size="small"
                    type="text"
                    as="span"
                    loading={loading}
                    onClick={onSubmit}
                  >
                    {formatMessage(m.openErrand)}
                  </Button>
                </LinkResolver>
              </Box>
            </Box>
          </Box>
        </GridColumn>
        <GridColumn span={['0', '0', '4/12']}>
          <Box
            justifyContent="center"
            alignItems="center"
            display="flex"
            height="full"
            width="full"
            marginRight={5}
          >
            <img
              src="./assets/images/payment.svg"
              alt=""
              className={styles.image}
            />
          </Box>
        </GridColumn>
      </GridRow>
    </Modal>
  )
}
