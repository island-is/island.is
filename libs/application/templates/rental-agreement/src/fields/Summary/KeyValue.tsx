import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { TextVariants } from 'libs/island-ui/core/src/lib/Text/Text.css'
import { MessageDescriptor } from 'react-intl'

type TextElements =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'p'
  | 'span'
  | 'div'
  | 'label'
  | 'caption'
  | 'pre'

type Props = {
  label: string | MessageDescriptor
  value?: string | MessageDescriptor
  isTotal?: boolean
  labelVariant?: TextVariants
  labelAs?: TextElements
  valueVariant?: TextVariants
  valueAs?: TextElements
}

export const KeyValue = ({
  label,
  value = '-',
  isTotal = false,
  labelVariant = 'medium',
  labelAs = 'label',
}: Props) => {
  const { formatMessage } = useLocale()

  return (
    <Box paddingY={1}>
      <Text variant={labelVariant} as={labelAs} fontWeight="semiBold">
        {formatMessage(label)}
      </Text>

      <Text
        variant="default"
        as="p"
        fontWeight={isTotal ? 'semiBold' : 'regular'}
      >
        {formatMessage(value)}
      </Text>
    </Box>
  )
}
