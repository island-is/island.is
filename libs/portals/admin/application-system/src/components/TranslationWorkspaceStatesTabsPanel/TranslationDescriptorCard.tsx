import {
  Box,
  Button,
  Input,
  Tag,
  TagVariant,
  Text,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import type { MessageDescriptor } from '../../types/translationWorkspace'
import type { FormatMessage } from '@island.is/localization'
import { m } from '../../lib/messages'

export interface DescriptorCardTag {
  label: string
  variant: TagVariant
  outlined?: boolean
}

export interface TranslationDescriptorCardProps {
  descriptor: MessageDescriptor
  currentValue: string
  isDirty: boolean
  onValueChange: (value: string) => void
  tags?: DescriptorCardTag[]
  subtitle?: string
  referenceLabel?: string
  referenceValue?: string | null
  onGoogleTranslate?: () => void
  isTranslating?: boolean
  formatMessage: FormatMessage
}

export const TranslationDescriptorCard = ({
  descriptor,
  currentValue,
  isDirty,
  onValueChange,
  tags,
  subtitle,
  referenceLabel,
  referenceValue,
  onGoogleTranslate,
  isTranslating,
  formatMessage,
}: TranslationDescriptorCardProps) => {
  return (
    <Box
      marginBottom={3}
      padding={2}
      borderRadius="large"
      style={{ backgroundColor: theme.color.dark100, border: 'none' }}
    >
      <Box
        display="flex"
        justifyContent="flexEnd"
        alignItems="center"
        columnGap={1}
        marginBottom={1}
      >
        {tags?.map((tag, i) => (
          <Tag key={i} variant={tag.variant} outlined={tag.outlined}>
            {tag.label}
          </Tag>
        ))}
        {isDirty && (
          <Tag variant="blueberry" outlined>
            Unsaved
          </Tag>
        )}
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
          {referenceLabel ?? 'Default'}:{' '}
          {referenceValue ?? descriptor.defaultMessage ?? '—'}
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

      {onGoogleTranslate && (
        <Box marginTop={1}>
          <Button
            variant="text"
            type="button"
            size="small"
            icon="translate"
            onClick={onGoogleTranslate}
            disabled={isTranslating}
            loading={isTranslating}
          >
            {formatMessage(m.translationGoogleTranslate)}
          </Button>
        </Box>
      )}
    </Box>
  )
}
