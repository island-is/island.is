import { Injectable } from '@nestjs/common'
import {
  ApplicationTypes,
  ApplicationConfigurations,
} from '@island.is/application/types'
import type { Form } from '@island.is/application/types'
import {
  getApplicationTemplateByTypeId,
  getApplicationCustomFieldMessageDescriptors,
} from '@island.is/application/template-loader'
import type {
  FormIntrospection,
  MessageDescriptorInfo,
  RoleIntrospection,
  StateIntrospection,
  TemplateIntrospection,
  ValidationMessageDescriptorInfo,
} from '@island.is/application/types'
import {
  getTemplateDisplayName,
  resolveTemplateDisplayName,
} from './utils/template-display-name.util'
import { extractValidationDescriptors } from './utils/validation-descriptors.util'
import {
  collectAllDescriptors,
  serializeLoadedFormForApi,
  walkForm,
} from './utils/form-walker.util'

export type {
  FormIntrospection,
  MessageDescriptorInfo,
  RadioOptionIntrospection,
  RoleIntrospection,
  ScreenIntrospection,
  SectionIntrospection,
  StateIntrospection,
  SubSectionIntrospection,
  SubmitActionIntrospection,
  TemplateIntrospection,
  ValidationMessageDescriptorInfo,
} from '@island.is/application/types'

export { extractValidationDescriptors } from './utils/validation-descriptors.util'

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

    const translationNamespaces = [
      ...(Array.isArray(config.translation)
        ? config.translation
        : [config.translation]),
      ...(template.translationNamespaces ?? []),
    ]

    let customFieldManifest: Record<string, MessageDescriptorInfo[]> = {}
    try {
      customFieldManifest = await getApplicationCustomFieldMessageDescriptors(
        typeId,
      )
    } catch {
      customFieldManifest = {}
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

            formIntrospection = walkForm(form, customFieldManifest)

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

    let validationDescriptors: ValidationMessageDescriptorInfo[] = []
    try {
      validationDescriptors = extractValidationDescriptors(template.dataSchema)
      for (const d of validationDescriptors) {
        if (!seenDescriptorIds.has(d.id)) {
          seenDescriptorIds.add(d.id)
          allDescriptors.push({
            id: d.id,
            defaultMessage: d.defaultMessage,
            description: d.description,
          })
        }
      }
    } catch {
      // dataSchema extraction may fail for some templates, skip gracefully
    }

    return {
      typeId,
      name: resolveTemplateDisplayName(template, config.slug),
      slug: config.slug,
      translationNamespaces: [...new Set(translationNamespaces)],
      states,
      allMessageDescriptors: allDescriptors,
      validationMessageDescriptors: validationDescriptors,
    }
  }

  async listTemplates(allowedTypeIds?: string[]): Promise<
    Array<{
      typeId: string
      name: string
      slug: string
      translationNamespaces: string[]
    }>
  > {
    const allowedSet =
      allowedTypeIds != null ? new Set(allowedTypeIds) : undefined

    const entries = Object.entries(ApplicationConfigurations).filter(
      ([typeId]) => !allowedSet || allowedSet.has(typeId),
    )

    return Promise.all(
      entries.map(async ([typeId, config]) => {
        const translationNamespaces = [
          ...new Set(
            Array.isArray(config.translation)
              ? config.translation
              : [config.translation],
          ),
        ]

        let name = config.slug
        try {
          name = await getTemplateDisplayName(
            typeId as ApplicationTypes,
            config.slug,
          )
        } catch {
          // Keep slug fallback when template cannot be loaded.
        }

        return {
          typeId,
          name,
          slug: config.slug,
          translationNamespaces,
        }
      }),
    )
  }
}
