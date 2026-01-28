import { getAssigneesNationalIdList } from './getAssigneesNationalIdList'
import { Application } from '@island.is/application/types'
import { EstateMember } from '../../types'

describe('getAssigneesNationalIdList', () => {
  const createMockApplication = (
    applicantId: string,
    estateMembers: EstateMember[],
  ): Application => {
    return {
      applicant: applicantId,
      answers: {
        estate: {
          estateMembers,
        },
      },
    } as unknown as Application
  }

  it('should return empty array when no estate members exist', () => {
    const application = createMockApplication('1234567890', [])
    expect(getAssigneesNationalIdList(application)).toEqual([])
  })

  it('should return national IDs of enabled members who have not approved', () => {
    const estateMembers: EstateMember[] = [
      {
        name: 'John Doe',
        nationalId: '1111111111',
        relation: 'Spouse',
        enabled: true,
        approved: false,
      },
      {
        name: 'Jane Doe',
        nationalId: '2222222222',
        relation: 'Child',
        enabled: true,
        approved: false,
      },
    ]
    const application = createMockApplication('1234567890', estateMembers)
    expect(getAssigneesNationalIdList(application)).toEqual([
      '1111111111',
      '2222222222',
    ])
  })

  it('should exclude members who have already approved', () => {
    const estateMembers: EstateMember[] = [
      {
        name: 'John Doe',
        nationalId: '1111111111',
        relation: 'Spouse',
        enabled: true,
        approved: true,
      },
      {
        name: 'Jane Doe',
        nationalId: '2222222222',
        relation: 'Child',
        enabled: true,
        approved: false,
      },
    ]
    const application = createMockApplication('1234567890', estateMembers)
    expect(getAssigneesNationalIdList(application)).toEqual(['2222222222'])
  })

  it('should exclude disabled members', () => {
    const estateMembers: EstateMember[] = [
      {
        name: 'John Doe',
        nationalId: '1111111111',
        relation: 'Spouse',
        enabled: false,
        approved: false,
      },
      {
        name: 'Jane Doe',
        nationalId: '2222222222',
        relation: 'Child',
        enabled: true,
        approved: false,
      },
    ]
    const application = createMockApplication('1234567890', estateMembers)
    expect(getAssigneesNationalIdList(application)).toEqual(['2222222222'])
  })

  it('should exclude the applicant from assignees list', () => {
    const estateMembers: EstateMember[] = [
      {
        name: 'Applicant',
        nationalId: '1234567890',
        relation: 'Spouse',
        enabled: true,
        approved: false,
      },
      {
        name: 'Jane Doe',
        nationalId: '2222222222',
        relation: 'Child',
        enabled: true,
        approved: false,
      },
    ]
    const application = createMockApplication('1234567890', estateMembers)
    expect(getAssigneesNationalIdList(application)).toEqual(['2222222222'])
  })

  it('should exclude members without national ID', () => {
    const estateMembers: EstateMember[] = [
      {
        name: 'John Doe',
        nationalId: '',
        relation: 'Spouse',
        enabled: true,
        approved: false,
      },
      {
        name: 'Jane Doe',
        nationalId: '2222222222',
        relation: 'Child',
        enabled: true,
        approved: false,
      },
    ]
    const application = createMockApplication('1234567890', estateMembers)
    expect(getAssigneesNationalIdList(application)).toEqual(['2222222222'])
  })

  it('should handle complex scenario with multiple filters', () => {
    const estateMembers: EstateMember[] = [
      {
        name: 'Applicant',
        nationalId: '1234567890',
        relation: 'Spouse',
        enabled: true,
        approved: false,
      },
      {
        name: 'Already Approved',
        nationalId: '1111111111',
        relation: 'Child',
        enabled: true,
        approved: true,
      },
      {
        name: 'Disabled Member',
        nationalId: '2222222222',
        relation: 'Child',
        enabled: false,
        approved: false,
      },
      {
        name: 'No National ID',
        nationalId: '',
        relation: 'Child',
        enabled: true,
        approved: false,
      },
      {
        name: 'Valid Assignee 1',
        nationalId: '3333333333',
        relation: 'Child',
        enabled: true,
        approved: false,
      },
      {
        name: 'Valid Assignee 2',
        nationalId: '4444444444',
        relation: 'Child',
        enabled: true,
      },
    ]
    const application = createMockApplication('1234567890', estateMembers)
    expect(getAssigneesNationalIdList(application)).toEqual([
      '3333333333',
      '4444444444',
    ])
  })

  it('should return empty array when all members are filtered out', () => {
    const estateMembers: EstateMember[] = [
      {
        name: 'Applicant',
        nationalId: '1234567890',
        relation: 'Spouse',
        enabled: true,
        approved: false,
      },
      {
        name: 'Already Approved',
        nationalId: '1111111111',
        relation: 'Child',
        enabled: true,
        approved: true,
      },
      {
        name: 'Disabled Member',
        nationalId: '2222222222',
        relation: 'Child',
        enabled: false,
        approved: false,
      },
    ]
    const application = createMockApplication('1234567890', estateMembers)
    expect(getAssigneesNationalIdList(application)).toEqual([])
  })
})
