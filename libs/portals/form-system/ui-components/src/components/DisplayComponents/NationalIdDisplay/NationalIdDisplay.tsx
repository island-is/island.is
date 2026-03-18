import { FormSystemField } from '@island.is/api/schema'
import { Box, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../../lib/messages'

interface Props {
  item: FormSystemField
}

export const NationalIdDisplay = ({ item }: Props) => {
  const { lang, formatMessage } = useLocale()

  const values = (item.values ?? []).filter((v): v is NonNullable<typeof v> =>
    Boolean(v),
  )
  const showIndex = values.length > 1

  return (
    <Box
      component="form"
      display="flex"
      flexDirection="column"
      justifyContent="spaceBetween"
      height="full"
    >
      <Stack space={0}>
        <Text as="p" fontWeight="semiBold">
          {item.name?.[lang]}
        </Text>
        {values.map((valueDto, index) => {
          const nationalId = valueDto.json?.nationalId ?? undefined
          const name = valueDto.json?.name ?? undefined

          return (
            <Box key={`${valueDto.id ?? item.id}-${index}`} marginLeft={2}>
              {showIndex && (
                <>
                  <Text fontWeight="medium">{`${index + 1}:`}</Text>
                  <Text fontWeight="medium" color="dark350">
                    {`${formatMessage(m.nationalId)}:`}
                    {'\u00A0\u00A0\u00A0'}
                    {nationalId && (
                      <Text as="span" fontWeight="light" color="dark400">
                        {nationalId}
                      </Text>
                    )}
                  </Text>
                  <Text fontWeight="medium" color="dark350">
                    {`${formatMessage(m.individualName)}:`}
                    {'\u00A0\u00A0\u00A0'}
                    {name && (
                      <Text as="span" fontWeight="light" color="dark400">
                        {name}
                      </Text>
                    )}
                  </Text>
                </>
              )}
              {!showIndex && (
                <>
                  <Text fontWeight="medium" color="dark350">
                    {`${formatMessage(m.nationalId)}:`}
                    {'\u00A0\u00A0\u00A0'}
                    {nationalId && (
                      <Text as="span" fontWeight="light" color="dark400">
                        {nationalId}
                      </Text>
                    )}
                  </Text>
                  <Text fontWeight="medium" color="dark350">
                    {`${formatMessage(m.individualName)}:`}
                    {'\u00A0\u00A0\u00A0'}
                    {name && (
                      <Text as="span" fontWeight="light" color="dark400">
                        {name}
                      </Text>
                    )}
                  </Text>
                </>
              )}
            </Box>
          )
        })}
      </Stack>
    </Box>
  )
}
