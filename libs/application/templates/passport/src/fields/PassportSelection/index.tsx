import React, { FC } from 'react'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { RadioFormField } from '@island.is/application/ui-fields'
import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
  getErrorViaPath,
} from '@island.is/application/core'
import { useFormContext } from 'react-hook-form'
import format from 'date-fns/format'

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

  /* TODO: replace all any with correct types when service is ready! */
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
                formatMessage(m.passportNumber) +
                (application.externalData.identityDocument.data as any)?.number,
              tag: {
                variant: 'red',
                label:
                  formatMessage(m.validTag) +
                  format(
                    new Date(
                      (application.externalData.identityDocument
                        .data as any)?.expirationDate,
                    ),
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
      <Text variant="h3">Börn</Text>
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
                formatMessage(m.passportNumber) +
                (application.externalData.identityDocument.data as any)?.number,
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
                formatMessage(m.passportNumber) +
                (application.externalData.identityDocument.data as any)?.number,
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
                formatMessage(m.passportNumber) +
                (application.externalData.identityDocument.data as any)?.number,
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
