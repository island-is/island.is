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
import { useLocale, useNamespaces } from '@island.is/localization'
import { useIdentityQuery } from '@island.is/portals/my-pages/graphql'
import * as nationalId from 'kennitala'
import { useEffect, useState } from 'react'
import { InputController } from '@island.is/shared/form-fields'
import { useForm } from 'react-hook-form'
import { useMutation } from '@apollo/client'
import { toast } from 'react-toastify'
import { useGetCanSign } from '../../../../hooks'
import { uploadPaperSignature } from '../../../../hooks/graphql/mutations'
import { m } from '../../../../lib/messages'
import { SignatureCollectionCollectionType } from '@island.is/api/schema'

export const PaperSignees = ({
  listId,
  refetchSignees,
  collectionType,
}: {
  listId: string
  refetchSignees: () => void
  collectionType: SignatureCollectionCollectionType
}) => {
  useNamespaces('sp.signatureCollection')
  const { formatMessage } = useLocale()
  const { control, reset } = useForm()

  const [nationalIdInput, setNationalIdInput] = useState('')
  const [nationalIdTypo, setNationalIdTypo] = useState(false)
  const [page, setPage] = useState('')
  const [name, setName] = useState('')

  /* identity & canSign fetching logic */
  const { data, loading } = useIdentityQuery({
    variables: { input: { nationalId: nationalIdInput } },
    skip: nationalIdInput.length !== 10 || !nationalId.isValid(nationalIdInput),
    onCompleted: (data) => setName(data.identity?.name || ''),
  })
  const { canSign, loadingCanSign } = useGetCanSign(
    collectionType,
    nationalIdInput,
    listId,
    nationalId.isValid(nationalIdInput),
  )

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

  /* upload paper signature logic */
  const [upload, { loading: uploadingPaperSignature }] = useMutation(
    uploadPaperSignature,
    {
      variables: {
        input: {
          listId: listId,
          nationalId: nationalIdInput,
          pageNumber: Number(page),
        },
      },
      onCompleted: (res) => {
        if (res.signatureCollectionUploadPaperSignature?.success) {
          toast.success(formatMessage(m.paperSigneeSuccess))
          refetchSignees()
        } else {
          toast.error(formatMessage(m.paperSigneeError))
        }
      },
      onError: () => {
        toast.error(formatMessage(m.paperSigneeError))
      },
    },
  )

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
        background="blue100"
        height="full"
        padding={3}
        border="standard"
        borderRadius="standard"
      >
        <GridContainer>
          <GridRow marginBottom={3}>
            <GridColumn span={['12/12', '8/12']}>
              <InputController
                control={control}
                id="nationalId"
                name="nationalId"
                label={formatMessage(m.signeeNationalId)}
                format="######-####"
                required
                defaultValue={nationalIdInput}
                onChange={(e) => {
                  setNationalIdInput(e.target.value.replace(/\W/g, ''))
                }}
                error={nationalIdTypo ? ' ' : undefined}
                loading={loading || loadingCanSign}
                icon={name && canSign ? 'checkmark' : undefined}
              />
            </GridColumn>
            <GridColumn span={['12/12', '4/12']}>
              <Box marginTop={[3, 0]}>
                <Input
                  id="page"
                  name="page"
                  type="number"
                  required
                  label={formatMessage(m.paperNumber)}
                  value={page}
                  onChange={(e) => setPage(e.target.value)}
                />
              </Box>
            </GridColumn>
          </GridRow>
          <GridRow marginBottom={3}>
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
              disabled={!canSign || !page}
              onClick={() => upload()}
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
      {name && !loadingCanSign && !canSign && (
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
