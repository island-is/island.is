import type {
  Field,
  FieldWidth,
  FormText,
  MessageWithLinkButtonField,
  Option,
  SubmitField,
  TitleVariants,
  CallToAction,
  LinkField,
} from '@island.is/application/types'
import { FieldComponents, FieldTypes } from '@island.is/application/types'
import type { ScreenIntrospectionNodeFieldsFragment } from '../queries/translations.generated'
import type {
  RadioOptionIntrospection,
  ScreenIntrospection,
} from '../types/translationWorkspace'
import { previewWorkspaceInputBackgroundColor } from './translationWorkspaceFieldConstants'
import {
  fieldPreviewLayoutProps,
  staticTextToFormText,
} from './translationWorkspaceStaticText'

/** Mirrors `ScreenIntrospectionGql` / fragment fields not yet on manual `ScreenIntrospection`. */
type MessageWithLinkIntrospectionSlice = Partial<
  Pick<
    ScreenIntrospectionNodeFieldsFragment,
    | 'messageWithLinkUrl'
    | 'messageWithLinkMessageStatic'
    | 'messageWithLinkMessageId'
    | 'messageWithLinkButtonTitleStatic'
    | 'messageWithLinkButtonTitleMessageId'
    | 'messageWithLinkMessageColor'
  >
>

/** Introspection node shape as used by the preview field builder (GraphQL-aligned). */
export type BuildPreviewFieldScreen = ScreenIntrospection &
  MessageWithLinkIntrospectionSlice

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
      : o.labelDefaultMessage ?? o.value
  return {
    value: o.value,
    label,
  }
}

/**
 * Tier-A preview: reconstruct enough of the template `Field` for `@island.is/application/ui-fields`.
 */
export const buildPreviewFieldFromScreen = (
  screen: BuildPreviewFieldScreen,
): Field | null => {
  const layout = fieldPreviewLayoutProps(screen)
  const width = asFieldWidth(screen.width)

  const defaultMsgForKey = (key: string | null | undefined) =>
    key
      ? screen.messageDescriptors.find((d) => d.id === key)?.defaultMessage ??
        ''
      : ''

  const resolveFormText = (staticText: string | null | undefined): FormText =>
    staticTextToFormText(staticText, screen.messageDescriptors)

  const base = {
    id: screen.id,
    component: (screen.component ?? '') as Field['component'],
    title: resolveFormText(screen.title),
    description: resolveFormText(screen.description),
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
        description: resolveFormText(screen.description),
        title: resolveFormText(screen.title),
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
        message: resolveFormText(screen.alertMessage),
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
            : a.labelDefaultMessage ?? a.event) as FormText,
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

    case FieldTypes.LINK: {
      const titleMsgId = screen.linkFieldTitleMessageId
      const titleFormText: FormText = titleMsgId
        ? {
            id: titleMsgId,
            defaultMessage: defaultMsgForKey(titleMsgId) ?? '',
          }
        : screen.title ?? ''
      const linkMsgId = screen.linkFieldLinkMessageId
      const linkFormText: FormText = linkMsgId
        ? {
            id: linkMsgId,
            defaultMessage: defaultMsgForKey(linkMsgId) ?? '',
          }
        : screen.linkFieldLinkText ?? ''
      const s3MsgId = screen.linkFieldS3KeyMessageId
      const s3FormText: FormText = s3MsgId
        ? {
            id: s3MsgId,
            defaultMessage: defaultMsgForKey(s3MsgId) ?? '',
          }
        : screen.linkFieldS3KeyText ?? ''

      const variant =
        screen.linkFieldVariant === 'text'
          ? ('text' as const)
          : ('ghost' as const)
      const justifyContent =
        screen.linkFieldJustifyContent === 'center'
          ? ('center' as const)
          : screen.linkFieldJustifyContent === 'flexEnd'
          ? ('flexEnd' as const)
          : ('flexStart' as const)

      const iconProps: LinkField['iconProps'] | undefined =
        screen.linkFieldIcon != null && screen.linkFieldIcon !== ''
          ? {
              icon: screen.linkFieldIcon as NonNullable<
                LinkField['iconProps']
              >['icon'],
              type:
                screen.linkFieldIconType === 'filled' ? 'filled' : 'outline',
            }
          : undefined

      return {
        ...base,
        type: FieldTypes.LINK,
        component: FieldComponents.LINK,
        title: titleFormText,
        link: linkFormText,
        s3key: s3FormText,
        variant,
        justifyContent,
        ...(iconProps ? { iconProps } : {}),
      } as LinkField
    }

    case FieldTypes.MESSAGE_WITH_LINK_BUTTON_FIELD: {
      const msgId = screen.messageWithLinkMessageId
      const message: FormText = msgId
        ? {
            id: msgId,
            defaultMessage: defaultMsgForKey(msgId) ?? '',
          }
        : screen.messageWithLinkMessageStatic ?? ''
      const btnId = screen.messageWithLinkButtonTitleMessageId
      const buttonTitle: FormText = btnId
        ? {
            id: btnId,
            defaultMessage: defaultMsgForKey(btnId) ?? '',
          }
        : screen.messageWithLinkButtonTitleStatic ?? ''
      const msgColorRaw = screen.messageWithLinkMessageColor
      const messageColor =
        msgColorRaw != null && msgColorRaw !== ''
          ? (msgColorRaw as MessageWithLinkButtonField['messageColor'])
          : undefined

      return {
        ...base,
        type: FieldTypes.MESSAGE_WITH_LINK_BUTTON_FIELD,
        component: FieldComponents.MESSAGE_WITH_LINK_BUTTON_FIELD,
        url: screen.messageWithLinkUrl ?? '#',
        message,
        buttonTitle,
        ...(messageColor ? { messageColor } : {}),
      } as MessageWithLinkButtonField
    }

    case FieldTypes.CHECKBOX: {
      const options = (screen.checkboxOptions ?? []).map(
        optionFromIntrospection,
      )
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
}

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
    FieldTypes.LINK,
    FieldTypes.MESSAGE_WITH_LINK_BUTTON_FIELD,
  ])
