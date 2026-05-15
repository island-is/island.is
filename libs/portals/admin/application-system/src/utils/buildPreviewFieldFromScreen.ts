import type {
  Field,
  FieldWidth,
  FormText,
  Option,
  SubmitField,
  TitleVariants,
  CallToAction,
} from '@island.is/application/types'
import {
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
import type {
  RadioOptionIntrospection,
  ScreenIntrospection,
} from '../types/translationWorkspace'
import { previewWorkspaceInputBackgroundColor } from './translationWorkspaceFieldConstants'
import { fieldPreviewLayoutProps } from './translationWorkspaceStaticText'

const asFieldWidth = (w: string | null | undefined): FieldWidth | undefined => {
  if (w === 'half' || w === 'full') {
    return w
  }
  return undefined
}

const optionFromIntrospection = (o: RadioOptionIntrospection): Option => {
  const label: FormText =
    o.labelMessageId != null
      ? {
          id: o.labelMessageId,
          defaultMessage: o.labelDefaultMessage ?? '',
        }
      : (o.labelDefaultMessage ?? o.value)
  return {
    value: o.value,
    label,
  }
}

/**
 * Tier-A preview: reconstruct enough of the template `Field` for `@island.is/application/ui-fields`.
 */
export const buildPreviewFieldFromScreen = (
  screen: ScreenIntrospection,
): Field | null => {
  const layout = fieldPreviewLayoutProps(screen)
  const width = asFieldWidth(screen.width)

  const base = {
    id: screen.id,
    component: (screen.component ?? '') as Field['component'],
    title: (screen.title ?? '') as FormText,
    description: (screen.description ?? '') as FormText,
    marginTop: layout.marginTop,
    marginBottom: layout.marginBottom,
    width,
    children: undefined,
  }

  switch (screen.type) {
    case FieldTypes.TITLE:
      return {
        ...base,
        type: FieldTypes.TITLE,
        component: FieldComponents.TITLE,
        titleVariant: (screen.titleVariant ?? 'h5') as TitleVariants,
      } as Field

    case FieldTypes.DESCRIPTION:
      return {
        ...base,
        type: FieldTypes.DESCRIPTION,
        component: FieldComponents.DESCRIPTION,
        description: (screen.description ?? '') as FormText,
        title: (screen.title ?? '') as FormText,
        space: layout.paddingTop,
        titleVariant: (screen.titleVariant ?? undefined) as
          | TitleVariants
          | undefined,
        showFieldName: Boolean(screen.title),
      } as Field

    case FieldTypes.DIVIDER:
      return {
        ...base,
        type: FieldTypes.DIVIDER,
        component: FieldComponents.DIVIDER,
        useDividerLine: true,
      } as Field

    case FieldTypes.ALERT_MESSAGE:
      return {
        ...base,
        type: FieldTypes.ALERT_MESSAGE,
        component: FieldComponents.ALERT_MESSAGE,
        alertType: screen.alertType as
          | 'default'
          | 'error'
          | 'info'
          | 'success'
          | 'warning'
          | undefined,
        message: (screen.alertMessage ?? '') as FormText,
        shouldBlockInSetBeforeSubmitCallback: false,
      } as Field

    case FieldTypes.TEXT:
      return {
        ...base,
        type: FieldTypes.TEXT,
        component: FieldComponents.TEXT,
        title: screen.title ?? undefined,
        backgroundColor: previewWorkspaceInputBackgroundColor(screen),
      } as Field

    case FieldTypes.PHONE:
      return {
        ...base,
        type: FieldTypes.PHONE,
        component: FieldComponents.PHONE,
        title: screen.title ?? undefined,
        backgroundColor: previewWorkspaceInputBackgroundColor(screen),
      } as Field

    case FieldTypes.DATE:
      return {
        ...base,
        type: FieldTypes.DATE,
        component: FieldComponents.DATE,
        title: screen.title ?? undefined,
        backgroundColor: previewWorkspaceInputBackgroundColor(screen),
      } as Field

    case FieldTypes.SUBMIT: {
      const actions =
        screen.submitActions?.map((a) => ({
          event: a.event,
          type: a.buttonType as CallToAction['type'],
          name: (a.labelMessageId
            ? {
                id: a.labelMessageId,
                defaultMessage: a.labelDefaultMessage ?? '',
              }
            : (a.labelDefaultMessage ?? a.event)) as FormText,
        })) ?? []
      const placement = (screen.submitPlacement ??
        'footer') as SubmitField['placement']
      return {
        ...base,
        type: FieldTypes.SUBMIT,
        component: FieldComponents.SUBMIT,
        placement,
        actions:
          actions.length > 0
            ? actions
            : [{ event: 'SUBMIT', type: 'primary', name: 'Submit' }],
        doesNotRequireAnswer: true,
        refetchApplicationAfterSubmit: false,
        renderLongErrors: false,
      } as SubmitField
    }

    case FieldTypes.RADIO: {
      const options = (screen.radioOptions ?? []).map(optionFromIntrospection)
      if (options.length === 0) {
        return null
      }
      return {
        ...base,
        type: FieldTypes.RADIO,
        component: FieldComponents.RADIO,
        options,
        largeButtons: screen.radioLargeButtons ?? undefined,
        backgroundColor:
          screen.radioBackgroundColor === 'white' ||
          screen.radioBackgroundColor === 'blue'
            ? screen.radioBackgroundColor
            : screen.radioLargeButtons !== false
              ? 'blue'
              : undefined,
        space: layout.paddingTop,
      } as Field
    }

    case FieldTypes.CHECKBOX: {
      const options = (screen.checkboxOptions ?? []).map(optionFromIntrospection)
      if (options.length === 0) {
        return null
      }
      return {
        ...base,
        type: FieldTypes.CHECKBOX,
        component: FieldComponents.CHECKBOX,
        options,
        large: screen.checkboxLarge ?? true,
        strong: screen.checkboxStrong ?? false,
        backgroundColor:
          screen.checkboxBackgroundColor === 'white' ||
          screen.checkboxBackgroundColor === 'blue'
            ? screen.checkboxBackgroundColor
            : 'blue',
        spacing:
          typeof screen.checkboxSpacing === 'number'
            ? (screen.checkboxSpacing as 0 | 1 | 2)
            : undefined,
      } as Field
    }

    default:
      return null
  }
};

export const TRANSLATION_WORKSPACE_UI_FIELD_TYPES: ReadonlySet<string> =
  new Set([
    FieldTypes.DESCRIPTION,
    FieldTypes.TITLE,
    FieldTypes.DIVIDER,
    FieldTypes.ALERT_MESSAGE,
    FieldTypes.TEXT,
    FieldTypes.PHONE,
    FieldTypes.CHECKBOX,
    FieldTypes.RADIO,
    FieldTypes.DATE,
    FieldTypes.SUBMIT,
  ])
