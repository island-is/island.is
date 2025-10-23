import { ApplicationTemplateHelper } from '@island.is/application/core'
import {
  Application,
  ApplicationStatus,
  ApplicationTypes,
  DefaultEvents,
  ExternalData,
  FormValue,
} from '@island.is/application/types'
import { uuid } from 'uuidv4'
import { ApplicationFeatureKey, PayerOption, States } from '../utils/constants'
import NewPrimarySchoolTemplate from './NewPrimarySchoolTemplate'

const buildApplication = (data: {
  answers?: FormValue
  externalData?: ExternalData
  state?: string
}): Application => {
  const { answers = {}, externalData = {}, state = States.DRAFT } = data
  return {
    id: '12345',
    assignees: [],
    applicant: '123456-7890',
    typeId: ApplicationTypes.NEW_PRIMARY_SCHOOL,
    created: new Date(),
    status: ApplicationStatus.IN_PROGRESS,
    modified: new Date(),
    applicantActors: [],
    answers,
    state,
    externalData,
  }
}

describe('New Primary School Template', () => {
  it('should transition from draft to submitted on submit', () => {
    const helper = new ApplicationTemplateHelper(
      buildApplication({
        state: States.DRAFT,
      }),
      NewPrimarySchoolTemplate,
    )

    const [hasChanged, newState] = helper.changeState({
      type: DefaultEvents.SUBMIT,
    })
    expect(hasChanged).toBe(true)
    expect(newState).toBe(States.SUBMITTED)
  })

  it('should transition from submitted to approved on approve', () => {
    const helper = new ApplicationTemplateHelper(
      buildApplication({
        state: States.SUBMITTED,
      }),
      NewPrimarySchoolTemplate,
    )

    const [hasChanged, newState] = helper.changeState({
      type: DefaultEvents.APPROVE,
    })
    expect(hasChanged).toBe(true)
    expect(newState).toBe(States.APPROVED)
  })

  it('should transition from submitted to rejected on reject', () => {
    const helper = new ApplicationTemplateHelper(
      buildApplication({
        state: States.SUBMITTED,
      }),
      NewPrimarySchoolTemplate,
    )

    const [hasChanged, newState] = helper.changeState({
      type: DefaultEvents.REJECT,
    })
    expect(hasChanged).toBe(true)
    expect(newState).toBe(States.REJECTED)
  })

  it('should transition from draft to payerApproval on submit', () => {
    const schoolId = uuid()
    const helper = new ApplicationTemplateHelper(
      buildApplication({
        state: States.DRAFT,
        answers: {
          newSchool: {
            municipality: '3000',
            school: schoolId,
          },
          payer: {
            option: PayerOption.OTHER,
            other: {
              name: 'John Doe',
              nationalId: '1234567890',
            },
          },
        },
        externalData: {
          schools: {
            data: [
              {
                id: schoolId,
                settings: {
                  applicationConfigs: [
                    {
                      applicationFeatures: [
                        { key: ApplicationFeatureKey.PAYMENT_INFO },
                      ],
                    },
                  ],
                },
              },
            ],
            date: new Date(),
            status: 'success',
          },
        },
      }),
      NewPrimarySchoolTemplate,
    )

    const [hasChanged, newState] = helper.changeState({
      type: DefaultEvents.SUBMIT,
    })
    expect(hasChanged).toBe(true)
    expect(newState).toBe(States.PAYER_APPROVAL)
  })

  it('should transition from payerApproval to submitted on approve', () => {
    const helper = new ApplicationTemplateHelper(
      buildApplication({
        state: States.PAYER_APPROVAL,
        answers: {
          newSchool: {
            municipality: '3000',
            school: uuid(),
          },
          payer: {
            option: PayerOption.OTHER,
            other: {
              name: 'John Doe',
              nationalId: '1234567890',
            },
          },
        },
      }),
      NewPrimarySchoolTemplate,
    )

    const [hasChanged, newState] = helper.changeState({
      type: DefaultEvents.APPROVE,
    })
    expect(hasChanged).toBe(true)
    expect(newState).toBe(States.SUBMITTED)
  })

  it('should transition from payerApproval to payerRejected on reject', () => {
    const helper = new ApplicationTemplateHelper(
      buildApplication({
        state: States.PAYER_APPROVAL,
        answers: {
          newSchool: {
            municipality: '3000',
            school: uuid(),
          },
          payer: {
            option: PayerOption.OTHER,
            other: {
              name: 'John Doe',
              nationalId: '1234567890',
            },
          },
        },
      }),
      NewPrimarySchoolTemplate,
    )

    const [hasChanged, newState] = helper.changeState({
      type: DefaultEvents.REJECT,
    })
    expect(hasChanged).toBe(true)
    expect(newState).toBe(States.PAYER_REJECTED)
  })

  it('should transition from payerRejected to draft on edit', () => {
    const helper = new ApplicationTemplateHelper(
      buildApplication({
        state: States.PAYER_REJECTED,
        answers: {
          newSchool: {
            municipality: '3000',
            school: uuid(),
          },
          payer: {
            option: PayerOption.OTHER,
            other: {
              name: 'John Doe',
              nationalId: '1234567890',
            },
          },
        },
      }),
      NewPrimarySchoolTemplate,
    )

    const [hasChanged, newState] = helper.changeState({
      type: DefaultEvents.EDIT,
    })
    expect(hasChanged).toBe(true)
    expect(newState).toBe(States.DRAFT)
  })
})
