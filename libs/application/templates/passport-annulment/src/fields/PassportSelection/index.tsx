import { FC } from 'react'
import { getErrorViaPath } from '@island.is/application/core'
import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
  TagVariant,
} from '@island.is/application/types'
import { RadioFormField } from '@island.is/application/ui-fields'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import format from 'date-fns/format'
import { useFormContext } from 'react-hook-form'
import { m } from '../../lib/messages'
import {
  IdentityDocument,
  IdentityDocumentChild,
  IdentityDocumentData,
} from '../../lib/constants'

export type Tag = {
  label: string
  variant?: TagVariant | undefined
  outlined?: boolean | undefined
}

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
  const identityDocumentData = application.externalData.identityDocument
    .data as IdentityDocumentData

  const tag = (identityDocument: IdentityDocument) => {
    const today = new Date()
    const expirationDate = new Date(identityDocument?.expirationDate)
    const todayPlus6Months = new Date(
      new Date().setMonth(new Date().getMonth() + 6),
    )

    let tagObject = {} as Tag

    if (!identityDocument) {
      tagObject = {
        label: formatMessage(m.noPassport),
        variant: 'blue',
        outlined: true,
      }
    } else if (today > expirationDate) {
      tagObject = {
        label: formatMessage(m.expiredTag),
        variant: 'red',
        outlined: true,
      }
    } else if (todayPlus6Months > expirationDate) {
      tagObject = {
        label:
          formatMessage(m.validTag) +
          ' ' +
          (identityDocument
            ? format(new Date(expirationDate), 'dd/MM/yy')
            : ''),
        variant: 'mint',
        outlined: true,
      }
    } else if (todayPlus6Months < expirationDate) {
      tagObject = {
        label: formatMessage(m.validTag) + ' ' + expirationDate.getFullYear(),
        variant: 'mint',
        outlined: true,
      }
    }

    return tagObject
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
              value:
                identityDocumentData.userPassport?.subType +
                identityDocumentData?.userPassport?.number +
                ',' +
                (application.externalData.nationalRegistry.data as any)
                  ?.fullName,
              subLabel: identityDocumentData.userPassport
                ? formatMessage(m.passportNumber) +
                  ' ' +
                  identityDocumentData.userPassport?.subType +
                  identityDocumentData?.userPassport?.number
                : '',
              tag: tag(identityDocumentData.userPassport),
              disabled:
                tag(identityDocumentData.userPassport).variant !== 'mint',
            },
          ],
          onSelect: (e) => {
            console.log(e.split(',')[0])
            console.log(e.split(',')[1])
            setValue('passportNumber', e.split(',')[0])
            setValue('passportName', e.split(',')[1])
            setValue(childPassportRadio, '')
          },
        }}
      />
      {identityDocumentData.childPassports.length > 0 && (
        <Text variant="h3" marginTop={2}>
          {formatMessage(m.children)}
        </Text>
      )}
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
          options: identityDocumentData.childPassports.map(
            (child: IdentityDocumentChild) => {
              const disabled = child.passports
                ? tag(child.passports?.[0]).variant !== 'mint'
                : true
              const passportNumber: string = child.passports?.length
                ? child.passports[0].subType + child.passports[0].number
                : '0'
              return {
                label: child.childName,
                value: passportNumber + ',' + child.childName,
                subLabel: child.passports?.length
                  ? formatMessage(m.passportNumber) + ' ' + passportNumber
                  : '',
                tag: child.passports ? tag(child.passports?.[0]) : undefined,
                disabled,
              }
            },
          ),
          onSelect: (e) => {
            console.log(e.split(','))
            setValue('passportNumber', e.split(',')[0])
            setValue('passportName', e.split(',')[1])
            setValue(userPassportRadio, '')
          },
        }}
      />
    </Box>
  )
}
