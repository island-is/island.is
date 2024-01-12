import {
  Box,
  InputFileUpload,
  Text,
  Button,
  Table as T,
  UploadFile,
  toast,
  Input,
  Stack,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../../../lib/messages'
import { useState } from 'react'
import { Modal } from '@island.is/react/components'
import { format as formatNationalId } from 'kennitala'
import { SignatureCollectionSignature } from '@island.is/api/schema'
import { createFileList, getFileData } from '../../../../lib/utils'

const CompareLists = () => {
  const { formatMessage } = useLocale()
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [fileList, setFileList] = useState<Array<UploadFile>>([])
  const [uploadResults, setUploadResults] = useState<Array<any>>()
  /*const [compareMutation, { loading }] = useBulkCompareMutation()
  const [unSignMutation] = useUnsignAdminMutation()

  const compareLists = async (nationalIds: Array<string>) => {
    try {
      const res = await compareMutation({
        variables: {
          input: {
            nationalIds: nationalIds,
          },
        },
      })

      if (res.data) {
        setUploadResults(
          res.data?.signatureCollectionBulkCompareSignaturesAllLists,
        )
      }
    } catch (e) {
      toast.error(e.message)
    }
  }

  const unSignFromList = async (signatureId: string) => {
    try {
      const res = await unSignMutation({
        variables: {
          input: {
            id: signatureId,
          },
        },
      })

      if (res.data && res.data.signatureCollectionUnsignAdmin.success) {
        toast.success(formatMessage(m.unsignFromListSuccess))
        setUploadResults(
          uploadResults?.filter((result: SignatureCollectionSignature) => {
            return result.id !== signatureId
          }),
        )
      }
    } catch (e) {
      toast.error(e.message)
    }
  }*/

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="flexEnd"
        alignItems="flexEnd"
        style={{ minWidth: '150px' }}
      >
        <Button
          variant="ghost"
          size="small"
          nowrap
          onClick={() => setModalIsOpen(true)}
        >
          {formatMessage(m.createCollection)}
        </Button>
      </Box>
      <Modal
        id="compareLists"
        isVisible={modalIsOpen}
        title={formatMessage(m.createCollection)}
        onClose={() => {
          setFileList([])
          setModalIsOpen(false)
        }}
        hideOnClickOutside={false}
        closeButtonLabel={''}
        label={''}
      >
        <Text marginBottom={5}>
          {formatMessage(m.createCollectionModalDescription)}
        </Text>
        <Stack space={3}>
          <Input name="candidateNationalId" label="Kennitala frambjóðanda" />
          <Input name="candidateName" label="Nafn frambjóðanda" readOnly />
        </Stack>
        <Box display="flex" justifyContent="center" marginY={5}>
          <Button onClick={() => setModalIsOpen(false)}>
            {formatMessage(m.createCollection)}
          </Button>
        </Box>
      </Modal>
    </Box>
  )
}

export default CompareLists
