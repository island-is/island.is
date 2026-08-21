import type { SectionIntrospection } from '@island.is/application/types'

export type {
  MessageDescriptorInfo as MessageDescriptor,
  ValidationMessageDescriptorInfo as ValidationMessageDescriptor,
  RadioOptionIntrospection,
  SubmitActionIntrospection,
  ScreenIntrospection,
  SectionIntrospection as TemplateSectionNav,
} from '@island.is/application/types'

/** Where in the template tree a sidebar row was clicked (for debugging / tooling). */
export interface SidebarNavLocation {
  stateKey: string
  stateName: string
  roleId: string
  sectionId: string
  sectionTitle?: string | null
  subsectionId?: string
  subsectionTitle?: string | null
  leafSourceScreenId?: string
}

/** Draft overrides per message key, split by preview locale so switching IS/EN does not drop work. */
export type EditedTranslations = {
  is: Record<string, string>
  en: Record<string, string>
}

export type ResolvePreviewString = (
  messageKey: string,
  defaultMessage?: string | null,
) => string

/** Matches `useLocale().formatMessage` for preview fallbacks (e.g. core messages). */
export type PreviewFormatMessage = (
  descriptor: { id: string; defaultMessage?: string | null },
  values?: Record<string, string | number | boolean | null | undefined>,
) => string

export interface TemplateStateNav {
  stateKey: string
  stateName: string
  roles: Array<{
    roleId: string
    form?: {
      logoKey?: string | null
      sections: SectionIntrospection[]
    } | null
  }>
}
