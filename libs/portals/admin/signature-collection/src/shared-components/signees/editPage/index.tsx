import {
  Icon,
  Box,
  Button,
  Input,
  Stack,
  GridColumn,
  GridRow,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../../lib/messages'
import { Modal } from '@island.is/react/components'
import { useState } from 'react'
import { useSignatureCollectionAdminUpdatePaperSignaturePageNumberMutation } from './editPage.generated'
import { toast } from 'react-toastify'
import { useRevalidator } from 'react-router-dom'

const EditPage = ({
  page,
  name,
  nationalId,
  signatureId,
}: {
  page: number
  name: string
  nationalId: string
  signatureId: string
}) => {
  const { formatMessage } = useLocale()
  const [newPage, setNewPage] = useState(page)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const { revalidate } = useRevalidator()

  const [updatePage, { loading }] =
    useSignatureCollectionAdminUpdatePaperSignaturePageNumberMutation({
      variables: {
        input: {
          pageNumber: newPage,
          signatureId: signatureId,
        },
      },
      onCompleted: () => {
        toast.success(formatMessage(m.editPaperNumberSuccess))
        revalidate()
        setModalIsOpen(false)
      },
      onError: () => {
        toast.error(formatMessage(m.editPaperNumberError))
      },
    })

  return (
    <Box>
      <Box marginLeft={1} onClick={() => setModalIsOpen(true)} cursor="pointer">
        <Icon icon="pencil" color="blue400" />
      </Box>
      <Modal
        id="editPageModal"
        isVisible={modalIsOpen}
        title={formatMessage(m.editPaperNumber)}
        onClose={() => {
          setNewPage(page)
          setModalIsOpen(false)
        }}
        hideOnClickOutside={false}
        closeButtonLabel={''}
        label={''}
      >
        <Box marginY={3}>
          <GridRow>
            <GridColumn span="10/12" offset="1/12">
              <Stack space={3}>
                <Input
                  name="page"
                  label={formatMessage(m.paperNumber)}
                  value={newPage}
                  size="sm"
                  onChange={(e) =>
                    setNewPage(Number(e.target.value.replace(/\D/g, '')))
                  }
                  backgroundColor="blue"
                />
                <Input
                  name="name"
                  label={formatMessage(m.signeeName)}
                  value={name}
                  size="sm"
                  readOnly
                />
                <Input
                  name="nationalId"
                  label={formatMessage(m.signeeNationalId)}
                  value={nationalId}
                  size="sm"
                  readOnly
                />
              </Stack>
            </GridColumn>
          </GridRow>
          <Box display="flex" justifyContent="center" marginTop={7}>
            <Button
              colorScheme="default"
              onClick={() => updatePage()}
              loading={loading}
            >
              {formatMessage(m.saveEditPaperNumber)}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  )
}

export default EditPage
