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

  console.log(application.externalData)

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
              subLabel:
                'Vegabréfsnúmer: ' +
                (application.externalData.identityDocument.data as any)
                  ?.number +
                ', í gildi til ' +
                format(
                  new Date(
                    (application.externalData.identityDocument
                      .data as any)?.expirationDate,
                  ),
                  'dd/MM/yy',
                ),
              value: '1',
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
                'Vegabréfsnúmer: ' +
                (application.externalData.identityDocument.data as any)
                  ?.number +
                ', útrunnið',
              value: '1',
            },
            {
              label: 'Barn 2',
              subLabel: 'Vegabréf ekki til',
              value: '2',
            },
            {
              label: 'Barn 3',
              subLabel:
                'Vegabréfsnúmer: ' +
                (application.externalData.identityDocument.data as any)
                  ?.number +
                ', í pöntun',
              value: '3',
              disabled: true,
            },
            {
              label: 'Barn 4',
              subLabel:
                'Vegabréfsnúmer: ' +
                (application.externalData.identityDocument.data as any)
                  ?.number +
                ', gildir til 2025',
              value: '4',
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
