import { Box, Input } from '@island.is/island-ui/core'
import { FieldTypes } from '@island.is/application/types'
import { previewWorkspaceInputBackgroundColor } from '../../utils/translationWorkspaceFieldConstants'
import {
  fieldPreviewLayoutProps,
  resolvePreviewLabel,
  resolveTranslatableStaticText,
} from '../../utils/translationWorkspaceStaticText'
import type { FieldPreviewBaseProps } from './types'

export type InputFieldPreviewProps = FieldPreviewBaseProps & {
  previewValue?: string
  errorMessage?: string
}

export const InputFieldPreview = ({
  screen,
  resolvePreviewString,
  previewValue,
  errorMessage,
}: InputFieldPreviewProps) => {
  const layout = fieldPreviewLayoutProps(screen)
  const label = resolvePreviewLabel(screen, resolvePreviewString)
  const isTextarea =
    screen.type === FieldTypes.TEXT && screen.textFieldVariant === 'textarea'
  const placeholderResolved =
    screen.inputPlaceholder != null && screen.inputPlaceholder !== ''
      ? resolveTranslatableStaticText(
          screen.inputPlaceholder,
          screen.messageDescriptors,
          resolvePreviewString,
        ).trim()
      : ''

  return (
    <Box {...layout}>
      <Box paddingTop={2}>
        <Input
          label={label}
          name={screen.id}
          placeholder={placeholderResolved || undefined}
          readOnly
          value={previewValue ?? ''}
          hasError={!!errorMessage}
          errorMessage={errorMessage}
          backgroundColor={previewWorkspaceInputBackgroundColor(screen)}
          textarea={isTextarea}
          rows={
            isTextarea && screen.textFieldRows != null
              ? screen.textFieldRows
              : undefined
          }
        />
      </Box>
    </Box>
  )
}
