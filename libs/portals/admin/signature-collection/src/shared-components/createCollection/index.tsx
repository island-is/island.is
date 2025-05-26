import {
  Box,
  Text,
  Button,
  Stack,
  Input,
  AlertMessage,
  toast,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useEffect, useState } from 'react'
import { Modal } from '@island.is/react/components'
import { InputController } from '@island.is/shared/form-fields'
import { Control, useForm } from 'react-hook-form'
import { useCandidateLookupLazyQuery } from './candidateLookup.generated'
import { setReason } from './utils'
import { useCreateCollectionMutation } from './createCollection.generated'
import { m } from '../../lib/messages'
import { useParams, useRevalidator } from 'react-router-dom'
import { SignatureCollectionCollectionType } from '@island.is/api/schema'

const CreateCollection = ({
  collectionId,
  areaId,
  collectionType,
}: {
  collectionId: string
  collectionType: SignatureCollectionCollectionType
  areaId: string | undefined
}) => {
  const { formatMessage } = useLocale()
  const { control } = useForm()
  const { revalidate } = useRevalidator()
  const { constituencyName } = useParams() as {
    constituencyName: string | undefined
  }

  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [nationalIdInput, setNationalIdInput] = useState('')
  const [nationalIdNotFound, setNationalIdNotFound] = useState(false)
  const [name, setName] = useState('')
  const [canCreate, setCanCreate] = useState(true)
  const [canCreateErrorReason, setCanCreateErrorReason] = useState('')

  const [
    candidateLookup,
    { loading: loadingCandidate },
  ] = useCandidateLookupLazyQuery()
  const [createCollection, { loading }] = useCreateCollectionMutation({
    variables: {
      input: {
        collectionType,
        collectionId,
        owner: {
          name: name,
          nationalId: nationalIdInput,
          phone: '',
          email: '',
        },
        areas: areaId ? [{ areaId }] : null,
      },
    },
    onCompleted: () => {
      revalidate()
    },
  })

  const createNewCollection = async () => {
    try {
      const createCollectionRes = await createCollection()
      if (createCollectionRes.data?.signatureCollectionAdminCreate.slug) {
        toast.success(formatMessage(m.createCollectionSuccess))
        setModalIsOpen(false)
      } else {
        toast.error(formatMessage(m.createCollectionSuccess))
      }
    } catch (e) {
      toast.error(e.message)
    }
  }

  useEffect(() => {
    if (nationalIdInput.length === 10) {
      candidateLookup({
        variables: {
          input: {
            nationalId: nationalIdInput,
            collectionType: collectionType,
          },
        },
      }).then((res) => {
        if (res.data?.signatureCollectionAdminCandidateLookup?.name) {
          const {
            name,
            canCreate,
            canCreateInfo,
          } = res.data.signatureCollectionAdminCandidateLookup

          setName(name)
          setCanCreate(canCreate)
          setCanCreateErrorReason(
            setReason(String(canCreateInfo)).defaultMessage,
          )
        } else {
          setName('')
          setNationalIdNotFound(true)
        }
      })
    } else {
      setName('')
      setNationalIdInput('')
      setNationalIdNotFound(false)
      setCanCreate(true)
    }
  }, [nationalIdInput, modalIsOpen])

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="flexEnd"
        alignItems="flexEnd"
        style={{ minWidth: '150px' }}
      >
        <Button
          variant="utility"
          size="small"
          nowrap
          icon="add"
          onClick={() => {
            setModalIsOpen(true)
          }}
        >
          {formatMessage(m.createCollection)}
        </Button>
      </Box>
      <Modal
        id="createCollection"
        isVisible={modalIsOpen}
        title={formatMessage(m.createCollection)}
        onClose={() => {
          setModalIsOpen(false)
          setNationalIdInput('')
          setName('')
          setCanCreate(true)
        }}
        hideOnClickOutside={false}
        closeButtonLabel={''}
        label={''}
      >
        <Text marginBottom={5}>
          {formatMessage(m.createCollectionModalDescription)}
        </Text>
        <GridRow>
          <GridColumn span="10/12" offset="1/12">
            <Stack space={3}>
              <InputController
                control={(control as unknown) as Control}
                type="tel"
                id="candidateNationalId"
                label={formatMessage(m.candidateNationalId)}
                format="######-####"
                defaultValue={nationalIdInput}
                onChange={(v) =>
                  setNationalIdInput(v.target.value.replace(/\W/g, ''))
                }
                loading={loadingCandidate}
                error={
                  nationalIdNotFound
                    ? formatMessage(m.candidateNationalIdNotFound)
                    : undefined
                }
              />
              <Input
                name="candidateName"
                label={formatMessage(m.candidateName)}
                readOnly
                value={name}
              />
              {areaId && (
                <Input
                  name="candidateArea"
                  label={formatMessage(m.signatureListsConstituencyTitle)}
                  readOnly
                  value={constituencyName}
                />
              )}
            </Stack>
            {!canCreate && (
              <Box marginTop={3}>
                <AlertMessage
                  type="error"
                  title={''}
                  message={canCreateErrorReason}
                />
              </Box>
            )}
            <Box display="flex" justifyContent="center" marginY={5}>
              <Button
                onClick={() => {
                  createNewCollection()
                }}
                disabled={!canCreate || !name}
                loading={loading}
              >
                {formatMessage(m.createCollection)}
              </Button>
            </Box>
          </GridColumn>
        </GridRow>
      </Modal>
    </Box>
  )
}

export default CreateCollection
