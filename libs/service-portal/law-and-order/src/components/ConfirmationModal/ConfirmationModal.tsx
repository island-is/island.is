import {
  Box,
  Button,
  GridColumn,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { LinkResolver, Modal } from '@island.is/service-portal/core'
import { messages } from '../../lib/messages'
import { FC } from 'react'
import { LawAndOrderPaths } from '../../lib/paths'
import { useLawAndOrderContext } from '../../helpers/LawAndOrderContext'
import * as styles from './ConfirmationModal.css'

interface Props {
  id?: number
}

const SubpoenaConfirmationModal: FC<React.PropsWithChildren<Props>> = ({
  id,
}) => {
  useNamespaces('sp.law-and-order')
  const { formatMessage } = useLocale()
  const { setSubpeonaAcknowledged, setSubpeonaModalVisible } =
    useLawAndOrderContext()

  return (
    <Modal
      id="subpeona-confirmation-modal"
      onCloseModal={() => {
        setSubpeonaModalVisible(false)
        setSubpeonaAcknowledged(false)
      }}
    >
      <GridRow>
        <GridColumn span={['8/12']}>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="spaceBetween"
            marginTop={2}
          >
            <Box>
              <Text variant="h3">
                {formatMessage(messages.acknowledgeTitle)}
              </Text>
              <Text marginTop={3}>
                {formatMessage(messages.acknowledgeText)}
              </Text>
            </Box>
            <Box
              display="flex"
              justifyContent="flexStart"
              width="full"
              flexDirection="row"
              marginTop={5}
            >
              <Box>
                <Button
                  size="small"
                  variant="ghost"
                  onClick={() => {
                    setSubpeonaAcknowledged(false)
                    setSubpeonaModalVisible(false)
                  }}
                >
                  {formatMessage(messages.cancel)}
                </Button>
              </Box>
              <Box marginLeft={2}>
                <LinkResolver
                  href={LawAndOrderPaths.SubpeonaDetail.replace(
                    ':id',
                    id?.toString() || '',
                  )}
                >
                  <Button
                    colorScheme="default"
                    size="small"
                    type="text"
                    as="span"
                    unfocusable
                    onClick={() => {
                      setSubpeonaAcknowledged(true)
                      setSubpeonaModalVisible(false)
                    }}
                  >
                    {formatMessage(messages.openSubpeona)}
                  </Button>
                </LinkResolver>
              </Box>
            </Box>
          </Box>
        </GridColumn>
        <GridColumn span={['4/12']}>
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

export default SubpoenaConfirmationModal
