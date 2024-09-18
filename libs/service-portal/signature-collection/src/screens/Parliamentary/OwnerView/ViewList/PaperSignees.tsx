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
import { useIdentityQuery } from '@island.is/service-portal/graphql'
import * as nationalId from 'kennitala'
import { useEffect, useState } from 'react'
import { InputController } from '@island.is/shared/form-fields'
import { useForm } from 'react-hook-form'
import { m } from '../../../../lib/messages'

export const PaperSignees = () => {
  useNamespaces('sp.signatureCollection')
  const { formatMessage } = useLocale()
  const { control } = useForm()

  const [nationalIdInput, setNationalIdInput] = useState('')
  const [nationalIdTypo, setNationalIdTypo] = useState(false)
  const [name, setName] = useState('')

  const { data, loading } = useIdentityQuery({
    variables: {
      input: {
        nationalId: nationalIdInput,
      },
    },
    skip: nationalIdInput.length !== 10 || !nationalId.isValid(nationalIdInput),
  })

  useEffect(() => {
    if (nationalIdInput.length === 10) {
      if (
        !nationalId.isValid(nationalIdInput) ||
        (!loading && !data?.identity?.name)
      ) {
        setNationalIdTypo(true)
      } else if (!loading && data?.identity?.name) {
        setName(data.identity.name)
      }
    } else {
      setName('')
      setNationalIdInput('')
      setNationalIdTypo(false)
    }
  }, [nationalIdInput, loading, data])

  return (
    <Box marginTop={5}>
      <Text variant="h4" marginBottom={3}>
        {formatMessage(m.paperSigneesHeader)}
      </Text>

      <Box
        background={'blue100'}
        height="full"
        padding={3}
        border="standard"
        borderRadius="standard"
      >
        <GridContainer>
          <GridRow marginBottom={3}>
            <GridColumn span={['7/12', '8/12']}>
              <InputController
                control={control}
                id="nationalId"
                label={formatMessage(m.signeeNationalId)}
                name="nationalId"
                format="######-####"
                type="tel"
                defaultValue={nationalIdInput}
                onChange={(e) => {
                  setNationalIdInput(e.target.value.replace(/\W/g, ''))
                }}
                error={nationalIdTypo ? '' : undefined}
                loading={loading}
                icon={name !== '' ? 'checkmark' : undefined}
              />
            </GridColumn>
            <GridColumn span={['5/12', '4/12']}>
              <InputController
                control={control}
                id="page"
                name={''}
                label={formatMessage(m.paperNumber)}
              />
            </GridColumn>
          </GridRow>
          <GridRow marginBottom={3}>
            <GridColumn span={'12/12'}>
              <Input
                label={formatMessage(m.paperSigneeName)}
                backgroundColor="white"
                name="name"
                value={name}
                readOnly
              />
            </GridColumn>
          </GridRow>
          <Box display={'flex'} justifyContent={'flexEnd'}>
            <Button variant="ghost" size="small">
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
    </Box>
  )
}
