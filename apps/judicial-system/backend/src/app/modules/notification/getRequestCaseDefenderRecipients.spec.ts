import { Case } from '../repository'
import {
  formatRequestCaseDefenderNames,
  getRequestCaseDefenderRecipients,
} from './getRequestCaseDefenderRecipients'

describe('getRequestCaseDefenderRecipients', () => {
  it('should return empty array when defendants is undefined', () => {
    const result = getRequestCaseDefenderRecipients({
      defendants: undefined,
    } as Case)

    expect(result).toEqual([])
  })

  it('should return empty array when defendants is empty', () => {
    const result = getRequestCaseDefenderRecipients({
      defendants: [],
    } as unknown as Case)

    expect(result).toEqual([])
  })

  it('should return empty array when defendant has no defenderEmail', () => {
    const result = getRequestCaseDefenderRecipients({
      defendants: [{ defenderName: 'Jon' }],
    } as unknown as Case)

    expect(result).toEqual([])
  })

  it('should return one recipient for a single defendant with defender', () => {
    const result = getRequestCaseDefenderRecipients({
      defendants: [
        {
          defenderEmail: 'defender@test.is',
          defenderName: 'Jon',
          defenderNationalId: '1234567890',
        },
      ],
    } as unknown as Case)

    expect(result).toEqual([
      {
        email: 'defender@test.is',
        name: 'Jon',
        nationalId: '1234567890',
      },
    ])
  })

  it('should deduplicate two defendants with the same defender email', () => {
    const result = getRequestCaseDefenderRecipients({
      defendants: [
        {
          defenderEmail: 'defender@test.is',
          defenderName: 'Jon',
          defenderNationalId: '1234567890',
        },
        {
          defenderEmail: 'defender@test.is',
          defenderName: 'Jon',
          defenderNationalId: '1234567890',
        },
      ],
    } as unknown as Case)

    expect(result).toEqual([
      {
        email: 'defender@test.is',
        name: 'Jon',
        nationalId: '1234567890',
      },
    ])
  })

  it('should return two recipients for two defendants with different defender emails', () => {
    const result = getRequestCaseDefenderRecipients({
      defendants: [
        {
          defenderEmail: 'defender1@test.is',
          defenderName: 'Jon',
          defenderNationalId: '1111111111',
        },
        {
          defenderEmail: 'defender2@test.is',
          defenderName: 'Sigga',
          defenderNationalId: '2222222222',
        },
      ],
    } as unknown as Case)

    expect(result).toEqual([
      {
        email: 'defender1@test.is',
        name: 'Jon',
        nationalId: '1111111111',
      },
      {
        email: 'defender2@test.is',
        name: 'Sigga',
        nationalId: '2222222222',
      },
    ])
  })

  it('should handle null defenderName and defenderNationalId as undefined', () => {
    const result = getRequestCaseDefenderRecipients({
      defendants: [
        {
          defenderEmail: 'defender@test.is',
          defenderName: null,
          defenderNationalId: null,
        },
      ],
    } as unknown as Case)

    expect(result).toEqual([
      {
        email: 'defender@test.is',
        name: undefined,
        nationalId: undefined,
      },
    ])
  })
})

describe('formatRequestCaseDefenderNames', () => {
  it('should return undefined when there are no defenders', () => {
    const result = formatRequestCaseDefenderNames({
      defendants: [],
    } as unknown as Case)

    expect(result).toBeUndefined()
  })

  it('should return a single name', () => {
    const result = formatRequestCaseDefenderNames({
      defendants: [{ defenderEmail: 'a@test.is', defenderName: 'Jon' }],
    } as unknown as Case)

    expect(result).toBe('Jon')
  })

  it('should join unique names with comma', () => {
    const result = formatRequestCaseDefenderNames({
      defendants: [
        { defenderEmail: 'a@test.is', defenderName: 'Jon' },
        { defenderEmail: 'b@test.is', defenderName: 'Sigga' },
      ],
    } as unknown as Case)

    expect(result).toBe('Jon, Sigga')
  })

  it('should skip defenders with no name', () => {
    const result = formatRequestCaseDefenderNames({
      defendants: [
        { defenderEmail: 'a@test.is', defenderName: null },
        { defenderEmail: 'b@test.is', defenderName: 'Sigga' },
      ],
    } as unknown as Case)

    expect(result).toBe('Sigga')
  })

  it('should deduplicate by email before joining names', () => {
    const result = formatRequestCaseDefenderNames({
      defendants: [
        { defenderEmail: 'a@test.is', defenderName: 'Jon' },
        { defenderEmail: 'a@test.is', defenderName: 'Jon' },
        { defenderEmail: 'b@test.is', defenderName: 'Sigga' },
      ],
    } as unknown as Case)

    expect(result).toBe('Jon, Sigga')
  })
})
