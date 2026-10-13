import { YES } from '@island.is/application/core'
import { expandAnswers } from './mappers'

type SchemaInput = Parameters<typeof expandAnswers>[0]

describe('expandAnswers', () => {
  it('should map spouse fields when includeSpouse is YES', () => {
    const answers = {
      applicationFor: 'prepaidInheritance',
      applicant: {
        email: 'applicant@example.com',
        phone: '+3548994207',
        name: 'Applicant Name',
        nationalId: '0101302209',
        relation: 'grantor',
      },
      executors: {
        includeSpouse: [YES],
        executor: {
          email: 'executor@example.com',
          phone: '+3548994207',
          name: 'Executor Name',
          nationalId: '0101302209',
        },
        spouse: {
          email: 'spouse@example.com',
          phone: '+3548979957',
          name: 'Spouse Name',
          nationalId: '1803723509',
        },
      },
      assets: {
        assetsTotal: 1000000,
      },
      approveExternalData: true,
    } as unknown as SchemaInput

    const result = expandAnswers(answers)

    expect(result.executors.spouse).toEqual({
      email: 'spouse@example.com',
      phone: '+3548979957',
      name: 'Spouse Name',
      nationalId: '1803723509',
    })
  })

  it('should clear spouse fields when includeSpouse is not YES', () => {
    const answers = {
      applicationFor: 'prepaidInheritance',
      applicant: {
        email: 'applicant@example.com',
        phone: '+3548994207',
        name: 'Applicant Name',
        nationalId: '0101302209',
        relation: 'grantor',
      },
      executors: {
        includeSpouse: [],
        executor: {
          email: 'executor@example.com',
          phone: '+3548994207',
          name: 'Executor Name',
          nationalId: '0101302209',
        },
        spouse: {
          email: 'stale_spouse@example.com',
          phone: '+3548979957',
          name: 'Stale Spouse Name',
          nationalId: '1803723509',
        },
      },
      assets: {
        assetsTotal: 1000000,
      },
      approveExternalData: true,
    } as unknown as SchemaInput

    const result = expandAnswers(answers)

    expect(result.executors.spouse).toEqual({
      email: '',
      phone: '',
      name: '',
      nationalId: '',
    })
  })
})
