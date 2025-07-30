import { Case } from '@island.is/judicial-system-web/src/graphql/schema'

import { formatUpdates, update, UpdateCase } from './useCase.logic'

describe('useCase', () => {
  describe('update', () => {
    test('should not update field that is already defined', () => {
      const newCase = { ruling: 'ruling2' } as UpdateCase
      const workingCase = { ruling: 'ruling1' } as Case

      const res = update(newCase, workingCase)
      expect(res.ruling).toBe(undefined)
    })

    test('should update field that is undefined on the workingCase', () => {
      const newCase = { ruling: 'ruling2' } as UpdateCase
      const workingCase = { ruling: undefined } as Case

      const res = update(newCase, workingCase)
      expect(res.ruling).toBe('ruling2')
    })

    test('should not update field when update is undefined', () => {
      const newCase = { ruling: undefined } as UpdateCase
      const workingCase = { ruling: '' } as Case

      const res = update(newCase, workingCase)
      expect(res.ruling).toBe(undefined)
    })

    test('should not update fields when update is empty', () => {
      const newCase = {} as UpdateCase
      const workingCase = { ruling: 'some ruling' } as Case

      const res = update(newCase, workingCase)
      expect(res.ruling).toBe(undefined)
    })
  })

  describe('auto', () => {
    test('should not autofill when field has value in working case and force is not set', () => {
      const workingCase = { ruling: 'ruling1' } as Case

      const res = formatUpdates([{ ruling: 'ruling2' }], workingCase)

      expect(res.ruling).toBe(undefined)
    })

    test('should overwrite value in workingCase if force is set', () => {
      const workingCase = { ruling: 'ruling1' } as Case

      const res = formatUpdates(
        [{ ruling: 'ruling2', force: true }],
        workingCase,
      )

      expect(res.ruling).toBe('ruling2')
    })

    test('should only overwrite value in workingCase if force is set', () => {
      const workingCase = {
        ruling: 'ruling1',
        description: 'description1',
      } as Case

      const res = formatUpdates(
        [{ ruling: 'ruling2', force: true }, { description: 'description2' }],
        workingCase,
      )

      expect(res.ruling).toBe('ruling2')
      expect(res.description).toBe(undefined)
    })

    test('should not set field to undefined when force is not set', () => {
      const workingCase = {
        registrar: {
          id: 'testId',
        },
      } as Case

      const res = formatUpdates([{ registrarId: null }], workingCase)

      expect(res.registrarId).toBe(undefined)
    })

    test('should set field to null when force is set', () => {
      const workingCase = {
        registrar: {
          id: 'testId',
        },
      } as Case

      const res = formatUpdates(
        [{ registrarId: null, force: true }],
        workingCase,
      )

      expect(res.registrarId).toBe(null)
    })
  })
})
