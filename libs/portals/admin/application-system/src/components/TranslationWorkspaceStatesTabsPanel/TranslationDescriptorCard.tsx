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
import * as styles from './TranslationWorkspaceStatesTabsPanel.css'

export interface DescriptorCardTag {
  label: string
  variant: TagVariant
  outlined?: boolean
}

export interface TranslationDescriptorCardProps {
  descriptor: MessageDescriptor
  icelandicValue: string
  translationValue: string
  activeLocale: 'is' | 'en'
  onValueChange: (value: string) => void
  tags?: DescriptorCardTag[]
  subtitle?: string
  onGoogleTranslate?: () => void
  isTranslating?: boolean
  formatMessage: FormatMessage
}

export const TranslationDescriptorCard = ({
  descriptor,
  icelandicValue,
  translationValue,
  activeLocale,
  onValueChange,
  tags,
  subtitle,
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
      {tags && tags.length > 0 && (
        <Box
          display="flex"
          justifyContent="flexEnd"
          alignItems="center"
          columnGap={1}
          marginBottom={1}
        >
          {tags.map((tag, i) => (
            <Tag key={i} variant={tag.variant} outlined={tag.outlined}>
              {tag.label}
            </Tag>
          ))}
        </Box>
      )}

      {subtitle && (
        <Box marginBottom={1}>
          <Text variant="small" color="dark400">
            {subtitle}
          </Text>
        </Box>
      )}

      {descriptor.defaultMessage && (
        <Box marginBottom={2}>
          <Text variant="small" color="dark400">
            <Text as="span" variant="small" fontWeight="semiBold">
              {formatMessage(m.translationDefaultMessageLabel)}:
            </Text>{' '}
            {descriptor.defaultMessage}
          </Text>
        </Box>
      )}

      <Box
        marginBottom={2}
        className={styles.translationLocaleInputLabel}
        style={activeLocale !== 'is' ? { pointerEvents: 'none' } : undefined}
      >
        <Input
          name={`translation-${descriptor.id}-is`}
          label={formatMessage(m.translationReferenceLabelIcelandic)}
          size="sm"
          value={icelandicValue}
          onChange={(e) => onValueChange(e.target.value)}
          readOnly={activeLocale !== 'is'}
          textarea
        />
      </Box>

      <Box
        className={styles.translationLocaleInputLabel}
        style={activeLocale !== 'en' ? { pointerEvents: 'none' } : undefined}
      >
        <Input
          name={`translation-${descriptor.id}-en`}
          label={formatMessage(m.translationValueLabel)}
          size="sm"
          value={translationValue}
          onChange={(e) => onValueChange(e.target.value)}
          readOnly={activeLocale !== 'en'}
          textarea
        />
      </Box>

      {onGoogleTranslate && (
        <Box
          marginTop={1}
          className={
            activeLocale !== 'en' ? styles.translateActionDisabled : undefined
          }
        >
          <Button
            variant="text"
            type="button"
            size="small"
            icon="translate"
            onClick={onGoogleTranslate}
            disabled={activeLocale !== 'en' || isTranslating}
            loading={isTranslating}
          >
            {formatMessage(m.translationGoogleTranslate)}
          </Button>
        </Box>
      )}
    </Box>
  )
}
