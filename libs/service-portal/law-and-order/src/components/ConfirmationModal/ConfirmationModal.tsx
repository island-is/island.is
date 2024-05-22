import {
  Box,
  Button,
  GridColumn,
  GridRow,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { LinkResolver, Modal } from '@island.is/service-portal/core'
import { messages } from '../../lib/messages'
import { FC } from 'react'
import { LawAndOrderPaths } from '../../lib/paths'
import { useLawAndOrderContext } from '../../helpers/LawAndOrderContext'
import * as styles from './ConfirmationModal.css'
import { usePostSubpoenaAcknowledgedMutation } from './SubpoenaAcknowledged.generated'

interface Props {
  id: string | null
}

const SubpoenaConfirmationModal: FC<React.PropsWithChildren<Props>> = ({
  id,
}) => {
  useNamespaces('sp.law-and-order')
  const { formatMessage } = useLocale()
  const { setSubpoenaAcknowledged, setSubpoenaModalVisible } =
    useLawAndOrderContext()

  const [postAction, { loading: postActionLoading, data: updateData }] =
    usePostSubpoenaAcknowledgedMutation({
      onError: () => {
        toast.error(formatMessage(messages.registrationError))
      },
      onCompleted: () => {
        setSubpoenaModalVisible(false)
        //TODO: What to do if user closes or cancel the pop up?
        updateData?.lawAndOrderSubpoenaAcknowledged?.acknowledged &&
          toast.success(formatMessage(messages.registrationCompleted))
      },
    })

  const handleSubmit = (status: boolean) => {
    // TODO: What to do if error ?
    if (!id) return
    setSubpoenaAcknowledged(status)
    postAction({
      variables: {
        input: {
          caseId: id,
          acknowledged: status,
        },
      },
    })
  }
  return (
    <Modal
      id="subpoena-confirmation-modal"
      onCloseModal={() => {
        setSubpoenaModalVisible(false)
      }}
    >
      <GridRow>
        <GridColumn span={['12/12', '12/12', '8/12']}>
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
              justifyContent={['spaceBetween', 'spaceBetween', 'flexStart']}
              width="full"
              flexDirection="row"
              marginTop={5}
            >
              <Box>
                <Button
                  size="small"
                  variant="ghost"
                  onClick={() => {
                    handleSubmit(false)
                  }}
                >
                  {formatMessage(messages.cancel)}
                </Button>
              </Box>
              <Box marginLeft={2}>
                <LinkResolver
                  href={LawAndOrderPaths.SubpoenaDetail.replace(
                    ':id',
                    id?.toString() || '',
                  )}
                >
                  <Button
                    colorScheme="default"
                    size="small"
                    type="text"
                    as="span"
                    loading={postActionLoading}
                    onClick={() => {
                      handleSubmit(true)
                    }}
                  >
                    {formatMessage(messages.openSubpoena)}
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

export default SubpoenaConfirmationModal
