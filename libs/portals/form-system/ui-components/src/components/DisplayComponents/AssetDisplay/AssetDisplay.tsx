import { FormSystemField } from '@island.is/api/schema'
import { Box, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../../lib/messages'
import { AssetTypes } from '@island.is/form-system/enums'

type DisplayField = {
  label: string
  value?: string
}

interface Props {
  item: FormSystemField
  valueIndex: number
  requiredMissing?: boolean
}

export const AssetDisplay = ({
  item,
  valueIndex,
  requiredMissing = false,
}: Props) => {
  const { lang, formatMessage } = useLocale()

  const assetType = item.fieldSettings?.assetType ?? false
  const value = item.values?.[valueIndex]

  const registrationNumber = value?.json?.registrationNumber ?? undefined
  const model = value?.json?.model ?? undefined
  const color = value?.json?.color ?? undefined
  const propertyNumber = value?.json?.propertyNumber ?? undefined
  const address = value?.json?.address ?? undefined
  const postalCode = value?.json?.postalCode ?? undefined
  const municipality = value?.json?.municipality ?? undefined

  let fields: DisplayField[] = []

  switch (assetType) {
    case AssetTypes.VEHICLE:
      fields = [
        {
          label: formatMessage(m.registrationNumber),
          value: registrationNumber,
        },
        {
          label: formatMessage(m.model),
          value: model,
        },
        {
          label: formatMessage(m.color),
          value: color?.[lang] ?? color?.['is'] ?? color?.['en'] ?? '',
        },
      ]
      break

    case AssetTypes.REAL_ESTATE:
      fields = [
        {
          label: formatMessage(m.propertyNumber),
          value: propertyNumber,
        },
        {
          label: formatMessage(m.address),
          value: address,
        },
        {
          label: formatMessage(m.postalCode),
          value: postalCode,
        },
        {
          label: formatMessage(m.city),
          value: municipality,
        },
      ]
      break

    default:
      fields = []
  }

  return (
    <Box
      component="form"
      display="flex"
      flexDirection="column"
      justifyContent="spaceBetween"
      height="full"
    >
      <Stack space={0}>
        <Text as="p" fontWeight="semiBold" lineHeight="sm">
          {item.name?.[lang]}
          {requiredMissing && (
            <>
              {' '}
              <Text as="span" fontWeight="medium" color="red600">
                *
              </Text>
            </>
          )}
        </Text>

        <Box marginLeft={2}>
          <Stack space={1}>
            {fields.map((field) => (
              <Text key={field.label} fontWeight="medium" lineHeight="sm">
                {`${field.label}:`}
                {'\u00A0\u00A0\u00A0'}
                {!field.value && requiredMissing && (
                  <Text
                    as="span"
                    fontWeight="light"
                    color="red600"
                    lineHeight="sm"
                  >
                    {formatMessage(m.missingValue)}
                  </Text>
                )}
                {field.value && (
                  <Text
                    as="span"
                    fontWeight="light"
                    color="dark400"
                    lineHeight="sm"
                  >
                    {field.value}
                  </Text>
                )}
              </Text>
            ))}
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}
