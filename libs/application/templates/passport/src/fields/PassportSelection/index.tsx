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
        variant: 'red',
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
              value: '1',
              subLabel: identityDocumentData.userPassport
                ? formatMessage(m.passportNumber) +
                  ' ' +
                  identityDocumentData.userPassport?.subType +
                  identityDocumentData?.userPassport?.number
                : '',
              tag: tag(identityDocumentData.userPassport),
              disabled:
                tag(identityDocumentData.userPassport).label ===
                  m.orderedTag.defaultMessage ||
                tag(identityDocumentData.userPassport).variant === 'mint',
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
          options: identityDocumentData.childPassports.map(
            (child: IdentityDocumentChild) => {
              return {
                label: child.name,
                value: child.nationalId,
                subLabel: child.identityDocuments?.length
                  ? formatMessage(m.passportNumber) +
                    ' ' +
                    child.identityDocuments[0].subType +
                    child.identityDocuments[0].number
                  : '',
                tag: child.identityDocuments
                  ? tag(child.identityDocuments?.[0])
                  : undefined,
                disabled: child.identityDocuments
                  ? tag(child.identityDocuments?.[0]).label ===
                      m.orderedTag.defaultMessage ||
                    tag(child.identityDocuments?.[0]).variant === 'mint'
                  : false,
              }
            },
          ),
          onSelect: () => {
            setValue(userPassportRadio, '')
          },
        }}
      />
    </Box>
  )
}
