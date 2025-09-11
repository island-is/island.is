import {
  Box,
  Text,
  Button,
  GridRow,
  GridColumn,
  GridContainer,
  AlertMessage,
  Input,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import * as nationalId from 'kennitala'
import { useEffect, useState } from 'react'
import { InputController } from '@island.is/shared/form-fields'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import {
  useSignatureCollectionAdminCanSignInfoQuery,
  useIdentityQuery,
} from './identityAndCanSignLookup.generated'
import { useSignatureCollectionAdminUploadPaperSignatureMutation } from './uploadPaperSignee.generated'
import { useRevalidator } from 'react-router-dom'
import { m } from '../../lib/messages'
import { SignatureCollectionCollectionType } from '@island.is/api/schema'

export const PaperSignees = ({
  listId,
  collectionType,
}: {
  listId: string
  collectionType: SignatureCollectionCollectionType
}) => {
  const { formatMessage } = useLocale()
  const { revalidate } = useRevalidator()
  const { control, reset } = useForm()

  const [nationalIdInput, setNationalIdInput] = useState('')
  const [nationalIdTypo, setNationalIdTypo] = useState(false)
  const [page, setPage] = useState('')
  const [name, setName] = useState('')

  const { data, loading } = useIdentityQuery({
    variables: { input: { nationalId: nationalIdInput } },
    skip: nationalIdInput.length !== 10 || !nationalId.isValid(nationalIdInput),
    onCompleted: (data) => setName(data.identity?.name || ''),
  })

  const { data: canSign, loading: loadingCanSign } =
    useSignatureCollectionAdminCanSignInfoQuery({
      variables: {
        input: {
          signeeNationalId: nationalIdInput,
          listId,
          collectionType,
        },
      },
      skip: !nationalId.isValid(nationalIdInput) || !name,
    })

  useEffect(() => {
    if (nationalIdInput.length === 10) {
      setNationalIdTypo(
        !nationalId.isValid(nationalIdInput) ||
          (!loading && !data?.identity?.name),
      )
    } else {
      setName('')
      setNationalIdTypo(false)
    }
  }, [nationalIdInput, loading, data])

  const [uploadPaperSignee, { loading: uploadingPaperSignature }] =
    useSignatureCollectionAdminUploadPaperSignatureMutation({
      variables: {
        input: {
          listId: listId,
          nationalId: nationalIdInput,
          pageNumber: Number(page),
          collectionType,
        },
      },
      onCompleted: (res) => {
        if (res.signatureCollectionAdminUploadPaperSignature?.success) {
          toast.success(formatMessage(m.paperSigneeSuccess))
        } else {
          const message =
            res.signatureCollectionAdminUploadPaperSignature?.reasons?.[0] ??
            formatMessage(m.paperSigneeError)
          toast.error(message)
        }
        revalidate()
        onClearForm()
      },
      onError: () => {
        toast.error(formatMessage(m.paperSigneeError))
      },
    })

  const onClearForm = () => {
    reset() // resets nationalId field
    setNationalIdTypo(false)
    setName('')
  }

  return (
    <Box marginTop={8}>
      <Box display="flex" justifyContent="spaceBetween">
        <Text variant="h4" marginBottom={2}>
          {formatMessage(m.paperSigneesHeader)}
        </Text>
        <Box>
          <Button
            variant="text"
            size="small"
            icon="reload"
            onClick={() => onClearForm()}
          >
            {formatMessage(m.paperSigneesClearButton)}
          </Button>
        </Box>
      </Box>

      <Box
        background="white"
        height="full"
        padding={4}
        border="standard"
        borderRadius="large"
      >
        <GridContainer>
          <GridRow marginBottom={2}>
            <GridColumn span={['7/12', '8/12']}>
              <InputController
                control={control}
                id="nationalId"
                name="nationalId"
                label={formatMessage(m.signeeNationalId)}
                format="######-####"
                required
                defaultValue={nationalIdInput}
                backgroundColor="blue"
                onChange={(e) => {
                  setNationalIdInput(e.target.value.replace(/\W/g, ''))
                }}
                error={nationalIdTypo ? ' ' : undefined}
                loading={loading || loadingCanSign}
                placeholder="Sláið inn"
                icon={
                  name && canSign?.signatureCollectionAdminCanSignInfo?.success
                    ? 'checkmark'
                    : undefined
                }
              />
            </GridColumn>
            <GridColumn span={['5/12', '4/12']}>
              <Input
                id="page"
                name="page"
                type="number"
                required
                label={formatMessage(m.paperNumber)}
                value={page}
                placeholder="Sláið inn"
                backgroundColor="blue"
                onChange={(e) => setPage(e.target.value)}
              />
            </GridColumn>
          </GridRow>
          <GridRow marginBottom={2}>
            <GridColumn span="12/12">
              <Input
                id="name"
                name="name"
                label={formatMessage(m.paperSigneeName)}
                backgroundColor="white"
                value={!loadingCanSign ? name : ''}
                readOnly
              />
            </GridColumn>
          </GridRow>
          <Box display="flex" justifyContent="flexEnd">
            <Button
              variant="ghost"
              size="small"
              disabled={
                !canSign?.signatureCollectionAdminCanSignInfo?.success || !page
              }
              onClick={() => uploadPaperSignee()}
              loading={uploadingPaperSignature}
            >
              {formatMessage(m.signPaperSigneeButton)}
            </Button>
          </Box>
        </GridContainer>
      </Box>
      {nationalIdTypo && (
        <Box marginTop={5}>
          <AlertMessage
            type="error"
            title={formatMessage(m.paperSigneeTypoTitle)}
            message={formatMessage(m.paperSigneeTypoMessage)}
          />
        </Box>
      )}
      {name &&
        !loadingCanSign &&
        !canSign?.signatureCollectionAdminCanSignInfo?.success && (
          <Box marginTop={5}>
            <AlertMessage
              type="error"
              title={formatMessage(m.paperSigneeCantSignTitle)}
              message={formatMessage(m.paperSigneeCantSignMessage)}
            />
          </Box>
        )}
    </Box>
  )
}
