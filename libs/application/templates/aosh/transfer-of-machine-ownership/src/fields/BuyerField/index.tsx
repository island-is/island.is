import { getErrorViaPath, getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, Text, GridColumn, GridRow } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useState, useCallback, useEffect } from 'react'
import { information } from '../../lib/messages'
import { UserInformation } from '../../shared'
import { useMutation } from '@apollo/client'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import { InputController } from '@island.is/shared/form-fields'
import { NationalIdWithName } from '../NationalIdWithName'

const emailRegex =
  /^[\w!#$%&'*+/=?`{|}~^-]+(?:\.[\w!#$%&'*+/=?`{|}~^-]+)*@(?:[A-Z0-9-]+\.)+[A-Z]{2,6}$/i

export const BuyerField: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { locale, formatMessage } = useLocale()

  const { application, errors } = props

  const [updateApplication] = useMutation(UPDATE_APPLICATION)

  const [buyer, setBuyer] = useState<UserInformation>(
    getValueViaPath(application.answers, 'buyer', {
      name: '',
      nationalId: '',
      phone: '',
      email: '',
    }) as UserInformation,
  )

  const updateBuyer = useCallback(
    async (buyer: UserInformation) => {
      await updateApplication({
        variables: {
          input: {
            id: application.id,
            answers: {
              buyer: buyer,
            },
          },
          locale,
        },
      })
    },
    [application.id, locale, updateApplication],
  )

  useEffect(() => {
    if (
      buyer.name.length > 0 &&
      buyer.nationalId.length === 10 &&
      buyer.phone.length >= 7 &&
      emailRegex.test(buyer.email)
    ) {
      updateBuyer(buyer)
    }
  }, [buyer, updateBuyer])

  const id = 'buyer'
  const emailField = `${id}.email`
  const phoneField = `${id}.phone`

  return (
    <Box>
      <Box position="relative">
        <Box display="flex" flexDirection="row" justifyContent="spaceBetween">
          <Text variant="h5">
            {formatMessage(information.labels.buyer.title)}
          </Text>
        </Box>
        <NationalIdWithName
          {...props}
          customId={id}
          customNameLabel={formatMessage(information.labels.buyer.name)}
          customNationalIdLabel={formatMessage(
            information.labels.buyer.nationalId,
          )}
          onNameChange={(name: string) => {
            setBuyer({
              ...buyer,
              name,
            })
          }}
          onNationalIdChange={(nationalId: string) => {
            setBuyer({
              ...buyer,
              nationalId,
            })
          }}
        />
        <GridRow>
          <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
            <InputController
              id={emailField}
              name={emailField}
              type="email"
              label={formatMessage(information.labels.buyer.email)}
              error={errors && getErrorViaPath(errors, emailField)}
              backgroundColor="blue"
              required
              onChange={(event) => {
                setBuyer({
                  ...buyer,
                  email: event.target.value,
                })
              }}
              defaultValue={
                getValueViaPath(application.answers, emailField, '') as string
              }
            />
          </GridColumn>
          <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
            <InputController
              id={phoneField}
              name={phoneField}
              type="tel"
              format="###-####"
              label={formatMessage(information.labels.buyer.phone)}
              error={errors && getErrorViaPath(errors, phoneField)}
              backgroundColor="blue"
              required
              onChange={(event) => {
                setBuyer({
                  ...buyer,
                  phone: event.target.value,
                })
              }}
              defaultValue={
                getValueViaPath(application.answers, phoneField, '') as string
              }
            />
          </GridColumn>
        </GridRow>
      </Box>
    </Box>
  )
}
