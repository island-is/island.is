import { FC } from 'react'
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
import { m } from '../../lib/messages'
import { IdentityDocument, UserPassport } from '../../lib/constants'

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
  const identityDocument = (application.externalData.identityDocument
    .data as UserPassport).userPassport
  const children = (application.externalData.identityDocument.data as any)
    .childPassports
  const identityDocumentNumber = identityDocument?.number

  const tag = (identityDocument: IdentityDocument) => {
    const today = new Date()
    const expirationDate = new Date(identityDocument?.expirationDate)
    const todayPlus6Months = new Date(
      new Date().setMonth(new Date().getMonth() + 6),
    )

    if (!identityDocument) {
      return {
        label: formatMessage(m.noPassport),
        variant: 'blue',
        outlined: true,
      }
    } else if (today > expirationDate) {
      return {
        label: formatMessage(m.expiredTag),
        variant: 'red',
        outlined: true,
      }
    } else if (todayPlus6Months > expirationDate) {
      return {
        label:
          formatMessage(m.validTag) +
          ' ' +
          (identityDocument
            ? format(new Date(expirationDate), 'dd/MM/yy')
            : ''),
        variant: 'red',
        outlined: true,
      }
    } else if (todayPlus6Months < expirationDate) {
      return {
        label: formatMessage(m.validTag) + ' ' + expirationDate.getFullYear(),
        variant: 'mint',
        outlined: true,
      }
    }
  }

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
              subLabel: identityDocument
                ? formatMessage(m.passportNumber) +
                  ' ' +
                  identityDocument?.subType +
                  identityDocumentNumber
                : '',
              tag: tag(identityDocument) as any,
              disabled:
                (tag(identityDocument) as any).label === 'Í pöntun' ||
                (tag(identityDocument) as any).variant === 'mint',
            },
          ],
          onSelect: () => {
            setValue(childPassportRadio, '')
          },
        }}
      />
      <Text variant="h3" marginTop={2}>
        {formatMessage(m.children)}
      </Text>
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
          options: children.map((child: any) => {
            return {
              label: child.name,
              value: child.nationalId,
              subLabel: child.identityDocuments.length
                ? formatMessage(m.passportNumber) +
                  ' ' +
                  (child.identityDocuments as any)[0].subType +
                  (child.identityDocuments as any)[0].number
                : '',
              tag: tag((child.identityDocuments as any)[0]),
              disabled:
                tag((child.identityDocuments as any)[0])?.label ===
                  'Í pöntun' ||
                tag((child.identityDocuments as any)[0])?.variant === 'mint',
            }
          }),
          onSelect: () => {
            setValue(userPassportRadio, '')
          },
        }}
      />
    </Box>
  )
}
