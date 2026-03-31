import { FormSystemField } from '@island.is/api/schema'
import { Box, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../../lib/messages'

interface Props {
  item: FormSystemField
  valueIndex: number
}

export const NationalIdDisplay = ({ item, valueIndex }: Props) => {
  const { lang, formatMessage } = useLocale()

  const value = item.values?.[valueIndex]
  const nationalId = value?.json?.nationalId ?? undefined
  const name = value?.json?.name ?? undefined

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
        </Text>
        <Box marginLeft={2}>
          <>
            <Text fontWeight="medium" color="dark350" lineHeight="sm">
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
            <Text fontWeight="medium" color="dark350" lineHeight="sm">
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
          </>
        </Box>
      </Stack>
    </Box>
  )
}
