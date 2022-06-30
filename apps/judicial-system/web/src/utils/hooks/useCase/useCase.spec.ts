import { Case, UpdateCase } from '@island.is/judicial-system/types'
import { update, auto } from './'

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

  test('should not update fields that are not in .....todo', () => {
    const newCase = {} as UpdateCase
    const workingCase = { ruling: 'some ruling' } as Case

    const res = update(newCase, workingCase)
    expect(res.ruling).toBe('some ruling')
  })
})

describe('TODO auto', () => {
  test('1', () => {
    const workingCase = { ruling: 'ruling1' } as Case

    const res = auto([{ ruling: 'ruling2' }], workingCase)

    expect(res.ruling).toBe('ruling1')
  })

  test('2', () => {
    const workingCase = { ruling: 'ruling1' } as Case

    const res = auto([{ ruling: 'ruling2', force: true }], workingCase)

    expect(res.ruling).toBe('ruling2')
  })

  test('3', () => {
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

  test('3', () => {
    const workingCase = {} as Case

    const res = auto(
      [{ courtDate: formatIso(new Date('2022-06-06')) }],
      workingCase,
    )

    expect(res.courtDate).toBe('ruling1')
  })
})
