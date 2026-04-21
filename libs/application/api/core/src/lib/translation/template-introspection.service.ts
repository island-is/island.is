import { Injectable } from '@nestjs/common'
import {
  ApplicationTypes,
  ApplicationConfigurations,
  FormItemTypes,
} from '@island.is/application/types'
import type {
  Form,
  FormNode,
  FormLeaf,
  Section,
  SubSection,
  MultiField,
  Field,
  StaticText,
  FormText,
  FormTextWithLocale,
} from '@island.is/application/types'
import { getApplicationTemplateByTypeId } from '@island.is/application/template-loader'
import type { MessageDescriptor } from 'react-intl'

export interface TemplateIntrospection {
  typeId: string
  name: string
  slug: string
  translationNamespaces: string[]
  states: StateIntrospection[]
  allMessageDescriptors: MessageDescriptorInfo[]
}

export interface StateIntrospection {
  stateKey: string
  stateName: string
  status: string
  roles: RoleIntrospection[]
}

export interface RoleIntrospection {
  roleId: string
  form: FormIntrospection | null
}

export interface FormIntrospection {
  id: string
  title: string | null
  sections: SectionIntrospection[]
}

export interface SectionIntrospection {
  id: string
  title: string | null
  subSections: SubSectionIntrospection[]
  screens: ScreenIntrospection[]
}

export interface SubSectionIntrospection {
  id: string
  title: string | null
  screens: ScreenIntrospection[]
}

export interface ScreenIntrospection {
  id: string
  type: string
  title: string | null
  description: string | null
  width: string | null
  /** `MULTI_FIELD` only: vertical gap between child fields (matches `FormMultiField`). */
  space: number | null
  marginTop?: unknown
  marginBottom?: unknown
  /** Maps `field.space` (e.g. description/radio top padding) to `Box` `paddingTop`. */
  paddingTop?: unknown
  messageDescriptors: MessageDescriptorInfo[]
  children?: ScreenIntrospection[]
}

export interface MessageDescriptorInfo {
  id: string
  defaultMessage?: string
  description?: string
}

function extractStaticText(text: StaticText | undefined): string | null {
  if (!text) return null
  if (typeof text === 'string') return text
  if (typeof text === 'object' && 'defaultMessage' in text) {
    return (text.defaultMessage as string) ?? text.id ?? null
  }
  return null
}

function isMessageDescriptor(obj: unknown): obj is MessageDescriptor {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    typeof (obj as MessageDescriptor).id === 'string'
  )
}

function extractMessageDescriptorsFromFormText(
  text: FormText | FormTextWithLocale | undefined,
): MessageDescriptorInfo[] {
  if (!text) return []
  if (typeof text === 'function') return []
  if (typeof text === 'string') return []
  if (isMessageDescriptor(text)) {
    return [
      {
        id: String(text.id),
        defaultMessage: text.defaultMessage as string | undefined,
        description: text.description as string | undefined,
      },
    ]
  }
  return []
}

function extractMessageDescriptorsFromField(
  field: Field,
): MessageDescriptorInfo[] {
  const descriptors: MessageDescriptorInfo[] = []
  const f = field as unknown as Record<string, unknown>

  descriptors.push(...extractMessageDescriptorsFromFormText(field.title))
  descriptors.push(
    ...extractMessageDescriptorsFromFormText(
      f.description as FormText | undefined,
    ),
  )
  descriptors.push(
    ...extractMessageDescriptorsFromFormText(
      f.placeholder as FormText | undefined,
    ),
  )
  descriptors.push(
    ...extractMessageDescriptorsFromFormText(
      f.tooltip as FormText | undefined,
    ),
  )

  const options = f.options
  if (Array.isArray(options)) {
    for (const option of options) {
      if (option && typeof option === 'object') {
        descriptors.push(
          ...extractMessageDescriptorsFromFormText(option.label),
        )
        descriptors.push(
          ...extractMessageDescriptorsFromFormText(option.tooltip),
        )
      }
    }
  }

  return descriptors
}

