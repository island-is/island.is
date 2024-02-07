import {
  Box,
  Text,
  Button,
  Stack,
  Input,
  AlertMessage,
  toast,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../../../lib/messages'
import { useEffect, useState } from 'react'
import { Modal } from '@island.is/react/components'
import { InputController } from '@island.is/shared/form-fields'
import { Control, useForm } from 'react-hook-form'
import { useCandidateLookupLazyQuery } from './candidateLookup.generated'
import { setReason } from './utils'
import { useCreateCollectionMutation } from './createCollection.generated'

const CompareLists = () => {
  const { formatMessage } = useLocale()
  const { control } = useForm()

  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [nationalIdInput, setNationalIdInput] = useState('')
  const [nationalIdNotFound, setNationalIdNotFound] = useState(false)
  const [name, setName] = useState('')
  const [canCreate, setCanCreate] = useState(true)
  const [canCreateErrorReason, setCanCreateErrorReason] = useState('')

  const [candidateLookup] = useCandidateLookupLazyQuery()
  const [createCollection, { loading }] = useCreateCollectionMutation({
    variables: {
      input: {
        owner: {
          name: name,
          nationalId: nationalIdInput,
          phone: '',
          email: '',
        },
      },
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
            id: nationalIdInput,
          },
        },
      }).then((res) => {
        if (res.data?.signatureCollectionAdminCandidateLookup?.name) {
          const { name, canCreate, canCreateInfo } =
            res.data.signatureCollectionAdminCandidateLookup

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
          variant="ghost"
          size="small"
          nowrap
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
        <Stack space={3}>
          <InputController
            control={control as unknown as Control}
            type="tel"
            id="candidateNationalId"
            label={formatMessage(m.candidateNationalId)}
            format="######-####"
            defaultValue={nationalIdInput}
            onChange={(v) =>
              setNationalIdInput(v.target.value.replace(/\W/g, ''))
            }
            loading={loading}
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
            disabled={!canCreate}
            loading={loading}
          >
            {formatMessage(m.createCollection)}
          </Button>
        </Box>
      </Modal>
    </Box>
  )
}

export default CompareLists
