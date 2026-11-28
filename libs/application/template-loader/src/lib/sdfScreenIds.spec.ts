import {
  ApplicationConfigurations,
  ApplicationTypes,
  Application,
} from '@island.is/application/types'
import { resolveFormItemId } from '@island.is/application/core'
import { convertFormToScreens } from '@island.is/application/screen-compiler'
import type { BffUser } from '@island.is/shared/types'

import { getApplicationTemplateByTypeId } from '../index'

/**
 * A screen's id is its address (`?screen=<id>`), so every screen of an SDF
 * template's forms needs an id that is non-empty, unique within its form and a
 * static string. A function-valued id could carry personal data into the URL.
 *
 * Each form is compiled with an empty application and feature flags at their
 * defaults, so only the screens shown by default are checked for empty and
 * duplicate ids. Function-valued ids are looked for in the whole form tree.
 */

jest.setTimeout(120000)

const bffUser: BffUser = {
  scopes: [],
  profile: {
    sid: '',
    nationalId: '0101302399',
    name: '',
    idp: '',
    subjectType: 'person',
    locale: 'is',
    iss: '',
  },
}

const featureFlagClient = {
  getValue: async (_key: string, defaultValue: unknown) => defaultValue,
}

type FormNodeLike = { id?: unknown; children?: unknown }

const findFunctionIds = (
  node: FormNodeLike,
  trail: string[] = [],
): string[] => {
  const label =
    typeof node.id === 'string'
      ? node.id
      : typeof node.id === 'function'
      ? '<function>'
      : '<none>'
  const here = [...trail, label]
  const found = typeof node.id === 'function' ? [here.join(' > ')] : []

  if (!Array.isArray(node.children)) {
    return found
  }
  return node.children
    .filter((child): child is FormNodeLike => typeof child === 'object')
    .reduce((acc, child) => acc.concat(findFunctionIds(child, here)), found)
}

const sdfTypeIds = Object.entries(ApplicationConfigurations)
  .filter(([, config]) => 'useSdf' in config && config.useSdf)
  .map(([typeId]) => typeId as ApplicationTypes)

describe('SDF screen ids', () => {
  it('finds the SDF templates', () => {
    expect(sdfTypeIds.length).toBeGreaterThan(0)
  })

  describe.each(sdfTypeIds)('%s', (typeId) => {
    it('gives every shown screen a non-empty, unique, static id in every state and role', async () => {
      const template = await getApplicationTemplateByTypeId(typeId)
      const problems: string[] = []

      for (const [stateName, state] of Object.entries(
        template.stateMachineConfig.states ?? {},
      )) {
        for (const role of state?.meta?.roles ?? []) {
          if (!role.formLoader) {
            continue
          }
          const where = `${typeId} / ${stateName} / ${role.id}`
          const application = {
            id: '',
            typeId,
            state: stateName,
            status: 'inprogress',
            applicant: bffUser.profile.nationalId,
            applicantActors: [],
            assignees: [],
            answers: {},
            externalData: {},
          } as unknown as Application

          try {
            const form = await role.formLoader({ featureFlagClient })

            findFunctionIds(form as FormNodeLike).forEach((path) =>
              problems.push(`${where}: function-valued id at ${path}`),
            )

            const counts = new Map<string, number>()
            convertFormToScreens(form, {}, {}, bffUser).forEach(
              (screen, index) => {
                const id = resolveFormItemId(screen, application, bffUser)
                if (!id) {
                  problems.push(
                    `${where}: screen ${index} (${screen.type}) has an empty id`,
                  )
                  return
                }
                counts.set(id, (counts.get(id) ?? 0) + 1)
              },
            )
            counts.forEach((count, id) => {
              if (count > 1) {
                problems.push(`${where}: ${count} screens share the id "${id}"`)
              }
            })
          } catch (error) {
            problems.push(
              `${where}: the form could not be compiled with an empty application: ${
                error instanceof Error ? error.message : String(error)
              }`,
            )
          }
        }
      }

      expect(problems).toEqual([])
    })
  })
})
