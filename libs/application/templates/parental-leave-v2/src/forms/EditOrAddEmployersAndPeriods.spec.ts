import {
  FormItemTypes,
  FormNode,
  MultiField,
} from '@island.is/application/types'
import { NO, YES } from '@island.is/application/core'
import { EditOrAddEmployersAndPeriods } from './EditOrAddEmployersAndPeriods'
import { dataSchema } from '../lib/dataSchema'

const collectMultiFields = (node: FormNode): MultiField[] => {
  if (node.type === FormItemTypes.MULTI_FIELD) {
    return [node as MultiField]
  }

  const children = (node as { children?: FormNode[] }).children ?? []
  return children.flatMap(collectMultiFields)
}

describe('EditOrAddEmployersAndPeriods', () => {
  // On Continue the client sends only the answers of the screen's own field
  // ids, so a key a field writes with `setOnChange` is lost on reload unless a
  // field on the same screen owns it.
  it.each(
    collectMultiFields(EditOrAddEmployersAndPeriods).map((screen) => [
      screen.id,
      screen,
    ]),
  )(
    'should save every answer %s writes with setOnChange',
    async (_, screen) => {
      const fieldIds = (screen as MultiField).children.map(({ id }) =>
        String(id),
      )
      const isSaved = (key: string) =>
        fieldIds.some((id) => key === id || key.startsWith(`${id}.`))

      for (const field of (screen as MultiField).children) {
        const setOnChange = (
          field as {
            setOnChange?: (value: unknown) => Promise<{ key: string }[]>
          }
        ).setOnChange
        if (typeof setOnChange !== 'function') continue

        for (const value of [[YES], [], '50']) {
          const changes = await setOnChange(value)
          for (const { key } of changes) {
            expect({ field: field.id, key, saved: isSaved(key) }).toEqual({
              field: field.id,
              key,
              saved: true,
            })
          }
        }
      }
    },
  )

  it('should save a change to not self-employed that the server accepts', () => {
    expect(
      dataSchema.partial().safeParse({
        employment: { isSelfEmployed: NO, isReceivingUnemploymentBenefits: NO },
      }).success,
    ).toBe(true)
  })
})
