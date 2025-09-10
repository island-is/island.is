import { FormSystemField } from '@island.is/api/schema'
import { Box, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { getValue } from '../../../lib/getValue'
import { m } from '../../../lib/messages'

interface Props {
  item: FormSystemField
}

export const NationalIdDisplay = ({ item }: Props) => {
  const nationalId = getValue(item, 'nationalId') as string | undefined
  const name = getValue(item, 'name') as string | undefined
  const { lang, formatMessage } = useLocale()

  return (
    <Box
      component="form"
      display="flex"
      flexDirection="column"
      justifyContent="spaceBetween"
      height="full"
    >
      <Stack space={1}>
        <Text as="p" fontWeight="semiBold">
          {item.name?.[lang]}
        </Text>
        {nationalId && (
          <Text>{`${formatMessage(m.nationalId)}: ${nationalId}`}</Text>
        )}
        {name && <Text>{`${formatMessage(m.individualName)}: ${name}`}</Text>}
      </Stack>
    </Box>
  )
}
