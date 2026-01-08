import { allPartiesHaveApproved } from './allPartiesHaveApproved'
import { FormValue } from '@island.is/application/types'

describe('allPartiesHaveApproved', () => {
  it('should return true when all enabled heirs have approved', () => {
    const answers: FormValue = {
      heirs: {
        data: [
          {
            name: 'Heir A',
            nationalId: '0101302209',
            enabled: true,
            approved: true,
          },
          {
            name: 'Heir B',
            nationalId: '0101302399',
            enabled: true,
            approved: true,
          },
        ],
      },
    }

    expect(allPartiesHaveApproved(answers)).toBe(true)
  })

  it('should return false when some enabled heirs have not approved', () => {
    const answers: FormValue = {
      heirs: {
        data: [
          {
            name: 'Heir A',
            nationalId: '0101302209',
            enabled: true,
            approved: true,
          },
          {
            name: 'Heir B',
            nationalId: '0101302399',
            enabled: true,
            approved: false,
          },
        ],
      },
    }

    expect(allPartiesHaveApproved(answers)).toBe(false)
  })

  it('should return false when some enabled heirs have undefined approved status', () => {
    const answers: FormValue = {
      heirs: {
        data: [
          {
            name: 'Heir A',
            nationalId: '0101302209',
            enabled: true,
            approved: true,
          },
          {
            name: 'Heir B',
            nationalId: '0101302399',
            enabled: true,
          },
        ],
      },
    }

    expect(allPartiesHaveApproved(answers)).toBe(false)
  })

  it('should return true when no enabled heirs exist', () => {
    const answers: FormValue = {
      heirs: {
        data: [],
      },
    }

    expect(allPartiesHaveApproved(answers)).toBe(true)
  })

  it('should ignore disabled heirs when checking approval status', () => {
    const answers: FormValue = {
      heirs: {
        data: [
          {
            name: 'Heir A',
            nationalId: '0101302209',
            enabled: true,
            approved: true,
          },
          {
            name: 'Heir B (disabled)',
            nationalId: '0101302399',
            enabled: false,
            approved: false,
          },
        ],
      },
    }

    expect(allPartiesHaveApproved(answers)).toBe(true)
  })

  it('should return true when all heirs are disabled', () => {
    const answers: FormValue = {
      heirs: {
        data: [
          {
            name: 'Heir A',
            nationalId: '0101302209',
            enabled: false,
            approved: false,
          },
          {
            name: 'Heir B',
            nationalId: '0101302399',
            enabled: false,
            approved: false,
          },
        ],
      },
    }

    expect(allPartiesHaveApproved(answers)).toBe(true)
  })

  it('should return true when heirs array is undefined', () => {
    const answers: FormValue = {
      heirs: {},
    }

    expect(allPartiesHaveApproved(answers)).toBe(true)
  })

  it('should return true when heirs data is null', () => {
    const answers: FormValue = {
      heirs: {
        data: null as any,
      },
    }

    expect(allPartiesHaveApproved(answers)).toBe(true)
  })

  it('should handle mix of enabled and disabled heirs correctly', () => {
    const answers: FormValue = {
      heirs: {
        data: [
          {
            name: 'Heir A',
            nationalId: '0101302209',
            enabled: true,
            approved: true,
          },
          {
            name: 'Heir B (disabled)',
            nationalId: '0101302399',
            enabled: false,
            approved: false,
          },
          {
            name: 'Heir C',
            nationalId: '0101302499',
            enabled: true,
            approved: true,
          },
          {
            name: 'Heir D (disabled)',
            nationalId: '0101302599',
            enabled: false,
          },
        ],
      },
    }

    expect(allPartiesHaveApproved(answers)).toBe(true)
  })
})

