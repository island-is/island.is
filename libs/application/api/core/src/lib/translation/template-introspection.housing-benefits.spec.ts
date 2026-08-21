import { TemplateIntrospectionService } from './template-introspection.service'
import {
  ApplicationConfigurations,
  ApplicationTypes,
} from '@island.is/application/types'

describe('TemplateIntrospectionService HousingBenefits', () => {
  it('returns JSON-serializable introspection with string ids on every screen', async () => {
    const svc = new TemplateIntrospectionService()
    const result = await svc.introspectTemplate(
      ApplicationTypes.HOUSING_BENEFITS,
    )

    const json = JSON.stringify(result)
    expect(() => JSON.parse(json)).not.toThrow()

    const parsed = JSON.parse(json) as typeof result
    const missingIds: string[] = []

    const walkScreens = (
      screens: Array<{ id?: unknown; children?: unknown[] }>,
      path: string,
    ) => {
      for (const screen of screens ?? []) {
        if (typeof screen.id !== 'string' || screen.id.length === 0) {
          missingIds.push(path)
        }
        walkScreens(
          (screen.children ?? []) as Array<{
            id?: unknown
            children?: unknown[]
          }>,
          `${path}/${String(screen.id)}`,
        )
      }
    }

    for (const state of parsed.states) {
      for (const role of state.roles) {
        if (!role.form) continue
        for (const section of role.form.sections) {
          walkScreens(
            section.screens,
            `${state.stateKey}/${role.roleId}/${section.id}`,
          )
          for (const sub of section.subSections) {
            walkScreens(
              sub.screens,
              `${state.stateKey}/${role.roleId}/${section.id}/${sub.id}`,
            )
          }
        }
      }
    }

    expect(missingIds).toEqual([])
  })

  it('does not mutate ApplicationConfigurations when introspecting shared namespace arrays', async () => {
    const svc = new TemplateIntrospectionService()
    const config = ApplicationConfigurations[ApplicationTypes.HOUSING_BENEFITS]
    const originalNamespaces = [...config.translation]

    await svc.introspectTemplate(ApplicationTypes.HOUSING_BENEFITS)

    expect(config.translation).toEqual(originalNamespaces)
    expect(config.translation).toHaveLength(2)
  })

  it('introspects Main form (draft) with applicant sections', async () => {
    const svc = new TemplateIntrospectionService()
    const result = await svc.introspectTemplate(
      ApplicationTypes.HOUSING_BENEFITS,
    )
    const draft = result.states.find((s) => s.stateName === 'Main form')
    expect(draft).toBeDefined()
    const applicant = draft?.roles.find((r) => r.roleId === 'applicant')
    expect(applicant?.form).toBeTruthy()
    expect(applicant?.form?.sections?.length).toBeGreaterThan(0)
  })

  it('listTemplates returns unique namespaces for HousingBenefits', async () => {
    const svc = new TemplateIntrospectionService()

    await svc.introspectTemplate(ApplicationTypes.HOUSING_BENEFITS)

    const templates = await svc.listTemplates()
    const housingBenefits = templates.find(
      (template) => template.typeId === ApplicationTypes.HOUSING_BENEFITS,
    )

    expect(housingBenefits?.translationNamespaces).toEqual([
      'hb.application',
      'uiForms.application',
    ])
    expect(housingBenefits?.name).toBe('Húsnæðisbætur')
  })
})
