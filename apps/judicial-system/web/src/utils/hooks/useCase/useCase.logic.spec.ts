import type {
  Case,
  Defendant,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  CaseType,
  Gender,
} from '@island.is/judicial-system-web/src/graphql/schema'

import type { UpdateCase } from './useCase.logic'
import { createCaseInput, formatUpdates, update } from './useCase.logic'

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

  describe('createCaseInput', () => {
    const defendant = {
      id: 'local-1',
      name: 'Jón Jónsson',
      address: 'Gata 1',
      nationalId: '010101-0101',
      gender: Gender.MALE,
      citizenship: 'Ísland',
      noNationalId: false,
    } as Defendant

    test('is undefined when the case has no type', () => {
      expect(
        createCaseInput({ policeCaseNumbers: ['012-3456-7890'] } as Case),
      ).toBeUndefined()
    })

    test('is undefined when the case has no police case numbers', () => {
      expect(
        createCaseInput({ type: CaseType.INDICTMENT } as Case),
      ).toBeUndefined()
    })

    test('sends the defendants of an indictment with only the fields entered for them', () => {
      const input = createCaseInput({
        type: CaseType.INDICTMENT,
        policeCaseNumbers: ['012-3456-7890'],
        defendants: [defendant],
      } as Case)

      expect(input?.defendants).toEqual([
        {
          noNationalId: false,
          nationalId: '010101-0101',
          name: 'Jón Jónsson',
          gender: Gender.MALE,
          address: 'Gata 1',
          citizenship: 'Ísland',
        },
      ])
    })

    test('sends a blank national id as null', () => {
      const input = createCaseInput({
        type: CaseType.INDICTMENT,
        policeCaseNumbers: ['012-3456-7890'],
        defendants: [{ ...defendant, nationalId: '' }],
      } as Case)

      expect(input?.defendants?.[0].nationalId).toBeNull()
    })

    test('keeps the order of the defendants', () => {
      const input = createCaseInput({
        type: CaseType.INDICTMENT,
        policeCaseNumbers: ['012-3456-7890'],
        defendants: [defendant, { ...defendant, id: 'local-2', name: 'Anna' }],
      } as Case)

      expect(input?.defendants?.map((d) => d.name)).toEqual([
        'Jón Jónsson',
        'Anna',
      ])
    })

    test('sends no defendants for an indictment without any', () => {
      const input = createCaseInput({
        type: CaseType.INDICTMENT,
        policeCaseNumbers: ['012-3456-7890'],
        defendants: [],
      } as unknown as Case)

      expect(input).not.toHaveProperty('defendants')
    })

    test('sends no defendants for a request case', () => {
      const input = createCaseInput({
        type: CaseType.CUSTODY,
        policeCaseNumbers: ['012-3456-7890'],
        defendants: [defendant],
      } as Case)

      expect(input).not.toHaveProperty('defendants')
    })

    test('maps the case fields and the prosecutor id', () => {
      const input = createCaseInput({
        type: CaseType.CUSTODY,
        policeCaseNumbers: ['012-3456-7890'],
        description: 'Lýsing',
        leadInvestigator: 'Lögreglumaður',
        prosecutor: { id: 'prosecutor-1' },
      } as Case)

      expect(input).toMatchObject({
        type: CaseType.CUSTODY,
        policeCaseNumbers: ['012-3456-7890'],
        description: 'Lýsing',
        leadInvestigator: 'Lögreglumaður',
        prosecutorId: 'prosecutor-1',
      })
    })
  })
})
