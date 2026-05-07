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
        justifyContent="spaceBetween"
        alignItems="center"
        marginBottom={1}
      >
        <Box display="flex" alignItems="center" columnGap={1}>
          {onGoogleTranslate && (
            <Button
              variant="ghost"
              type="button"
              size="small"
              preTextIcon="swapHorizontal"
              preTextIconType="outline"
              onClick={onGoogleTranslate}
              disabled={isTranslating}
              loading={isTranslating}
            >
              {formatMessage(m.translationGoogleTranslate)}
            </Button>
          )}
        </Box>
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
    </Box>
  )
}
