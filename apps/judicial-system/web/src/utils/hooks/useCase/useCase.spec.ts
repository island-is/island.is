import { Case, UpdateCase } from '@island.is/judicial-system/types'

import { update, auto } from './'

describe('useCase', () => {
  describe('update', () => {
    test('should not update field that is already defined', () => {
      const newCase = { ruling: 'ruling2' } as UpdateCase
      const workingCase = { ruling: 'ruling1' } as Case

      const res = update(newCase, workingCase)
      expect(res.ruling).toBe('ruling1')
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
      expect(res.ruling).toBe('')
    })

    test('should not update fields when update is empty', () => {
      const newCase = {} as UpdateCase
      const workingCase = { ruling: 'some ruling' } as Case

      const res = update(newCase, workingCase)
      expect(res.ruling).toBe('some ruling')
    })
  })

  describe('auto', () => {
    test('should not autofill when field has value in working case and force is not set', () => {
      const workingCase = { ruling: 'ruling1' } as Case

      const res = auto([{ ruling: 'ruling2' }], workingCase)

      expect(res.ruling).toBe('ruling1')
    })

    test('should overwrite value in workingCase if force is set', () => {
      const workingCase = { ruling: 'ruling1' } as Case

      const res = auto([{ ruling: 'ruling2', force: true }], workingCase)

      expect(res.ruling).toBe('ruling2')
    })

    test('should only overwrite value in workingCase if force is set', () => {
      const workingCase = {
        ruling: 'ruling1',
        description: 'description1',
      } as Case

      const res = auto(
        [{ ruling: 'ruling2', force: true }, { description: 'description2' }],
        workingCase,
      )

      expect(res.ruling).toBe('ruling1')
      expect(res.description).toBe('description1')
    })
  })
})
