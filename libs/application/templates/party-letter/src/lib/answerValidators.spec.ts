import { Application, ApplicationTypes } from '@island.is/application/core'
import { answerValidators, PARTY_NATIONAL_ID } from './answerValidators'
import { UserCompany } from '../dataProviders/CurrentUserCompanies'

describe('answerValidators', () => {
  const application: Application = {
    answers: { someAnswer: 'awesome' },
    assignees: [],
    applicant: '1111111111',
    attachments: {},
    created: new Date(),
    externalData: {
      userCompanies: {
        data: [
          {
            ErProkuruhafi: '1',
            Kennitala: '0000000000',
            Nafn: 'Prófum íslenska hluti ohf',
          },
        ] as UserCompany[],
        date: new Date(),
        status: 'success',
      },
    },
    id: '',
    modified: new Date(),
    state: '',
    typeId: ApplicationTypes.EXAMPLE,
  }

  it('should return error when national id is not owned by applicant', () => {
    const newAnswers = '2222222222'

    expect(
      answerValidators[PARTY_NATIONAL_ID](newAnswers, application),
    ).toStrictEqual({
      message: 'You need to select a valid national id for your party',
      path: PARTY_NATIONAL_ID,
    })
  })

  it('should be valid when national id is applicants national id', () => {
    const newAnswers = '1111111111'

    expect(
      answerValidators[PARTY_NATIONAL_ID](newAnswers, application),
    ).toBeUndefined()
  })

  it('should be valid when national id is a company owned by applicant', () => {
    const newAnswers = '0000000000'

    expect(
      answerValidators[PARTY_NATIONAL_ID](newAnswers, application),
    ).toBeUndefined()
  })
})
