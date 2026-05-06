import { Box, Input, Tag, TagVariant, Text } from '@island.is/island-ui/core'
import type { MessageDescriptor } from '../../types/translationWorkspace'

export interface DescriptorCardTag {
  label: string
  variant:
    | 'blue'
    | 'blueberry'
    | 'rose'
    | 'darkerBlue'
    | 'red'
    | 'white'
    | 'purple'
    | 'mint'
    | 'darkerMint'
  outlined?: boolean
}

export interface TranslationDescriptorCardProps {
  descriptor: MessageDescriptor
  currentValue: string
  isDirty: boolean
  onValueChange: (value: string) => void
  tags?: DescriptorCardTag[]
  subtitle?: string
}

export const TranslationDescriptorCard = ({
  descriptor,
  currentValue,
  isDirty,
  onValueChange,
  tags,
  subtitle,
}: TranslationDescriptorCardProps) => {
  return (
    <Box
      marginBottom={3}
      padding={2}
      borderRadius="standard"
      border={isDirty ? 'focus' : 'standard'}
    >
      <Box display="flex" justifyContent="spaceBetween" marginBottom={1}>
        <Text variant="eyebrow" color="dark300">
          {descriptor.id}
        </Text>
        <Box display="flex" columnGap={1}>
          {tags?.map((tag, i) => (
            <Tag
              key={i}
              variant={tag.variant as TagVariant}
              outlined={tag.outlined}
            >
              {tag.label}
            </Tag>
          ))}
          {isDirty && (
            <Tag variant="blueberry" outlined>
              Unsaved
            </Tag>
          )}
        </Box>
      </Box>

      {subtitle && (
        <Box marginBottom={1}>
          <Text variant="small" color="dark400">
            {subtitle}
          </Text>
        </Box>
      )}

      <Box marginBottom={1}>
        <Text variant="small" color="dark400">
          Default: {descriptor.defaultMessage ?? '—'}
        </Text>
      </Box>

      <Input
        name={`translation-${descriptor.id}`}
        size="sm"
        value={currentValue}
        onChange={(e) => onValueChange(e.target.value)}
        textarea={(descriptor.defaultMessage?.length ?? 0) > 80}
        rows={3}
      />
    </Box>
  )
}