function walkFormLeaf(leaf: FormLeaf): ScreenIntrospection {
  const descriptors: MessageDescriptorInfo[] = []
  const children: ScreenIntrospection[] = []
  const leafRecord = leaf as unknown as Record<string, unknown>

  let description: string | null = null
  let width: string | null = null
  let space: number | null = null
  let marginTop: unknown = null
  let marginBottom: unknown = null
  let paddingTop: unknown = null

  descriptors.push(...extractMessageDescriptorsFromFormText(leaf.title))

  if (leaf.type === FormItemTypes.MULTI_FIELD) {
    const multiField = leaf as MultiField
    descriptors.push(
      ...extractMessageDescriptorsFromFormText(multiField.description),
    )
    description = extractStaticText(
      multiField.description as StaticText | undefined,
    )
    if (typeof leafRecord.space === 'number') {
      space = leafRecord.space as number
    }
    if (multiField.children) {
      for (const child of multiField.children) {
        const childScreen = walkFormLeaf(child)
        children.push(childScreen)
        descriptors.push(...childScreen.messageDescriptors)
      }
    }
  } else if (leaf.type === FormItemTypes.EXTERNAL_DATA_PROVIDER) {
    const edp = leafRecord
    descriptors.push(
      ...extractMessageDescriptorsFromFormText(
        edp.subTitle as FormText | undefined,
      ),
    )
    descriptors.push(
      ...extractMessageDescriptorsFromFormText(
        edp.description as FormText | undefined,
      ),
    )
    descriptors.push(
      ...extractMessageDescriptorsFromFormText(
        edp.checkboxLabel as FormText | undefined,
      ),
    )
    description = extractStaticText(edp.description as StaticText | undefined)
  } else {
    const field = leaf as Field
    descriptors.push(...extractMessageDescriptorsFromField(field))
    description = extractStaticText(
      leafRecord.description as StaticText | undefined,
    )
    if (typeof field.width === 'string') {
      width = field.width
    }
    marginTop = field.marginTop ?? null
    marginBottom = field.marginBottom ?? null
    if ('space' in field && field.space !== undefined) {
      paddingTop = field.space
    }
  }

  return {
    id: leaf.id ?? '',
    type: leaf.type ?? 'FIELD',
    title: extractStaticText(leaf.title as StaticText | undefined),
    description,
    width,
    space,
    marginTop,
    marginBottom,
    paddingTop,
    messageDescriptors: descriptors,
    children: children.length > 0 ? children : undefined,
  }
}

function walkSection(section: Section): SectionIntrospection {
  const subSections: SubSectionIntrospection[] = []
  const screens: ScreenIntrospection[] = []

  for (const child of section.children) {
    if (child.type === FormItemTypes.SUB_SECTION) {
      subSections.push(walkSubSection(child as SubSection))
    } else {
      screens.push(walkFormLeaf(child as FormLeaf))
    }
  }

  return {
    id: section.id ?? '',
    title: extractStaticText(section.title as StaticText | undefined),
    subSections,
    screens,
  }
}

function walkSubSection(subSection: SubSection): SubSectionIntrospection {
  const screens: ScreenIntrospection[] = []

  for (const child of subSection.children) {
    screens.push(walkFormLeaf(child))
  }

  return {
    id: subSection.id ?? '',
    title: extractStaticText(subSection.title as StaticText | undefined),
    screens,
  }
}

function walkForm(form: Form): FormIntrospection {
  const sections: SectionIntrospection[] = []

  for (const child of form.children) {
    if (child.type === FormItemTypes.SECTION) {
      sections.push(walkSection(child as Section))
    }
  }

  return {
    id: form.id,
    title: extractStaticText(form.title),
    sections,
  }
}

function collectAllDescriptors(
  form: FormIntrospection,
): MessageDescriptorInfo[] {
  const all: MessageDescriptorInfo[] = []
  const seen = new Set<string>()

  const add = (d: MessageDescriptorInfo) => {
    if (!seen.has(d.id)) {
      seen.add(d.id)
      all.push(d)
    }
  }

  for (const section of form.sections) {
    for (const screen of section.screens) {
      screen.messageDescriptors.forEach(add)
      screen.children?.forEach((c) => c.messageDescriptors.forEach(add))
    }
    for (const subSection of section.subSections) {
      for (const screen of subSection.screens) {
        screen.messageDescriptors.forEach(add)
        screen.children?.forEach((c) => c.messageDescriptors.forEach(add))
      }
    }
  }

  return all
}

function serializeLoadedFormForApi(form: Form): unknown {
  try {
    return JSON.parse(JSON.stringify(form)) as unknown
  } catch (e) {
    throw new Error(
      `Loaded form could not be serialized to JSON: ${
        e instanceof Error ? e.message : String(e)
      }`,
    )
  }
}

