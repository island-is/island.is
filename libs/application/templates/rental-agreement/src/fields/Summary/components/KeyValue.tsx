import { Box, ResponsiveSpace, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { MessageDescriptor } from 'react-intl'

type TextVariants =
  | 'default'
  | 'small'
  | 'medium'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'intro'
  | 'eyebrow'

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
  value: string | MessageDescriptor
  isTotal?: boolean
  labelVariant?: TextVariants
  labelAs?: TextElements
  valueVariant?: TextVariants
  valueAs?: TextElements
  gap?: ResponsiveSpace
}

export const KeyValue = ({
  label,
  value,
  isTotal = false,
  labelVariant = 'small',
  labelAs = 'label',
  gap = 1,
}: Props) => {
  const { formatMessage } = useLocale()

  return (
    <Box paddingY={'p2'}>
      <Text
        variant={labelVariant}
        as={labelAs}
        fontWeight="semiBold"
        marginBottom={gap}
      >
        {formatMessage(label)}
      </Text>

      <Text
        variant="medium"
        as="p"
        fontWeight={isTotal ? 'semiBold' : 'regular'}
      >
        {formatMessage(value)}
      </Text>
    </Box>
  )
}
