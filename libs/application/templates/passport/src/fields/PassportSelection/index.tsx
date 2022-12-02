import React, { FC } from 'react'
import { getErrorViaPath } from '@island.is/application/core'
import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
import { RadioFormField } from '@island.is/application/ui-fields'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import format from 'date-fns/format'
import { useFormContext } from 'react-hook-form'
import { IdentityDocument } from '../../lib/constants'
import { m } from '../../lib/messages'

export const PassportSelection: FC<FieldBaseProps> = ({
  field,
  application,
}) => {
  const { id } = field
  const { formatMessage } = useLocale()
  const { setValue, errors } = useFormContext()
  const userPassportRadio = `${id}.userPassport`
  const childPassportRadio = `${id}.childPassport`
  const fieldErros = getErrorViaPath(errors, userPassportRadio)
  const identityDocument = application.externalData.identityDocument
    .data as IdentityDocument
  const identityDocumentNumber = identityDocument?.number

  return (
    <Box>
      <RadioFormField
        error={fieldErros}
        application={application}
        field={{
          id: userPassportRadio,
          title: '',
          type: FieldTypes.RADIO,
          component: FieldComponents.RADIO,
          children: undefined,
          backgroundColor: 'white',
          defaultValue: '',
          options: [
            {
              label: (application.externalData.nationalRegistry.data as any)
                ?.fullName,
              value: '1',
              subLabel:
                formatMessage(m.passportNumber) + ' ' + identityDocumentNumber,
              tag: {
                variant: 'red',
                label:
                  formatMessage(m.validTag) +
                  ' ' +
                  format(
                    new Date(identityDocument?.expirationDate),
                    'dd/MM/yy',
                  ),
                outlined: true,
              },
            },
          ],
          onSelect: () => {
            setValue(childPassportRadio, '')
          },
        }}
      />
      <Text variant="h3">{formatMessage(m.children)}</Text>
      <RadioFormField
        error={fieldErros}
        application={application}
        field={{
          space: 'smallGutter',
          id: childPassportRadio,
          title: '',
          type: FieldTypes.RADIO,
          component: FieldComponents.RADIO,
          children: undefined,
          backgroundColor: 'white',
          defaultValue: '',
          options: [
            {
              label: 'Barn 1',
              subLabel:
                formatMessage(m.passportNumber) + ' ' + identityDocumentNumber,
              tag: {
                variant: 'red',
                outlined: true,
                label: formatMessage(m.expiredTag),
              },
              value: '1',
            },
            {
              label: 'Barn 2',
              value: '2',
              tag: {
                variant: 'blue',
                outlined: true,
                label: formatMessage(m.noPassport),
              },
            },
            {
              label: 'Barn 3',
              subLabel:
                formatMessage(m.passportNumber) + ' ' + identityDocumentNumber,
              value: '3',
              tag: {
                variant: 'blue',
                outlined: true,
                label: formatMessage(m.orderedTag),
              },
              disabled: true,
            },
            {
              label: 'Barn 4',
              subLabel:
                formatMessage(m.passportNumber) + ' ' + identityDocumentNumber,
              value: '4',
              tag: {
                variant: 'mint',
                outlined: true,
                label: formatMessage(m.validTag) + ' 2025',
              },
              disabled: true,
            },
          ],
          onSelect: () => {
            setValue(userPassportRadio, '')
          },
        }}
      />
    </Box>
  )
}
