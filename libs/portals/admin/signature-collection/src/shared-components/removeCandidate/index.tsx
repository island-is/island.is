import { useLocale } from '@island.is/localization'
import {
  Box,
  Button,
  GridColumn,
  GridRow,
  Icon,
  Tag,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { useState } from 'react'
import { Modal } from '@island.is/react/components'
import { m } from '../../lib/messages'
import { useSignatureCollectionAdminRemoveCandidateMutation } from './removeCandidate.generated'
import { useNavigate } from 'react-router-dom'
import { SignatureCollectionList } from '@island.is/api/schema'

const RemoveCandidate = ({ list }: { list: SignatureCollectionList }) => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()

  const [modalRemoveCandidateIsOpen, setModalRemoveCandidateIsOpen] =
    useState(false)

  const [removeCandidate, { loading }] =
    useSignatureCollectionAdminRemoveCandidateMutation({
      variables: {
        input: {
          candidateId: list?.candidate?.id,
        },
      },
      onCompleted: (response) => {
        if (response.signatureCollectionAdminRemoveCandidate?.success) {
          setModalRemoveCandidateIsOpen(false)
          toast.success(formatMessage(m.cancelCollectionModalToastSuccess))
          navigate(-1)
        } else {
          const message =
            response.signatureCollectionAdminRemoveCandidate?.reasons?.[0] ??
            formatMessage(m.cancelCollectionModalToastError)
          toast.error(message)
        }
      },
      onError: () => {
        toast.error(formatMessage(m.cancelCollectionModalToastError))
      },
    })

  return (
    <Box>
      <GridRow>
        <GridColumn span={['12/12', '12/12', '12/12', '10/12']}>
          <Box display="flex">
            <Tag variant="red">
              <Box display="flex" justifyContent="center">
                <Icon icon="trash" type="outline" color="red600" />
              </Box>
            </Tag>
            <Box marginLeft={5}>
              <Text variant="h4">
                {formatMessage(m.cancelCollectionButton)}
              </Text>
              <Text marginBottom={2}>
                Texti sem útskýrir þessa aðgerð betur kemur hér.
              </Text>
              <Button
                variant="text"
                size="small"
                colorScheme="destructive"
                onClick={() => setModalRemoveCandidateIsOpen(true)}
              >
                {formatMessage(m.cancelCollectionButton)}
              </Button>
            </Box>
          </Box>
        </GridColumn>
      </GridRow>
      <Modal
        id="toggleLockList"
        isVisible={modalRemoveCandidateIsOpen}
        title={formatMessage(m.cancelCollectionButton)}
        onClose={() => setModalRemoveCandidateIsOpen(false)}
        label={''}
        closeButtonLabel={''}
      >
        <Box>
          <Text>{formatMessage(m.cancelCollectionModalMessage)}</Text>
          <Box display="flex" justifyContent="flexEnd" marginTop={5}>
            <Button
              iconType="outline"
              variant="ghost"
              onClick={() => removeCandidate()}
              icon="trash"
              colorScheme="destructive"
              loading={loading}
            >
              {formatMessage(m.cancelCollectionModalConfirmButton)}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  )
}

export default RemoveCandidate