@Injectable()
export class TemplateIntrospectionService {
  /**
   * Runs the template's `formLoader` for the given state and role (same as introspection)
   * and returns the raw form object as JSON-serializable data for admin tooling.
   */
  async loadRoleForm(
    typeId: ApplicationTypes,
    stateKey: string,
    roleId: string,
  ): Promise<unknown> {
    let template
    try {
      template = await getApplicationTemplateByTypeId(typeId)
    } catch (e) {
      throw new Error(
        `Failed to load application template "${typeId}": ${
          e instanceof Error ? e.message : String(e)
        }`,
      )
    }

    const statesConfig = template.stateMachineConfig?.states as
      | Record<string, unknown>
      | undefined
    if (!statesConfig || !statesConfig[stateKey]) {
      throw new Error(`Unknown state "${stateKey}" for template "${typeId}"`)
    }

    const stateConfig = statesConfig[stateKey] as Record<string, unknown>
    const meta = stateConfig.meta as Record<string, unknown> | undefined
    if (!meta) {
      throw new Error(`State "${stateKey}" has no meta`)
    }

    const metaRoles = (meta.roles as Array<Record<string, unknown>>) ?? []
    const role = metaRoles.find((r) => String(r.id) === String(roleId))

    if (!role) {
      throw new Error(
        `Role "${roleId}" not found in state "${stateKey}" (template "${typeId}")`,
      )
    }

    if (!role.formLoader || typeof role.formLoader !== 'function') {
      throw new Error(
        `Role "${roleId}" in state "${stateKey}" has no formLoader`,
      )
    }

    const mockFeatureFlagClient = {
      getValue: () => Promise.resolve(undefined),
    }

    let form: Form
    try {
      form = await (
        role.formLoader as (args: {
          featureFlagClient: unknown
        }) => Promise<Form>
      )({ featureFlagClient: mockFeatureFlagClient })
    } catch (e) {
      throw new Error(
        `formLoader failed for "${typeId}" / "${stateKey}" / "${roleId}": ${
          e instanceof Error ? e.message : String(e)
        }`,
      )
    }

    return serializeLoadedFormForApi(form)
  }

  async introspectTemplate(
    typeId: ApplicationTypes,
  ): Promise<TemplateIntrospection> {
    let template
    try {
      template = await getApplicationTemplateByTypeId(typeId)
    } catch (e) {
      throw new Error(
        `Failed to load application template "${typeId}": ${
          e instanceof Error ? e.message : String(e)
        }`,
      )
    }

    const config = ApplicationConfigurations[typeId]

    if (!config) {
      throw new Error(`No configuration found for template ${typeId}`)
    }

    const translationNamespaces = Array.isArray(config.translation)
      ? config.translation
      : [config.translation]

    if (template.translationNamespaces) {
      translationNamespaces.push(...template.translationNamespaces)
    }

    const states: StateIntrospection[] = []
    const allDescriptors: MessageDescriptorInfo[] = []
    const seenDescriptorIds = new Set<string>()

    const statesConfig = template.stateMachineConfig?.states ?? {}
    for (const [stateKey, stateConfig] of Object.entries(statesConfig)) {
      const meta = (stateConfig as Record<string, unknown>).meta as
        | Record<string, unknown>
        | undefined
      if (!meta) continue

      const roles: RoleIntrospection[] = []
      const metaRoles = (meta.roles as Array<Record<string, unknown>>) ?? []

      for (const role of metaRoles) {
        let formIntrospection: FormIntrospection | null = null

        if (role.formLoader && typeof role.formLoader === 'function') {
          try {
            const mockFeatureFlagClient = {
              getValue: () => Promise.resolve(undefined),
            }
            const form = await (
              role.formLoader as (args: {
                featureFlagClient: unknown
              }) => Promise<Form>
            )({ featureFlagClient: mockFeatureFlagClient })

            formIntrospection = walkForm(form)

            const descriptors = collectAllDescriptors(formIntrospection)
            for (const d of descriptors) {
              if (!seenDescriptorIds.has(d.id)) {
                seenDescriptorIds.add(d.id)
                allDescriptors.push(d)
              }
            }
          } catch {
            // formLoader may fail in server context, skip gracefully
          }
        }

        roles.push({
          roleId: role.id as string,
          form: formIntrospection,
        })
      }

      states.push({
        stateKey,
        stateName: (meta.name as string) ?? stateKey,
        status: (meta.status as string) ?? 'draft',
        roles,
      })
    }

    const templateName = extractStaticText(
      typeof template.name === 'function' ? undefined : (template.name as StaticText),
    )

    return {
      typeId,
      name: templateName ?? config.slug,
      slug: config.slug,
      translationNamespaces: [...new Set(translationNamespaces)],
      states,
      allMessageDescriptors: allDescriptors,
    }
  }

  async listTemplates(): Promise<
    Array<{
      typeId: string
      name: string
      slug: string
      translationNamespaces: string[]
    }>
  > {
    const templates: Array<{
      typeId: string
      name: string
      slug: string
      translationNamespaces: string[]
    }> = []

    for (const [typeId, config] of Object.entries(ApplicationConfigurations)) {
      const translationNamespaces = Array.isArray(config.translation)
        ? config.translation
        : [config.translation]

      templates.push({
        typeId,
        name: config.slug,
        slug: config.slug,
        translationNamespaces,
      })
    }

    return templates
  }
}
