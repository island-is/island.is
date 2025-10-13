import { FormSystemField } from '@island.is/api/schema'
import { Box, Text } from '@island.is/island-ui/core'

interface Props {
  item: FormSystemField
  lang?: 'is' | 'en'
}

export const FileUploadDisplay = ({ item, lang = 'is' }: Props) => {
  const s3Key = (item?.values?.[0]?.json as Record<string, unknown>)?.['s3Key']
  const s3Url = (item?.values?.[0]?.json as Record<string, unknown>)?.['s3Url']

  return (
    <Box
      component="form"
      display="flex"
      flexDirection="column"
      justifyContent="spaceBetween"
      height="full"
    >
      <Text as="p" fontWeight="semiBold">
        {item.name?.[lang]}
      </Text>
      <Text as="p">{String(s3Url)}</Text>
      <Text as="p">{String(s3Key)}</Text>
    </Box>
  )
}
