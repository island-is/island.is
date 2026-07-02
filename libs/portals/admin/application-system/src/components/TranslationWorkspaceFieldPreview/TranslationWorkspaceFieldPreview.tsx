import { Box, GridRow, GridColumn } from '@island.is/island-ui/core'
import { Markdown } from '@island.is/shared/components'
import type {
  PreviewFormatMessage,
  ResolvePreviewString,
  ScreenIntrospection,
  ValidationMessageDescriptor,
} from '../../types/translationWorkspace'
import { HALF_WIDTH_IGNORED_TYPES } from '../../utils/translationWorkspaceFieldConstants'
import { resolveTranslatableStaticText } from '../../utils/translationWorkspaceStaticText'
import { filterPreviewMultiFieldChildren } from '../../utils/translationWorkspaceMultiFieldChildren'
import { focusedFieldHighlight } from '../TranslationWorkspacePreviewArea/TranslationWorkspacePreviewArea.css'
import type { PreviewFieldComponent } from '../../utils/previewFieldRegistry'
import type { Application } from '@island.is/application/types'
import { LeafFieldPreview } from './LeafFieldPreview'

export interface TranslationWorkspaceFieldPreviewProps {
  screen: ScreenIntrospection
  resolvePreviewString: ResolvePreviewString
  formatMessage: PreviewFormatMessage
  showValidationErrors?: boolean
  validationDescriptorsByPath?: Record<string, ValidationMessageDescriptor[]>
  focusedFieldId?: string | null
  fieldErrorOverrides?: Set<string>
  previewFieldValues?: Record<string, string>
  previewFields?: Record<string, PreviewFieldComponent>
  previewApplication: Application
}

/**
 * Renders a screen matching the real application form layout.
 * MULTI_FIELD screens use GridRow/GridColumn with width-based spans.
 */
export const TranslationWorkspaceFieldPreview = ({
  screen,
  resolvePreviewString,
  formatMessage,
  showValidationErrors,
  validationDescriptorsByPath,
  focusedFieldId,
  fieldErrorOverrides,
  previewFieldValues,
  previewFields,
  previewApplication,
}: TranslationWorkspaceFieldPreviewProps) => {
  if (screen.type === 'MULTI_FIELD') {
    const space = (screen.space ?? 0) as 0 | 1 | 2 | 3 | 4 | 5 | 6
    const previewChildren = filterPreviewMultiFieldChildren(screen.children)
    return (
      <Box key={screen.id}>
        {screen.description && (
          <Box marginBottom={3} component="div">
            <Markdown>
              {resolveTranslatableStaticText(
                screen.description,
                screen.messageDescriptors,
                resolvePreviewString,
              )}
            </Markdown>
          </Box>
        )}
        <Box width="full" marginTop={screen.description ? 3 : 4} />
        <GridRow>
          {previewChildren.map((child, index) => {
            const isHalfColumn =
              !HALF_WIDTH_IGNORED_TYPES.has(child.type) &&
              child.width === 'half'
            const span = isHalfColumn ? '1/2' : '1/1'
            const isLast = index === previewChildren.length - 1
            const childIsFocused =
              focusedFieldId != null && child.id === focusedFieldId
            return (
              <GridColumn
                key={child.id || index}
                span={['1/1', '1/1', '1/1', span]}
                paddingBottom={isLast ? 0 : space}
              >
                <Box
                  className={childIsFocused ? focusedFieldHighlight : undefined}
                >
                  <LeafFieldPreview
                    screen={child}
                    resolvePreviewString={resolvePreviewString}
                    formatMessage={formatMessage}
                    showValidationErrors={showValidationErrors}
                    validationDescriptorsByPath={validationDescriptorsByPath}
                    focusedFieldId={focusedFieldId}
                    fieldErrorOverrides={fieldErrorOverrides}
                    previewFieldValues={previewFieldValues}
                    previewFields={previewFields}
                    previewApplication={previewApplication}
                  />
                </Box>
              </GridColumn>
            )
          })}
        </GridRow>
      </Box>
    )
  }

  const isFocused = focusedFieldId != null && screen.id === focusedFieldId

  return (
    <Box className={isFocused ? focusedFieldHighlight : undefined}>
      <LeafFieldPreview
        screen={screen}
        resolvePreviewString={resolvePreviewString}
        formatMessage={formatMessage}
        showValidationErrors={showValidationErrors}
        validationDescriptorsByPath={validationDescriptorsByPath}
        focusedFieldId={focusedFieldId}
        fieldErrorOverrides={fieldErrorOverrides}
        previewFieldValues={previewFieldValues}
        previewFields={previewFields}
        previewApplication={previewApplication}
      />
    </Box>
  )
}
