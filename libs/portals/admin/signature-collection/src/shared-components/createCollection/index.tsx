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
  Tag,
  Icon,
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
import {
  SignatureCollection,
  SignatureCollectionCollectionType,
} from '@island.is/api/schema'

const CreateCollection = ({
  collection,
}: {
  collection: SignatureCollection
}) => {
  const { id, collectionType } = collection

  const params = useParams() as {
    constituencyName?: string
    municipality?: string
  }

  // Get the right area name based on collection type
  const areaName =
    collectionType === SignatureCollectionCollectionType.Parliamentary
      ? params.constituencyName
      : params.municipality

  // Find the area by name if we have an area name
  const currentArea =
    collectionType === SignatureCollectionCollectionType.Parliamentary ||
    (collectionType === SignatureCollectionCollectionType.LocalGovernmental &&
      areaName)
      ? collection.areas.find((area) => area.name === areaName)
      : null

  const { formatMessage } = useLocale()
  const { revalidate } = useRevalidator()

  const { control } = useForm()

  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [nationalIdInput, setNationalIdInput] = useState('')
  const [nationalIdNotFound, setNationalIdNotFound] = useState(false)
  const [name, setName] = useState('')
  const [collectionName, setCollectionName] = useState('')
  const [canCreate, setCanCreate] = useState(true)
  const [canCreateErrorReason, setCanCreateErrorReason] = useState('')

  const [candidateLookup, { loading: loadingCandidate }] =
    useCandidateLookupLazyQuery()
  const [createCollection, { loading }] = useCreateCollectionMutation({
    variables: {
      input: {
        collectionType: collectionType,
        collectionId:
          collectionType === SignatureCollectionCollectionType.Presidential
            ? id
            : collectionType === SignatureCollectionCollectionType.Parliamentary
            ? collection?.id
            : currentArea?.collectionId || '',
        collectionName: collectionName || undefined,
        owner: {
          name: name,
          nationalId: nationalIdInput,
          phone: '',
          email: '',
        },
        areas: currentArea?.id ? [{ areaId: currentArea.id }] : [],
      },
    },
    onCompleted: () => {
      revalidate()
    },
  })

  const createNewCollection = async () => {
    try {
      const createCollectionRes = await createCollection()
      if (createCollectionRes.data?.signatureCollectionAdminCreate.success) {
        toast.success(formatMessage(m.createCollectionSuccess))
        setModalIsOpen(false)
      } else {
        toast.error(
          createCollectionRes.data?.signatureCollectionAdminCreate
            .reasons?.[0] || formatMessage(m.createCollectionError),
        )
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
      setCollectionName('')
      setNationalIdInput('')
      setNationalIdNotFound(false)
      setCanCreate(true)
    }
  }, [nationalIdInput, modalIsOpen, collectionType, candidateLookup])

  return (
    <Box>
      <GridRow>
        <GridColumn span={['12/12', '12/12', '12/12', '10/12']}>
          <Box display="flex">
            <Tag>
              <Box display="flex" justifyContent="center">
                <Icon icon="add" type="outline" color="blue600" />
              </Box>
            </Tag>
            <Box marginLeft={5}>
              <Text variant="h4">{formatMessage(m.createCollection)}</Text>
              <Text marginBottom={2}>
                {formatMessage(m.createCollectionDescription)}
              </Text>
              <Button
                variant="text"
                size="small"
                onClick={() => setModalIsOpen(true)}
              >
                {formatMessage(m.createCollection)}
              </Button>
            </Box>
          </Box>
        </GridColumn>
      </GridRow>
      <Modal
        id="createCollection"
        isVisible={modalIsOpen}
        title={formatMessage(m.createCollection)}
        onClose={() => {
          setModalIsOpen(false)
          setNationalIdInput('')
          setName('')
          setCollectionName('')
          setCanCreate(true)
        }}
        scrollType="inside"
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
                control={control as unknown as Control}
                backgroundColor="blue"
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
                label={formatMessage(m.name)}
                readOnly
                value={name}
              />
              {collectionType ===
                SignatureCollectionCollectionType.LocalGovernmental && (
                <Input
                  name="collectionName"
                  id="collectionName"
                  label={formatMessage(m.candidateName)}
                  backgroundColor="blue"
                  value={collectionName}
                  onChange={(v) => setCollectionName(v.target.value)}
                />
              )}
              {currentArea?.id && (
                <Input
                  name="candidateArea"
                  label={
                    collectionType ===
                    SignatureCollectionCollectionType.Parliamentary
                      ? formatMessage(m.signatureListsConstituencyTitle)
                      : formatMessage(m.municipality)
                  }
                  readOnly
                  value={areaName}
                />
              )}
            </Stack>
            {!canCreate && (
              <Box marginTop={3}>
                <AlertMessage type="error" message={canCreateErrorReason} />
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
