import { Box, Text } from '@island.is/island-ui/core'
import type { Application } from '@island.is/application/types'
import { FieldTypes } from '@island.is/application/types'
import { CustomFieldErrorBoundary } from '../CustomFieldErrorBoundary/CustomFieldErrorBoundary'
import { noop } from '../../utils/translationWorkspaceFieldConstants'
import { fieldPreviewLayoutProps } from '../../utils/translationWorkspaceStaticText'
import {
  buildPreviewFieldFromScreen,
  TRANSLATION_WORKSPACE_UI_FIELD_TYPES,
} from '../../utils/buildPreviewFieldFromScreen'
import type { PreviewFieldComponent } from '../../utils/previewFieldRegistry'
import type { ScreenIntrospection } from '../../types/translationWorkspace'
import {
  buildMockCustomField,
  inferTranslationWorkspaceShowFieldName,
} from './translationWorkspaceFieldPreviewUtils'

export type CustomFieldPreviewProps = {
  screen: ScreenIntrospection
  previewApplication: Application
  previewFields?: Record<string, PreviewFieldComponent>
  errorMessage?: string
}

export const shouldRenderCustomOrRegisteredField = (
  screen: ScreenIntrospection,
  previewFields?: Record<string, PreviewFieldComponent>,
): boolean => {
  if (screen.type === FieldTypes.CUSTOM && screen.component) {
    return true
  }
  const componentName = screen.component ?? ''
  const PreviewCtrl =
    componentName !== '' ? previewFields?.[componentName] : undefined
  return Boolean(
    PreviewCtrl &&
      screen.type !== FieldTypes.CUSTOM &&
      TRANSLATION_WORKSPACE_UI_FIELD_TYPES.has(screen.type) &&
      buildPreviewFieldFromScreen(screen),
  )
}

export const CustomFieldPreview = ({
  screen,
  previewApplication,
  previewFields,
  errorMessage,
}: CustomFieldPreviewProps) => {
  const layout = fieldPreviewLayoutProps(screen)
  const registry = previewFields ?? {}
  const componentName = screen.component ?? ''
  const PreviewCtrl = componentName !== '' ? registry[componentName] : undefined

  if (
    PreviewCtrl &&
    screen.type !== FieldTypes.CUSTOM &&
    TRANSLATION_WORKSPACE_UI_FIELD_TYPES.has(screen.type)
  ) {
    const builtField = buildPreviewFieldFromScreen(screen)
    if (builtField) {
      return (
        <Box {...layout}>
          <CustomFieldErrorBoundary componentName={componentName}>
            <PreviewCtrl
              application={previewApplication}
              field={builtField}
              error={errorMessage}
              errors={{}}
              showFieldName={inferTranslationWorkspaceShowFieldName(screen)}
              goToScreen={noop}
              refetch={noop}
            />
          </CustomFieldErrorBoundary>
        </Box>
      )
    }
  }

  if (screen.type === FieldTypes.CUSTOM && screen.component) {
    const CustomComponent = registry[screen.component]
    if (CustomComponent) {
      const mockField = buildMockCustomField(screen)
      return (
        <Box {...layout}>
          <CustomFieldErrorBoundary componentName={screen.component}>
            <CustomComponent
              application={previewApplication}
              field={mockField}
              error={undefined}
              errors={{}}
              goToScreen={noop}
              refetch={noop}
            />
          </CustomFieldErrorBoundary>
        </Box>
      )
    }
    return (
      <Box
        padding={2}
        border="standard"
        borderRadius="standard"
        background="blue100"
      >
        <Text variant="eyebrow" color="blue400">
          CUSTOM
        </Text>
        <Text variant="small">{screen.component}</Text>
      </Box>
    )
  }

  return null
}
