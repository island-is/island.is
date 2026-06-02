import { FormSystemField } from '@island.is/api/schema'
import { Box, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../../lib/messages'

interface Props {
  item: FormSystemField
  valueIndex: number
  requiredMissing?: boolean
}

export const NationalIdDisplay = ({
  item,
  valueIndex,
  requiredMissing = false,
}: Props) => {
  const { lang, formatMessage } = useLocale()

  const value = item.values?.[valueIndex]
  const nationalId = value?.json?.nationalId ?? undefined
  const name = value?.json?.name ?? undefined
  const showAddress = item.fieldSettings?.showAddress ?? false
  const address = value?.json?.address ?? undefined
  const postalCode = value?.json?.postalCode ?? undefined
  const municipality = value?.json?.municipality ?? undefined

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
              <Text as="span" fontWeight="semiBold" color="red600">
                *
              </Text>
            </>
          )}
        </Text>
        <Box marginLeft={2}>
          <Stack space={1}>
            <Text fontWeight="medium" lineHeight="sm">
              {`${formatMessage(m.nationalId)}:`}
              {'\u00A0\u00A0\u00A0'}
              {nationalId && (
                <Text
                  as="span"
                  fontWeight="light"
                  color="dark400"
                  lineHeight="sm"
                >
                  {nationalId}
                </Text>
              )}
            </Text>
            <Text fontWeight="medium" lineHeight="sm">
              {`${formatMessage(m.individualName)}:`}
              {'\u00A0\u00A0\u00A0'}
              {name && (
                <Text
                  as="span"
                  fontWeight="light"
                  color="dark400"
                  lineHeight="sm"
                >
                  {name}
                </Text>
              )}
            </Text>
            {showAddress && (
              <Text fontWeight="medium" lineHeight="sm">
                {`${formatMessage(m.address)}:`}
                {'\u00A0\u00A0\u00A0'}
                {address && (
                  <Text
                    as="span"
                    fontWeight="light"
                    color="dark400"
                    lineHeight="sm"
                  >
                    {address}
                  </Text>
                )}
              </Text>
            )}
            {showAddress && (
              <Text fontWeight="medium" lineHeight="sm">
                {`${formatMessage(m.postalCode)}:`}
                {'\u00A0\u00A0\u00A0'}
                {postalCode && (
                  <Text
                    as="span"
                    fontWeight="light"
                    color="dark400"
                    lineHeight="sm"
                  >
                    {postalCode}
                  </Text>
                )}
              </Text>
            )}
            {showAddress && (
              <Text fontWeight="medium" lineHeight="sm">
                {`${formatMessage(m.city)}:`}
                {'\u00A0\u00A0\u00A0'}
                {municipality && (
                  <Text
                    as="span"
                    fontWeight="light"
                    color="dark400"
                    lineHeight="sm"
                  >
                    {municipality}
                  </Text>
                )}
              </Text>
            )}
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}
