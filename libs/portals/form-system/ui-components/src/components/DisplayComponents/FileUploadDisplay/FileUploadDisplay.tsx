import { FormSystemField } from '@island.is/api/schema'
import { Box, Text, Icon } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

interface Props {
  item: FormSystemField
}

export const FileUploadDisplay = ({ item }: Props) => {
  const { lang } = useLocale()

  const s3Keys = (item.values?.[0]?.json?.s3Key ?? []).filter(
    (k): k is string => typeof k === 'string',
  )

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
      <Box marginLeft={2}>
        {s3Keys.map((k) => (
          <Box key={k} display="flex" alignItems="center">
            <Box marginRight={1} display="flex">
              <Icon
                icon="document"
                type="outline"
                size="small"
                color="dark300"
                ariaHidden
              />
            </Box>
            <Text as="p" fontWeight="light">
              {displayNameFromS3Key(k)}
            </Text>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

const displayNameFromS3Key = (key: string): string => {
  // 1) turn s3 key into human filename
  const lastPart = key.split('/').pop() ?? key
  const underscoreIndex = lastPart.indexOf('_')
  const fileName =
    underscoreIndex >= 0 ? lastPart.slice(underscoreIndex + 1) : lastPart

  // 2) truncate middle if long
  const maxLength = 40
  if (fileName.length <= maxLength) return fileName

  const ellipsis = '...'
  const keepLength = maxLength - ellipsis.length
  const start = Math.ceil(keepLength / 2)
  const end = fileName.length - Math.floor(keepLength / 2)

  return `${fileName.slice(0, start)}${ellipsis}${fileName.slice(end)}`
}
