import { TemplateIntrospectionService } from './template-introspection.service'
import { ApplicationTypes } from '@island.is/application/types'

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

    const walkScreens = (screens: Array<{ id?: unknown; children?: unknown[] }>, path: string) => {
      for (const screen of screens ?? []) {
        if (typeof screen.id !== 'string' || screen.id.length === 0) {
          missingIds.push(path)
        }
        walkScreens(
          (screen.children ?? []) as Array<{ id?: unknown; children?: unknown[] }>,
          `${path}/${String(screen.id)}`,
        )
      }
    }

    for (const state of parsed.states) {
      for (const role of state.roles) {
        if (!role.form) continue
        for (const section of role.form.sections) {
          walkScreens(section.screens, `${state.stateKey}/${role.roleId}/${section.id}`)
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
})
