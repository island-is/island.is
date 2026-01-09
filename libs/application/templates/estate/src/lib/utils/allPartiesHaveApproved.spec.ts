import { allPartiesHaveApproved } from './allPartiesHaveApproved'
import { EstateMember } from '../../types'

describe('allPartiesHaveApproved', () => {
  it('should return true when no estate members exist', () => {
    const answers = {}
    expect(allPartiesHaveApproved(answers)).toBe(true)
  })

  it('should return true when estate members array is empty', () => {
    const answers = {
      estate: {
        estateMembers: [],
      },
    }
    expect(allPartiesHaveApproved(answers)).toBe(true)
  })

  it('should return true when all enabled members have approved', () => {
    const estateMembers: EstateMember[] = [
      {
        name: 'John Doe',
        nationalId: '1234567890',
        relation: 'Spouse',
        enabled: true,
        approved: true,
      },
      {
        name: 'Jane Doe',
        nationalId: '0987654321',
        relation: 'Child',
        enabled: true,
        approved: true,
      },
    ]
    const answers = {
      estate: {
        estateMembers,
      },
    }
    expect(allPartiesHaveApproved(answers)).toBe(true)
  })

  it('should return false when at least one enabled member has not approved', () => {
    const estateMembers: EstateMember[] = [
      {
        name: 'John Doe',
        nationalId: '1234567890',
        relation: 'Spouse',
        enabled: true,
        approved: true,
      },
      {
        name: 'Jane Doe',
        nationalId: '0987654321',
        relation: 'Child',
        enabled: true,
        approved: false,
      },
    ]
    const answers = {
      estate: {
        estateMembers,
      },
    }
    expect(allPartiesHaveApproved(answers)).toBe(false)
  })

  it('should return false when at least one enabled member has undefined approved status', () => {
    const estateMembers: EstateMember[] = [
      {
        name: 'John Doe',
        nationalId: '1234567890',
        relation: 'Spouse',
        enabled: true,
        approved: true,
      },
      {
        name: 'Jane Doe',
        nationalId: '0987654321',
        relation: 'Child',
        enabled: true,
      },
    ]
    const answers = {
      estate: {
        estateMembers,
      },
    }
    expect(allPartiesHaveApproved(answers)).toBe(false)
  })

  it('should ignore disabled members when checking approval status', () => {
    const estateMembers: EstateMember[] = [
      {
        name: 'John Doe',
        nationalId: '1234567890',
        relation: 'Spouse',
        enabled: true,
        approved: true,
      },
      {
        name: 'Jane Doe',
        nationalId: '0987654321',
        relation: 'Child',
        enabled: false,
        approved: false,
      },
    ]
    const answers = {
      estate: {
        estateMembers,
      },
    }
    expect(allPartiesHaveApproved(answers)).toBe(true)
  })

  it('should return true when all members are disabled', () => {
    const estateMembers: EstateMember[] = [
      {
        name: 'John Doe',
        nationalId: '1234567890',
        relation: 'Spouse',
        enabled: false,
        approved: false,
      },
      {
        name: 'Jane Doe',
        nationalId: '0987654321',
        relation: 'Child',
        enabled: false,
        approved: false,
      },
    ]
    const answers = {
      estate: {
        estateMembers,
      },
    }
    expect(allPartiesHaveApproved(answers)).toBe(true)
  })

  it('should handle mixed enabled/disabled members correctly', () => {
    const estateMembers: EstateMember[] = [
      {
        name: 'John Doe',
        nationalId: '1234567890',
        relation: 'Spouse',
        enabled: true,
        approved: true,
      },
      {
        name: 'Jane Doe',
        nationalId: '0987654321',
        relation: 'Child',
        enabled: false,
      },
      {
        name: 'Bob Doe',
        nationalId: '1122334455',
        relation: 'Child',
        enabled: true,
        approved: true,
      },
    ]
    const answers = {
      estate: {
        estateMembers,
      },
    }
    expect(allPartiesHaveApproved(answers)).toBe(true)
  })
})
