import type { Application } from '@island.is/application/types'
import type {
  PreviewFormatMessage,
  ResolvePreviewString,
  ScreenIntrospection,
  ValidationMessageDescriptor,
} from '../../types/translationWorkspace'
import type { PreviewFieldComponent } from '../../utils/previewFieldRegistry'

export type TranslationWorkspaceRepeaterNestedProps = {
  showValidationErrors?: boolean
  validationDescriptorsByPath?: Record<string, ValidationMessageDescriptor[]>
  focusedFieldId?: string | null
  fieldErrorOverrides?: Set<string>
  previewFieldValues?: Record<string, string>
  previewFields?: Record<string, PreviewFieldComponent>
  previewApplication: Application
}

export type FieldPreviewBaseProps = {
  screen: ScreenIntrospection
  resolvePreviewString: ResolvePreviewString
}

export type FieldPreviewWithFormatMessageProps = FieldPreviewBaseProps &
  TranslationWorkspaceRepeaterNestedProps & {
    formatMessage: PreviewFormatMessage
  }
