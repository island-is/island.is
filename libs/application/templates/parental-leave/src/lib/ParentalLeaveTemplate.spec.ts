import { ApplicationTemplateHelper, NO, YES } from '@island.is/application/core'
import {
  Application,
  ApplicationTypes,
  ExternalData,
  FormValue,
  DefaultEvents,
  ApplicationStatus,
  ApplicationContext,
} from '@island.is/application/types'
import ParentalLeaveTemplate from './ParentalLeaveTemplate'
import {
  ApplicationAction,
  PARENTAL_LEAVE,
  SPOUSE,
  States as ApplicationStates,
  PARENTAL_GRANT,
  PLEvents,
  Roles,
} from '../constants'

import { createNationalId } from '@island.is/testing/fixtures'
import {
  ChildrenApi,
  GetPersonInformation,
  PreviousApplicationApi,
} from '../dataProviders'
import {
  isChangeApplication,
  isResidenceGrantApplication,
} from './parentalLeaveTemplateUtils'

const buildApplication = (data: {
  answers?: FormValue
  externalData?: ExternalData
  state?: string
}): Application => {
  const {
    answers = {},
    externalData = {
      children: {
        data: {
          children: [
            {
              hasRights: true,
              remainingDays: 180,
              parentalRelation: 'primary',
              expectedDateOfBirth: '2022-10-31',
            },
          ],
          existingApplications: [],
        },
        date: new Date('2021-10-31'),
        status: 'success',
      },
    },
    state = 'draft',
  } = data

  return {
    id: '12345',
    assignees: [],
    applicant: '1234567890',
    typeId: ApplicationTypes.PARENTAL_LEAVE,
    created: new Date(),
    modified: new Date(),
    applicantActors: [],
    answers,
    state,
    externalData,
    status: ApplicationStatus.IN_PROGRESS,
  }
}

describe('Parental Leave Application Template', () => {
  describe('state transitions', () => {
    const otherParentId = createNationalId('person')

    it('should auto-approve mock applications at VMST approval', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: {
            mock: { useMockData: YES },
            selectedChild: '0',
            applicationType: { option: PARENTAL_LEAVE },
          },
          state: ApplicationStates.DRAFT,
        }),
        ParentalLeaveTemplate,
      )

      const [hasChanged, newState] = helper.changeState({
        type: DefaultEvents.SUBMIT,
      })

      expect(hasChanged).toBe(true)
      expect(newState).toBe(ApplicationStates.APPROVED)
    })
    it('should transition from draft to other parent if applicant is asking for shared rights', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          externalData: {
            person: {
              data: {
                spouse: {
                  nationalId: otherParentId,
                  name: 'Tester Testerson',
                },
              },
              date: new Date(),
              status: 'success',
            },
            children: {
              data: {
                children: [
                  {
                    hasRights: true,
                    remainingDays: 180,
                    parentalRelation: 'primary',
                    expectedDateOfBirth: '2022-10-31',
                  },
                ],
                existingApplications: [],
              },
              date: new Date('2021-10-31'),
              status: 'success',
            },
          },
          answers: {
            requestRights: {
              isRequestingRights: YES,
            },
            otherParentObj: {
              chooseOtherParent: SPOUSE,
              otherParentId,
            },
            selectedChild: '0',
          },
        }),
        ParentalLeaveTemplate,
      )
      const [hasChanged, newState, newApplication] = helper.changeState({
        type: DefaultEvents.SUBMIT,
      })
      expect(hasChanged).toBe(true)
      expect(newState).toBe(ApplicationStates.OTHER_PARENT_APPROVAL)
      expect(newApplication.assignees).toEqual([otherParentId])
    })

    it('should transition from draft to employer approval if applicant is not asking for shared rights', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: {
            requestRights: {
              isRequestingRights: NO,
            },
            otherParentObj: {
              otherParentId,
            },
            employment: {
              isSelfEmployed: NO,
              isReceivingUnemploymentBenefits: NO,
            },
            applicationType: {
              option: PARENTAL_LEAVE,
            },
          },
        }),
        ParentalLeaveTemplate,
      )
      const [hasChanged, newState, newApplication] = helper.changeState({
        type: DefaultEvents.SUBMIT,
      })
      expect(hasChanged).toBe(true)
      expect(newState).toBe(ApplicationStates.EMPLOYER_WAITING_TO_ASSIGN)
      // There should be no one assigned until employer accepts to be assigned
      expect(newApplication.assignees).toEqual([])
    })

    it('should assign the application to the employer when transitioning to employer approval from other parent approval', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          state: 'draft',
          externalData: {
            person: {
              data: {
                spouse: {
                  nationalId: otherParentId,
                  name: 'Tester Testerson',
                },
              },
              date: new Date(),
              status: 'success',
            },
            children: {
              data: {
                children: [
                  {
                    hasRights: true,
                    remainingDays: 180,
                    parentalRelation: 'primary',
                    expectedDateOfBirth: '2022-10-31',
                  },
                ],
                existingApplications: [],
              },
              date: new Date('2021-10-31'),
              status: 'success',
            },
          },
          answers: {
            requestRights: {
              isRequestingRights: YES,
            },
            otherParentObj: {
              chooseOtherParent: SPOUSE,
              otherParentId,
            },
            employment: {
              isSelfEmployed: NO,
              isReceivingUnemploymentBenefits: NO,
            },
            selectedChild: '0',
            applicationType: {
              option: PARENTAL_LEAVE,
            },
          },
        }),
        ParentalLeaveTemplate,
      )
      const [hasChanged, newState, newApplication] = helper.changeState({
        type: DefaultEvents.SUBMIT,
      })
      expect(hasChanged).toBe(true)
      expect(newState).toBe(ApplicationStates.OTHER_PARENT_APPROVAL)
      expect(newApplication.assignees).toEqual([otherParentId])

      const finalHelper = new ApplicationTemplateHelper(
        newApplication,
        ParentalLeaveTemplate,
      )
      const [hasChangedAgain, finalState, finalApplication] =
        finalHelper.changeState({
          type: DefaultEvents.APPROVE,
        })
      expect(hasChangedAgain).toBe(true)
      expect(finalState).toBe(ApplicationStates.EMPLOYER_WAITING_TO_ASSIGN)
      expect(finalApplication.assignees).toEqual([])
    })

    it('should assign the application to the other parent approval and then to VMST when the applicant is self employed', () => {
      process.env.VMST_ID = createNationalId('company')

      const helper = new ApplicationTemplateHelper(
        buildApplication({
          externalData: {
            person: {
              data: {
                spouse: {
                  nationalId: otherParentId,
                  name: 'Tester Testerson',
                },
              },
              date: new Date(),
              status: 'success',
            },
            children: {
              data: {
                children: [
                  {
                    hasRights: true,
                    remainingDays: 180,
                    parentalRelation: 'primary',
                    expectedDateOfBirth: '2022-10-31',
                  },
                ],
                existingApplications: [],
              },
              date: new Date('2021-10-31'),
              status: 'success',
            },
          },
          answers: {
            requestRights: {
              isRequestingRights: YES,
            },
            otherParentObj: {
              chooseOtherParent: SPOUSE,
              otherParentId,
            },
            employment: {
              isSelfEmployed: YES,
              isReceivingUnemploymentBenefits: NO,
            },
            selectedChild: '0',
            applicationType: {
              option: PARENTAL_LEAVE,
            },
          },
        }),
        ParentalLeaveTemplate,
      )
      const [hasChanged, newState, newApplication] = helper.changeState({
        type: DefaultEvents.SUBMIT,
      })
      expect(hasChanged).toBe(true)
      expect(newState).toBe(ApplicationStates.OTHER_PARENT_APPROVAL)
      expect(newApplication.assignees).toEqual([otherParentId])

      const finalHelper = new ApplicationTemplateHelper(
        newApplication,
        ParentalLeaveTemplate,
      )

      const [hasChangedAgain, finalState] = finalHelper.changeState({
        type: DefaultEvents.APPROVE,
      })

      expect(hasChangedAgain).toBe(true)
      expect(finalState).toBe(ApplicationStates.VINNUMALASTOFNUN_APPROVAL)
    })

    describe('other parent', () => {
      describe('when spouse is selected', () => {
        it('should assign their national registry id from external data to answers.otherParentId when transitioning from draft', () => {
          const helper = new ApplicationTemplateHelper(
            buildApplication({
              externalData: {
                person: {
                  data: {
                    spouse: {
                      nationalId: otherParentId,
                      name: 'Tester Testerson',
                    },
                  },
                  date: new Date(),
                  status: 'success',
                },
              },
              answers: {
                otherParentObj: {
                  chooseOtherParent: SPOUSE,
                },
                employers: [
                  {
                    email: 'selfemployed@test.test',
                  },
                ],
                employment: {
                  isSelfEmployed: YES,
                  isReceivingUnemploymentBenefits: NO,
                },
                applicationType: {
                  option: PARENTAL_LEAVE,
                },
              },
            }),
            ParentalLeaveTemplate,
          )
          const [hasChanged, newState, newApplication] = helper.changeState({
            type: DefaultEvents.SUBMIT,
          })
          const newApplicationOtherParentId = (
            newApplication.answers as {
              otherParentObj: { otherParentId: string }
            }
          )?.otherParentObj?.otherParentId

          expect(hasChanged).toBe(true)
          expect(newState).toBe(ApplicationStates.VINNUMALASTOFNUN_APPROVAL)
          expect(newApplicationOtherParentId).toEqual(otherParentId)
        })
      })
    })

    describe('allowance', () => {
      it('should remove usage and useAsMuchAsPossible on submit, if usePersonalAllowance (FromSpouse) is equal to NO and personalAllowanceFromSpouse exists', () => {
        const helper = new ApplicationTemplateHelper(
          buildApplication({
            answers: {
              personalAllowanceFromSpouse: {
                usePersonalAllowance: NO,
                usage: '33%',
                useAsMuchAsPossible: NO,
              },
              employment: {
                isSelfEmployed: NO,
                isReceivingUnemploymentBenefits: NO,
              },
              applicationType: {
                option: PARENTAL_LEAVE,
              },
            },
          }),
          ParentalLeaveTemplate,
        )

        const answer = {
          usePersonalAllowance: NO,
        }

        const [hasChanged, _, newApplication] = helper.changeState({
          type: DefaultEvents.SUBMIT,
        })
        expect(hasChanged).toBe(true)
        expect(newApplication.answers.personalAllowanceFromSpouse).toEqual(
          answer,
        )
      })

      it('should remove usage and useAsMuchAsPossible on submit, if usePersonalAllowance is equal to NO and personalAllowance exists', () => {
        const helper = new ApplicationTemplateHelper(
          buildApplication({
            answers: {
              personalAllowance: {
                usePersonalAllowance: NO,
                usage: '33%',
                useAsMuchAsPossible: NO,
              },
              employment: {
                isSelfEmployed: NO,
                isReceivingUnemploymentBenefits: NO,
              },
              applicationType: {
                option: PARENTAL_LEAVE,
              },
            },
          }),
          ParentalLeaveTemplate,
        )

        const answer = {
          usePersonalAllowance: NO,
        }

        const [hasChanged, _, newApplication] = helper.changeState({
          type: DefaultEvents.SUBMIT,
        })
        expect(hasChanged).toBe(true)
        expect(newApplication.answers.personalAllowance).toEqual(answer)
      })

      it('should set usage to 100 if useAsMuchAsPossible in personalAllowance is set to YES', () => {
        const helper = new ApplicationTemplateHelper(
          buildApplication({
            answers: {
              personalAllowance: {
                usePersonalAllowance: YES,
                usage: '0',
                useAsMuchAsPossible: YES,
              },
              employment: {
                isSelfEmployed: NO,
                isReceivingUnemploymentBenefits: NO,
              },
              applicationType: {
                option: PARENTAL_LEAVE,
              },
            },
          }),
          ParentalLeaveTemplate,
        )

        const answer = {
          usePersonalAllowance: YES,
          useAsMuchAsPossible: YES,
          usage: '100',
        }

        const [hasChanged, _, newApplication] = helper.changeState({
          type: DefaultEvents.SUBMIT,
        })

        expect(hasChanged).toBe(true)
        expect(newApplication.answers.personalAllowance).toEqual(answer)
      })

      it('should set usage to 100 if useAsMuchAsPossible in personalAllowanceFromSpouse is set to YES', () => {
        const helper = new ApplicationTemplateHelper(
          buildApplication({
            answers: {
              personalAllowanceFromSpouse: {
                usePersonalAllowance: YES,
                usage: '0',
                useAsMuchAsPossible: YES,
              },
            },
          }),
          ParentalLeaveTemplate,
        )

        const answer = {
          usePersonalAllowance: YES,
          useAsMuchAsPossible: YES,
          usage: '100',
        }

        const [hasChanged, _, newApplication] = helper.changeState({
          type: DefaultEvents.SUBMIT,
        })

        expect(hasChanged).toBe(true)
        expect(newApplication.answers.personalAllowanceFromSpouse).toEqual(
          answer,
        )
      })
    })

    describe('privatePensionFund and privatePensionFundPercentage', () => {
      it('should unset privatePensionFund and privatePensionFundPercentage if use usePrivatePensionFund is NO', () => {
        const helper = new ApplicationTemplateHelper(
          buildApplication({
            answers: {
              payments: {
                bank: '123454312300',
                pensionFund: 'id-frjalsi',
                privatePensionFund: '',
                privatePensionFundPercentage: '',
                usePrivatePensionFund: NO,
              },
              applicationType: {
                option: PARENTAL_LEAVE,
              },
            },
          }),
          ParentalLeaveTemplate,
        )

        const answer = {
          bank: '123454312300',
          pensionFund: 'id-frjalsi',
          usePrivatePensionFund: NO,
        }

        const [hasChanged, _, newApplication] = helper.changeState({
          type: DefaultEvents.SUBMIT,
        })

        expect(hasChanged).toBe(true)
        expect(newApplication.answers.payments).toEqual(answer)
      })
    })

    describe('union', () => {
      it('should unset union if useUnion is NO', () => {
        const helper = new ApplicationTemplateHelper(
          buildApplication({
            answers: {
              payments: {
                bank: '123454312300',
                pensionFund: 'id-frjalsi',
                union: '',
                useUnion: NO,
              },
              applicationType: {
                option: PARENTAL_LEAVE,
              },
            },
          }),
          ParentalLeaveTemplate,
        )

        const answer = {
          bank: '123454312300',
          pensionFund: 'id-frjalsi',
          useUnion: NO,
        }

        const [hasChanged, _, newApplication] = helper.changeState({
          type: DefaultEvents.SUBMIT,
        })

        expect(hasChanged).toBe(true)
        expect(newApplication.answers.payments).toEqual(answer)
      })
    })

    describe('isSelfEmployed', () => {
      it('should set isReceivingUnemploymentBenefits to NO and unset unemploymentBenefits if isSelfEmployed is YES', () => {
        const helper = new ApplicationTemplateHelper(
          buildApplication({
            answers: {
              employment: {
                isSelfEmployed: YES,
                isReceivingUnemploymentBenefits: YES,
                unemploymentBenefits: 'Vinnumálastofnun (atvinnuleysisbætur)',
              },
              fileUpload: {
                selfEmployedFile: [],
              },
              applicationType: {
                option: PARENTAL_LEAVE,
              },
            },
          }),
          ParentalLeaveTemplate,
        )

        const answer = {
          employment: {
            isSelfEmployed: YES,
            isReceivingUnemploymentBenefits: NO,
          },
          fileUpload: {
            selfEmployedFile: [],
          },
          applicationType: {
            option: PARENTAL_LEAVE,
          },
        }

        const [hasChanged, _, newApplication] = helper.changeState({
          type: DefaultEvents.SUBMIT,
        })

        expect(hasChanged).toBe(true)
        expect(newApplication.answers).toEqual(answer)
      })
      it('should unset selfEmployedFile if isSelfEmployed is NO', () => {
        const helper = new ApplicationTemplateHelper(
          buildApplication({
            answers: {
              employment: {
                isSelfEmployed: NO,
                isReceivingUnemploymentBenefits: NO,
              },
              fileUpload: {
                selfEmployedFile: [],
              },
              applicationType: {
                option: PARENTAL_LEAVE,
              },
            },
          }),
          ParentalLeaveTemplate,
        )

        const answer = {
          employment: {
            isSelfEmployed: NO,
            isReceivingUnemploymentBenefits: NO,
          },
          fileUpload: {},
          applicationType: {
            option: PARENTAL_LEAVE,
          },
        }

        const [hasChanged, _, newApplication] = helper.changeState({
          type: DefaultEvents.SUBMIT,
        })

        expect(hasChanged).toBe(true)
        expect(newApplication.answers).toEqual(answer)
      })
    })

    describe('isReceivingUnemploymentBenefits', () => {
      it('should unset unemploymentBenefits and benefitsFile if isReceivingUnemploymentBenefits is NO', () => {
        const helper = new ApplicationTemplateHelper(
          buildApplication({
            answers: {
              employment: {
                isSelfEmployed: NO,
                isReceivingUnemploymentBenefits: NO,
                unemploymentBenefits: 'Vinnumálastofnun (atvinnuleysisbætur)',
              },
              fileUpload: {
                benefitsFile: [],
              },
              applicationType: {
                option: PARENTAL_LEAVE,
              },
            },
          }),
          ParentalLeaveTemplate,
        )

        const answer = {
          employment: {
            isSelfEmployed: NO,
            isReceivingUnemploymentBenefits: NO,
          },
          fileUpload: {},
          applicationType: {
            option: PARENTAL_LEAVE,
          },
        }

        const [hasChanged, _, newApplication] = helper.changeState({
          type: DefaultEvents.SUBMIT,
        })

        expect(hasChanged).toBe(true)
        expect(newApplication.answers).toEqual(answer)
      })
    })

    describe('unemploymentBenefits', () => {
      it('should unset benefitsFile if unemploymentBenefits is not union or healthInsurance', () => {
        const helper = new ApplicationTemplateHelper(
          buildApplication({
            answers: {
              employment: {
                isSelfEmployed: NO,
                isReceivingUnemploymentBenefits: YES,
                unemploymentBenefits: 'Vinnumálastofnun (atvinnuleysisbætur)',
              },
              fileUpload: {
                benefitsFile: [],
              },
              applicationType: {
                option: PARENTAL_LEAVE,
              },
            },
          }),
          ParentalLeaveTemplate,
        )

        const answer = {
          employment: {
            isSelfEmployed: NO,
            isReceivingUnemploymentBenefits: YES,
            unemploymentBenefits: 'Vinnumálastofnun (atvinnuleysisbætur)',
          },
          fileUpload: {},
          applicationType: {
            option: PARENTAL_LEAVE,
          },
        }

        const [hasChanged, _, newApplication] = helper.changeState({
          type: DefaultEvents.SUBMIT,
        })

        expect(hasChanged).toBe(true)
        expect(newApplication.answers).toEqual(answer)
      })
    })

    describe('employers', () => {
      it('should unset employers if isSelfEmployed is YES', () => {
        const helper = new ApplicationTemplateHelper(
          buildApplication({
            answers: {
              employers: [
                {
                  email: 'testEmail@test.is',
                  ratio: '100',
                  phoneNumber: '',
                },
              ],
              employment: {
                isSelfEmployed: YES,
                isReceivingUnemploymentBenefits: NO,
              },
              fileUpload: {
                selfEmployedFile: [],
              },
              applicationType: {
                option: PARENTAL_LEAVE,
              },
            },
          }),
          ParentalLeaveTemplate,
        )

        const answer = {
          employment: {
            isSelfEmployed: YES,
            isReceivingUnemploymentBenefits: NO,
          },
          fileUpload: {
            selfEmployedFile: [],
          },
          applicationType: {
            option: PARENTAL_LEAVE,
          },
        }

        const [hasChanged, _, newApplication] = helper.changeState({
          type: DefaultEvents.SUBMIT,
        })

        expect(hasChanged).toBe(true)
        expect(newApplication.answers).toEqual(answer)
      })
      it('should unset employers if isReceivingUnemploymentBenefits is YES', () => {
        const helper = new ApplicationTemplateHelper(
          buildApplication({
            answers: {
              employers: [
                {
                  email: 'testEmail@test.is',
                  ratio: '100',
                  phoneNumber: '',
                },
              ],
              employment: {
                isSelfEmployed: NO,
                unemploymentBenefits: 'Vinnumálastofnun (atvinnuleysisbætur)',
                isReceivingUnemploymentBenefits: YES,
              },
              fileUpload: {},
              applicationType: {
                option: PARENTAL_LEAVE,
              },
            },
          }),
          ParentalLeaveTemplate,
        )

        const answer = {
          employment: {
            isSelfEmployed: NO,
            unemploymentBenefits: 'Vinnumálastofnun (atvinnuleysisbætur)',
            isReceivingUnemploymentBenefits: YES,
          },
          fileUpload: {},
          applicationType: {
            option: PARENTAL_LEAVE,
          },
        }

        const [hasChanged, _, newApplication] = helper.changeState({
          type: DefaultEvents.SUBMIT,
        })

        expect(hasChanged).toBe(true)
        expect(newApplication.answers).toEqual(answer)
      })
      it('should unset employers and employmentTerminationCertificateFile if employerLastSixMonths is NO', () => {
        const helper = new ApplicationTemplateHelper(
          buildApplication({
            answers: {
              employerLastSixMonths: NO,
              employers: [
                {
                  email: 'testEmail@test.is',
                  ratio: '100',
                  phoneNumber: '',
                  stillEmployed: NO,
                },
              ],
              fileUpload: {
                employmentTerminationCertificateFile: [],
              },
              applicationType: {
                option: PARENTAL_GRANT,
              },
            },
          }),
          ParentalLeaveTemplate,
        )

        const answer = {
          employerLastSixMonths: NO,
          fileUpload: {},
          applicationType: {
            option: PARENTAL_GRANT,
          },
        }

        const [hasChanged, _, newApplication] = helper.changeState({
          type: DefaultEvents.SUBMIT,
        })

        expect(hasChanged).toBe(true)
        expect(newApplication.answers).toEqual(answer)
      })
    })
  })

  describe('edit flow', () => {
    const CHANGE_ANSWERS = {
      applicationAction: ApplicationAction.CHANGE,
      previousApplicationId: 'previous-app-id',
      vmstApplicationId: 'root-app-id',
    }

    it('should resolve the child index from the predecessor on the way out of prerequisites', () => {
      // If this match fails, `selectedChild` stays unset and everything downstream
      // that needs the child throws "Missing selected child".
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: { applicationAction: ApplicationAction.CHANGE },
          externalData: {
            children: {
              data: {
                children: [
                  {
                    hasRights: true,
                    remainingDays: 180,
                    parentalRelation: 'primary',
                    expectedDateOfBirth: '2027-03-04',
                    existingApplicationId: 'previous-application-id',
                  },
                ],
                existingApplications: [],
              },
              date: new Date(),
              status: 'success',
            },
            previousApplication: {
              data: {
                applicationId: 'previous-application-id',
                vmstApplicationId: 'root-application-id',
                applicationFundId: '2025-03076',
                selectedChild: { expectedDateOfBirth: '2027-03-04' },
                answers: { periods: [] },
              },
              date: new Date(),
              status: 'success',
            },
          },
          state: ApplicationStates.PREREQUISITES,
        }),
        ParentalLeaveTemplate,
      )

      const [hasChanged, newState, newApplication] = helper.changeState({
        type: DefaultEvents.SUBMIT,
      })

      expect(hasChanged).toBe(true)
      expect(newState).toBe(ApplicationStates.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS)
      expect(newApplication.answers.selectedChild).toBe('0')
      expect(newApplication.answers.vmstApplicationId).toBe(
        'root-application-id',
      )
      expect(newApplication.answers.previousApplicationId).toBe(
        'previous-application-id',
      )
    })

    it('should go from prerequisites straight into the change form when the application is a change', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: {
            ...CHANGE_ANSWERS,
            selectedChild: '0',
          },
          state: ApplicationStates.PREREQUISITES,
        }),
        ParentalLeaveTemplate,
      )

      const [hasChanged, newState] = helper.changeState({
        type: DefaultEvents.SUBMIT,
      })

      expect(hasChanged).toBe(true)
      expect(newState).toBe(ApplicationStates.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS)
    })

    it('should go from prerequisites into the draft form when the application is a first-time application', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: { selectedChild: '0' },
          state: ApplicationStates.PREREQUISITES,
        }),
        ParentalLeaveTemplate,
      )

      const [hasChanged, newState] = helper.changeState({
        type: DefaultEvents.SUBMIT,
      })

      expect(hasChanged).toBe(true)
      expect(newState).toBe(ApplicationStates.DRAFT)
    })

    it('should go from prerequisites into the residence grant form when the application is a residence grant', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: {
            applicationAction: ApplicationAction.RESIDENCE_GRANT,
            previousApplicationId: 'previous-app-id',
            selectedChild: '0',
          },
          state: ApplicationStates.PREREQUISITES,
        }),
        ParentalLeaveTemplate,
      )

      const [hasChanged, newState] = helper.changeState({
        type: DefaultEvents.SUBMIT,
      })

      expect(hasChanged).toBe(true)
      expect(newState).toBe(
        ApplicationStates.RESIDENCE_GRANT_APPLICATION_NO_BIRTH_DATE,
      )
    })

    it('should sync periods from VMST when entering the change form', () => {
      const vmstPeriods = [
        {
          to: '2026-04-30',
          days: '30',
          from: '2026-04-01',
          paid: false,
          ratio: '100',
          approved: true,
          firstPeriodStart: 'specific_date',
          rightsCodePeriod: 'FSAL-GR',
        },
      ]

      const expectedPeriods = [
        {
          ratio: '100',
          paid: false,
          rawIndex: 0,
          approved: true,
          daysToUse: '30',
          endDate: '2026-04-30',
          startDate: '2026-04-01',
          rightCodePeriod: 'FSAL-GR',
        },
      ]

      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: {
            ...CHANGE_ANSWERS,
            selectedChild: '0',
            periods: [
              {
                ratio: '100',
                endDate: '2026-04-15',
                startDate: '2026-04-01',
              },
              {
                ratio: '100',
                endDate: '2026-04-30',
                startDate: '2026-04-16',
              },
            ],
            validatedPeriods: [
              {
                ratio: '100',
                endDate: '2026-04-15',
                startDate: '2026-04-01',
              },
            ],
          },
          externalData: {
            children: {
              data: {
                children: [
                  {
                    hasRights: true,
                    remainingDays: 180,
                    parentalRelation: 'primary',
                    expectedDateOfBirth: '2022-10-31',
                  },
                ],
                existingApplications: [],
              },
              date: new Date('2021-10-31'),
              status: 'success',
            },
            VMSTPeriods: {
              data: vmstPeriods,
              date: new Date('2026-04-20T00:00:00Z'),
              status: 'success',
            },
          },
          state: ApplicationStates.PREREQUISITES,
        }),
        ParentalLeaveTemplate,
      )

      const [hasChanged, newState, newApplication] = helper.changeState({
        type: DefaultEvents.SUBMIT,
      })

      expect(hasChanged).toBe(true)
      expect(newState).toBe(ApplicationStates.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS)
      expect(newApplication.answers.periods).toEqual(expectedPeriods)
      expect(newApplication.answers.validatedPeriods).toBeUndefined()
    })

    it('should not resync periods from VMST when coming back from an employer rejection', () => {
      // The periods in the application are the change the applicant proposed and
      // VMST has not seen them yet, so syncing would discard the very edit they
      // came back to fix.
      const proposedPeriods = [
        {
          ratio: '100',
          endDate: '2026-04-15',
          startDate: '2026-04-01',
        },
      ]

      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: {
            ...CHANGE_ANSWERS,
            selectedChild: '0',
            periods: proposedPeriods,
          },
          externalData: {
            children: {
              data: {
                children: [
                  {
                    hasRights: true,
                    remainingDays: 180,
                    parentalRelation: 'primary',
                    expectedDateOfBirth: '2022-10-31',
                  },
                ],
                existingApplications: [],
              },
              date: new Date('2021-10-31'),
              status: 'success',
            },
            VMSTPeriods: {
              data: [
                {
                  to: '2026-04-30',
                  days: '30',
                  from: '2026-04-01',
                  paid: false,
                  ratio: '100',
                  approved: true,
                  firstPeriodStart: 'specific_date',
                  rightsCodePeriod: 'FSAL-GR',
                },
              ],
              date: new Date('2026-04-20T00:00:00Z'),
              status: 'success',
            },
          },
          state: ApplicationStates.EMPLOYER_EDITS_ACTION,
        }),
        ParentalLeaveTemplate,
      )

      const [hasChanged, newState, newApplication] = helper.changeState({
        type: DefaultEvents.EDIT,
      })

      expect(hasChanged).toBe(true)
      expect(newState).toBe(ApplicationStates.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS)
      expect(newApplication.answers.periods).toEqual(proposedPeriods)
    })

    it('should close a pre-submit change draft when the applicant cancels', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: {
            ...CHANGE_ANSWERS,
            employers: [{ email: 'testEmail1@test.is', ratio: '100' }],
            periods: [
              {
                ratio: '100',
                endDate: '2021-05-15T00:00:00Z',
                startDate: '2021-01-15',
              },
            ],
            changeEmployer: true,
            fileUpload: {
              changeEmployerFile: [],
            },
          },
          state: ApplicationStates.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS,
        }),
        ParentalLeaveTemplate,
      )

      const [hasChanged, newState, newApplication] = helper.changeState({
        type: DefaultEvents.ABORT,
      })

      expect(hasChanged).toBe(true)
      expect(newState).toBe(ApplicationStates.CLOSED)
      expect(newApplication.answers.changeEmployer).toBeUndefined()
    })

    it('should restore the submitted change baseline when the applicant cancels', () => {
      const baselineAnswers = {
        ...CHANGE_ANSWERS,
        employment: {
          isSelfEmployed: NO,
          isReceivingUnemploymentBenefits: NO,
        },
        employers: [{ email: 'baseline@test.is', ratio: '50' }],
        periods: [
          {
            ratio: '50',
            endDate: '2021-05-10T00:00:00Z',
            startDate: '2021-01-10',
          },
        ],
      }
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: {
            ...baselineAnswers,
            employers: [{ email: 'changed@test.is', ratio: '100' }],
            periods: [
              {
                ratio: '100',
                endDate: '2021-05-15T00:00:00Z',
                startDate: '2021-01-15',
              },
            ],
            changeEmployer: true,
          },
          externalData: {
            inPlaceRewind: {
              data: { value: true },
              status: 'success',
              date: new Date(),
            },
            previousApplication: {
              data: { answers: baselineAnswers },
              status: 'success',
              date: new Date(),
            },
          },
          state: ApplicationStates.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS,
        }),
        ParentalLeaveTemplate,
      )

      const [hasChanged, newState, newApplication] = helper.changeState({
        type: DefaultEvents.ABORT,
      })

      expect(hasChanged).toBe(true)
      expect(newState).toBe(ApplicationStates.VINNUMALASTOFNUN_APPROVE_EDITS)
      expect(newApplication.answers.employers).toEqual(
        baselineAnswers.employers,
      )
      expect(newApplication.answers.periods).toEqual([
        expect.objectContaining(baselineAnswers.periods[0]),
      ])
      expect(newApplication.answers.changeEmployer).toBeUndefined()
    })

    it('should return the applicant to the change form when they discard edits after an employer rejection', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: {
            ...CHANGE_ANSWERS,
            changeEmployer: true,
          },
          state: ApplicationStates.EMPLOYER_EDITS_ACTION,
        }),
        ParentalLeaveTemplate,
      )

      const [hasChanged, newState, newApplication] = helper.changeState({
        type: DefaultEvents.ABORT,
      })

      expect(hasChanged).toBe(true)
      expect(newState).toBe(ApplicationStates.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS)
      expect(newApplication.answers.changeEmployer).toBeUndefined()
    })

    it('should not offer EDIT out of a state whose action VMST has already approved', () => {
      // Once VMST has approved, a further change is a further application. The
      // states waiting for VMST are still editable because VMST has not acted on
      // them yet.
      const terminalStates = [ApplicationStates.APPROVED]

      terminalStates.forEach((state) => {
        const helper = new ApplicationTemplateHelper(
          buildApplication({ answers: { selectedChild: '0' }, state }),
          ParentalLeaveTemplate,
        )

        expect(() =>
          helper.changeState({ type: DefaultEvents.EDIT }),
        ).toThrowError(`EDIT is invalid for state ${state}`)
      })
    })

    it('should rewind vinnumalastofnunApproval to draft on EDIT', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: { selectedChild: '0' },
          state: ApplicationStates.VINNUMALASTOFNUN_APPROVAL,
        }),
        ParentalLeaveTemplate,
      )

      const [hasChanged, newState] = helper.changeState({
        type: DefaultEvents.EDIT,
      })

      expect(hasChanged).toBe(true)
      expect(newState).toBe(ApplicationStates.DRAFT)
    })

    it('should return a residence grant to the residence grant form on EDIT', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: {
            applicationAction: ApplicationAction.RESIDENCE_GRANT,
            selectedChild: '0',
          },
          state: ApplicationStates.VINNUMALASTOFNUN_APPROVAL,
        }),
        ParentalLeaveTemplate,
      )

      const [hasChanged, newState] = helper.changeState({
        type: DefaultEvents.EDIT,
      })

      expect(hasChanged).toBe(true)
      expect(newState).toBe(ApplicationStates.RESIDENCE_GRANT_APPLICATION)
    })

    it('should return an application to initial VMST review after additional documents are submitted', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: { selectedChild: '0' },
          state: ApplicationStates.VINNUMALASTOFNUN_APPROVAL,
        }),
        ParentalLeaveTemplate,
      )

      const [, additionalDocumentsState, additionalDocumentsApplication] =
        helper.changeState({
          type: PLEvents.ADDITIONALDOCUMENTSREQUIRED,
        })

      expect(additionalDocumentsState).toBe(
        ApplicationStates.ADDITIONAL_DOCUMENTS_REQUIRED,
      )

      const additionalDocumentsHelper = new ApplicationTemplateHelper(
        additionalDocumentsApplication,
        ParentalLeaveTemplate,
      )
      const [hasChanged, newState] = additionalDocumentsHelper.changeState({
        type: DefaultEvents.APPROVE,
      })

      expect(hasChanged).toBe(true)
      expect(newState).toBe(ApplicationStates.VINNUMALASTOFNUN_APPROVAL)
    })

    it('should return legacy applications to draft without normalizing self-employment answers on entry', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: { selectedChild: '0', isSelfEmployed: NO },
          state: ApplicationStates.VINNUMALASTOFNUN_APPROVAL,
        }),
        ParentalLeaveTemplate,
      )

      const [, , newApplication] = helper.changeState({
        type: DefaultEvents.EDIT,
      })

      expect(newApplication.state).toBe(ApplicationStates.DRAFT)
      expect(newApplication.answers.employment).toBeUndefined()
      expect(newApplication.answers.selfEmployedCheckbox).toBeUndefined()
    })

    it('should rewind vinnumalastofnunApproveEdits to the after-submit change form on EDIT so the applicant edits the same change without being able to delete it', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: { ...CHANGE_ANSWERS, selectedChild: '0' },
          state: ApplicationStates.VINNUMALASTOFNUN_APPROVE_EDITS,
        }),
        ParentalLeaveTemplate,
      )

      const [hasChanged, newState] = helper.changeState({
        type: DefaultEvents.EDIT,
      })

      expect(hasChanged).toBe(true)
      expect(newState).toBe(ApplicationStates.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS)
    })

    it('should return a residence grant edit to the residence grant form from VMST approve edits', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: {
            applicationAction: ApplicationAction.RESIDENCE_GRANT,
            selectedChild: '0',
          },
          state: ApplicationStates.VINNUMALASTOFNUN_APPROVE_EDITS,
        }),
        ParentalLeaveTemplate,
      )

      const [hasChanged, newState] = helper.changeState({
        type: DefaultEvents.EDIT,
      })

      expect(hasChanged).toBe(true)
      expect(newState).toBe(ApplicationStates.RESIDENCE_GRANT_APPLICATION)
    })

    it('should return an edit application to VMST edit review after additional documents are submitted', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: { ...CHANGE_ANSWERS, selectedChild: '0' },
          state: ApplicationStates.VINNUMALASTOFNUN_APPROVE_EDITS,
        }),
        ParentalLeaveTemplate,
      )

      const [, additionalDocumentsState, additionalDocumentsApplication] =
        helper.changeState({
          type: PLEvents.ADDITIONALDOCUMENTSREQUIRED,
        })

      expect(additionalDocumentsState).toBe(
        ApplicationStates.ADDITIONAL_DOCUMENTS_REQUIRED_FOR_EDITS,
      )

      const additionalDocumentsHelper = new ApplicationTemplateHelper(
        additionalDocumentsApplication,
        ParentalLeaveTemplate,
      )
      const [hasChanged, newState] = additionalDocumentsHelper.changeState({
        type: DefaultEvents.APPROVE,
      })

      expect(hasChanged).toBe(true)
      expect(newState).toBe(ApplicationStates.VINNUMALASTOFNUN_APPROVE_EDITS)
    })

    it('should not snapshot a change baseline when an initial application returns to draft', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: {
            selectedChild: '0',
            periods: [
              { startDate: '2027-04-06', endDate: '2027-04-20', ratio: '100' },
            ],
          },
          state: ApplicationStates.VINNUMALASTOFNUN_APPROVAL,
        }),
        ParentalLeaveTemplate,
      )

      const [, , newApplication] = helper.changeState({
        type: DefaultEvents.EDIT,
      })

      const snapshottedPeriods = (
        newApplication.externalData as unknown as Record<
          string,
          { data?: { answers?: { periods?: unknown[] } } }
        >
      ).rewindBaseline?.data?.answers?.periods

      expect(newApplication.state).toBe(ApplicationStates.DRAFT)
      expect(snapshottedPeriods).toBeUndefined()
    })

    it('should assign the application to the employer when the user submits their edits', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: {
            employment: {
              isSelfEmployed: NO,
              isReceivingUnemploymentBenefits: NO,
            },
            applicationType: {
              option: PARENTAL_LEAVE,
            },
            fileUpload: {
              changeEmployerFile: [],
            },
          },
          state: ApplicationStates.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS,
        }),
        ParentalLeaveTemplate,
      )

      const [hasChanged, newState] = helper.changeState({
        type: DefaultEvents.SUBMIT,
      })
      expect(hasChanged).toBe(true)
      expect(newState).toBe(
        ApplicationStates.EMPLOYER_WAITING_TO_ASSIGN_FOR_EDITS,
      )
    })

    // The employer has been notified but VMST has not been sent this change, so a
    // follow-up applicant walking away should be able to delete the draft rather
    // than wait 970 days for it to prune.
    it.each([
      ApplicationStates.EMPLOYER_WAITING_TO_ASSIGN_FOR_EDITS,
      ApplicationStates.EMPLOYER_APPROVE_EDITS,
      ApplicationStates.EMPLOYER_EDITS_ACTION,
    ])(
      'should rewind %s to the delete-allowed change form for a follow-up change on EDIT',
      (state) => {
        const helper = new ApplicationTemplateHelper(
          buildApplication({
            answers: { ...CHANGE_ANSWERS, selectedChild: '0' },
            state,
          }),
          ParentalLeaveTemplate,
        )

        const [, newState] = helper.changeState({ type: DefaultEvents.EDIT })

        expect(newState).toBe(
          ApplicationStates.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS,
        )
      },
    )

    // Same states, review of an edit/residence-grant application: VMST holds
    // this record so the rewind must keep landing in a no-delete state.
    it.each([
      ApplicationStates.EMPLOYER_WAITING_TO_ASSIGN_FOR_EDITS,
      ApplicationStates.EMPLOYER_APPROVE_EDITS,
      ApplicationStates.EMPLOYER_EDITS_ACTION,
    ])(
      'should rewind %s to the no-delete change form for an edit application on EDIT',
      (state) => {
        const helper = new ApplicationTemplateHelper(
          buildApplication({
            answers: { selectedChild: '0' },
            state,
          }),
          ParentalLeaveTemplate,
        )

        const [, newState] = helper.changeState({ type: DefaultEvents.EDIT })

        expect(newState).toBe(
          ApplicationStates.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS,
        )
      },
    )

    it('should rewind vinnumalastofnunAction to draft on EDIT so the applicant can fix or delete the rejected submission', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: { selectedChild: '0' },
          state: ApplicationStates.VINNUMALASTOFNUN_ACTION,
        }),
        ParentalLeaveTemplate,
      )

      const [hasChanged, newState] = helper.changeState({
        type: DefaultEvents.EDIT,
      })

      expect(hasChanged).toBe(true)
      expect(newState).toBe(ApplicationStates.DRAFT)
    })

    it('should return vinnumalastofnunAction corrections to initial VMST review on submit', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: { selectedChild: '0' },
          state: ApplicationStates.VINNUMALASTOFNUN_ACTION,
        }),
        ParentalLeaveTemplate,
      )

      const [, , correctionApplication] = helper.changeState({
        type: DefaultEvents.EDIT,
      })
      const correctionHelper = new ApplicationTemplateHelper(
        correctionApplication,
        ParentalLeaveTemplate,
      )

      const [hasChanged, newState] = correctionHelper.changeState({
        type: DefaultEvents.SUBMIT,
      })

      expect(hasChanged).toBe(true)
      expect(newState).toBe(ApplicationStates.VINNUMALASTOFNUN_APPROVAL)
    })

    it('should not offer ABORT from draft after a VMST rejection', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: { selectedChild: '0' },
          state: ApplicationStates.VINNUMALASTOFNUN_ACTION,
        }),
        ParentalLeaveTemplate,
      )

      const [, , correctionApplication] = helper.changeState({
        type: DefaultEvents.EDIT,
      })
      const correctionHelper = new ApplicationTemplateHelper(
        correctionApplication,
        ParentalLeaveTemplate,
      )

      expect(() =>
        correctionHelper.changeState({ type: DefaultEvents.ABORT }),
      ).toThrowError(`ABORT is invalid for state ${ApplicationStates.DRAFT}`)
    })

    it('should return initial VMST review corrections to initial VMST review on submit', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: { selectedChild: '0' },
          state: ApplicationStates.VINNUMALASTOFNUN_APPROVAL,
        }),
        ParentalLeaveTemplate,
      )

      const [, , correctionApplication] = helper.changeState({
        type: DefaultEvents.EDIT,
      })
      const correctionHelper = new ApplicationTemplateHelper(
        correctionApplication,
        ParentalLeaveTemplate,
      )

      const [hasChanged, newState] = correctionHelper.changeState({
        type: DefaultEvents.SUBMIT,
      })

      expect(hasChanged).toBe(true)
      expect(newState).toBe(ApplicationStates.VINNUMALASTOFNUN_APPROVAL)
    })

    it('should keep edit corrections in VMST edit review on submit', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: { ...CHANGE_ANSWERS, selectedChild: '0' },
          state: ApplicationStates.VINNUMALASTOFNUN_APPROVE_EDITS,
        }),
        ParentalLeaveTemplate,
      )

      const [, , correctionApplication] = helper.changeState({
        type: DefaultEvents.EDIT,
      })
      const correctionHelper = new ApplicationTemplateHelper(
        correctionApplication,
        ParentalLeaveTemplate,
      )

      const [hasChanged, newState] = correctionHelper.changeState({
        type: DefaultEvents.SUBMIT,
      })

      expect(hasChanged).toBe(true)
      expect(newState).toBe(ApplicationStates.VINNUMALASTOFNUN_APPROVE_EDITS)
    })

    it('should keep edit corrections in VMST edit review on abort', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: { ...CHANGE_ANSWERS, selectedChild: '0' },
          state: ApplicationStates.VINNUMALASTOFNUN_APPROVE_EDITS,
        }),
        ParentalLeaveTemplate,
      )

      const [, , correctionApplication] = helper.changeState({
        type: DefaultEvents.EDIT,
      })
      const correctionHelper = new ApplicationTemplateHelper(
        correctionApplication,
        ParentalLeaveTemplate,
      )

      const [hasChanged, newState] = correctionHelper.changeState({
        type: DefaultEvents.ABORT,
      })

      expect(hasChanged).toBe(true)
      expect(newState).toBe(ApplicationStates.VINNUMALASTOFNUN_APPROVE_EDITS)
    })

    // General-info-only edits (email, payments, allowance, etc.) skip the employer
    // and go straight to VMST — the employer only cares about periods, employers,
    // and self-employment status.
    it('should skip the employer when a change touches nothing employer-relevant', () => {
      const employment = {
        isSelfEmployed: NO,
        isReceivingUnemploymentBenefits: NO,
      }
      const baselinePeriods = [
        { ratio: '100', endDate: '2027-04-20', startDate: '2027-04-06' },
      ]
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: {
            ...CHANGE_ANSWERS,
            selectedChild: '0',
            employment,
            applicationType: { option: PARENTAL_LEAVE },
            periods: baselinePeriods,
            applicant: { email: 'new-email@island.is' },
          },
          externalData: {
            previousApplication: {
              data: {
                answers: { employment, periods: baselinePeriods },
              },
              status: 'success',
              date: new Date(),
            },
          },
          state: ApplicationStates.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS,
        }),
        ParentalLeaveTemplate,
      )

      const [, newState] = helper.changeState({ type: DefaultEvents.SUBMIT })

      expect(newState).toBe(ApplicationStates.VINNUMALASTOFNUN_APPROVE_EDITS)
    })

    it('should ignore synthetic employer rows for unchanged self-employed follow-ups', () => {
      const periods = [
        {
          ratio: '100',
          endDate: '2027-12-31',
          startDate: '2027-11-08',
          paid: false,
          approved: true,
          rawIndex: 0,
          daysToUse: '53',
          rightCodePeriod: 'M-S-GR',
        },
      ]
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: {
            ...CHANGE_ANSWERS,
            selectedChild: '0',
            applicationType: { option: PARENTAL_LEAVE },
            employment: { isSelfEmployed: YES },
            periods,
            employers: [
              {
                email: 'mockEmail@island.is',
                ratio: '',
                companyNationalRegistryId: '0101302719',
              },
            ],
          },
          externalData: {
            VMSTApplicationInformation: {
              data: {
                email: 'mockEmail@island.is',
                phoneNumber: '8663887',
                paymentInfo: {
                  bankAccount: '821039810293',
                  personalAllowance: 100,
                  personalAllowanceFromSpouse: 0,
                  union: { id: 'F511', name: '' },
                  pensionFund: { id: 'L030', name: '' },
                  privatePensionFund: { id: 'X135', name: '' },
                  privatePensionFundRatio: 2,
                },
                periods: [
                  {
                    from: '2027-11-08',
                    to: '2027-12-31',
                    ratio: '100',
                    firstPeriodStart: 'estimatedDateOfBirth',
                    rightsCodePeriod: 'M-S-GR,ORLOF-FBF',
                    days: '53',
                    paid: false,
                    approved: true,
                  },
                ],
                employers: [
                  {
                    email: 'mockEmail@island.is',
                    nationalRegistryId: '0101302719',
                  },
                ],
                applicationRights: [
                  {
                    rightsUnit: 'M-S-GR',
                    rightsDescription: 'Grunnréttur móður sjálfst.',
                    months: '6.0',
                    days: '180',
                    daysLeft: '127',
                  },
                ],
              },
              status: 'success',
              date: new Date(),
            },
          },
          state: ApplicationStates.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS,
        }),
        ParentalLeaveTemplate,
      )

      const [, newState] = helper.changeState({ type: DefaultEvents.SUBMIT })

      expect(newState).toBe(ApplicationStates.VINNUMALASTOFNUN_APPROVE_EDITS)
    })

    it('should route through the employer when periods differ from the baseline', () => {
      const employment = {
        isSelfEmployed: NO,
        isReceivingUnemploymentBenefits: NO,
      }
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: {
            ...CHANGE_ANSWERS,
            selectedChild: '0',
            employment,
            applicationType: { option: PARENTAL_LEAVE },
            periods: [
              { ratio: '100', endDate: '2027-04-30', startDate: '2027-04-06' },
            ],
          },
          externalData: {
            previousApplication: {
              data: {
                answers: {
                  employment,
                  periods: [
                    {
                      ratio: '100',
                      endDate: '2027-04-20',
                      startDate: '2027-04-06',
                    },
                  ],
                },
              },
              status: 'success',
              date: new Date(),
            },
          },
          state: ApplicationStates.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS,
        }),
        ParentalLeaveTemplate,
      )

      const [, newState] = helper.changeState({ type: DefaultEvents.SUBMIT })

      expect(newState).toBe(
        ApplicationStates.EMPLOYER_WAITING_TO_ASSIGN_FOR_EDITS,
      )
    })
  })

  describe('child not in the registry data', () => {
    it('should point selectedChild at the synthesized child on the way out of prerequisites', () => {
      // setChildrenInformation replaces the children list with a single
      // synthesized child, so the CHILD_NOT_IN_DATA sentinel has to be replaced
      // with its index or getSelectedChild returns null downstream.
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: {
            selectedChild: 'new',
            noChildrenFound: { typeOfApplication: 'primary_adoption' },
            fosterCareOrAdoption: {
              birthDate: '2027-01-01',
              adoptionDate: '2027-06-01',
            },
          },
          state: ApplicationStates.PREREQUISITES,
        }),
        ParentalLeaveTemplate,
      )

      const [hasChanged, newState, newApplication] = helper.changeState({
        type: DefaultEvents.SUBMIT,
      })

      expect(hasChanged).toBe(true)
      expect(newState).toBe(ApplicationStates.DRAFT)
      expect(newApplication.answers.selectedChild).toBe('0')
    })

    it('should leave selectedChild alone for a child that came from the registry', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: { selectedChild: '2' },
          state: ApplicationStates.PREREQUISITES,
        }),
        ParentalLeaveTemplate,
      )

      const [, , newApplication] = helper.changeState({
        type: DefaultEvents.SUBMIT,
      })

      expect(newApplication.answers.selectedChild).toBe('2')
    })
  })

  describe('data provider ordering', () => {
    it('should run the children provider after the ones it reads from', () => {
      // getChildren reads `person` (applicant gender) and, for a follow-up,
      // `previousApplication` (whether the application being continued was on mock
      // data). Providers default to order 0 and run in parallel, so Children has
      // to be later or it races them and sees neither.
      expect(ChildrenApi.order ?? 0).toBeGreaterThan(
        GetPersonInformation.order ?? 0,
      )
      expect(ChildrenApi.order ?? 0).toBeGreaterThan(
        PreviousApplicationApi.order ?? 0,
      )
    })
  })

  describe('deleting an application', () => {
    const canApplicantDelete = (state: string) => {
      const application = buildApplication({
        answers: { selectedChild: '0' },
        state,
      })
      const roleInState = new ApplicationTemplateHelper(
        application,
        ParentalLeaveTemplate,
      ).getRoleInState(Roles.APPLICANT)
      const del = roleInState?.delete
      if (typeof del === 'function') {
        return del(application)
      }
      return del ?? false
    }

    it('should let the applicant delete draft and pre-VMST follow-up applications', () => {
      expect(canApplicantDelete(ApplicationStates.DRAFT)).toBe(true)
      expect(canApplicantDelete(ApplicationStates.OTHER_PARENT_APPROVAL)).toBe(
        true,
      )
      expect(canApplicantDelete(ApplicationStates.OTHER_PARENT_ACTION)).toBe(
        true,
      )
      expect(
        canApplicantDelete(ApplicationStates.EMPLOYER_WAITING_TO_ASSIGN),
      ).toBe(true)
      expect(canApplicantDelete(ApplicationStates.EMPLOYER_APPROVAL)).toBe(true)
      expect(canApplicantDelete(ApplicationStates.EMPLOYER_ACTION)).toBe(true)
      expect(
        canApplicantDelete(ApplicationStates.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS),
      ).toBe(true)
      expect(
        canApplicantDelete(
          ApplicationStates.EMPLOYER_WAITING_TO_ASSIGN_FOR_EDITS,
        ),
      ).toBe(true)
      expect(canApplicantDelete(ApplicationStates.EMPLOYER_APPROVE_EDITS)).toBe(
        true,
      )
      expect(canApplicantDelete(ApplicationStates.EMPLOYER_EDITS_ACTION)).toBe(
        true,
      )
    })

    it('should not let the applicant delete once the record is with VMST', () => {
      expect(
        canApplicantDelete(ApplicationStates.VINNUMALASTOFNUN_APPROVAL),
      ).toBe(false)
      expect(
        canApplicantDelete(ApplicationStates.VINNUMALASTOFNUN_APPROVE_EDITS),
      ).toBe(false)
      expect(
        canApplicantDelete(ApplicationStates.VINNUMALASTOFNUN_EDITS_ACTION),
      ).toBe(false)
      expect(canApplicantDelete(ApplicationStates.APPROVED)).toBe(false)
    })

    // DRAFT can be re-entered from vinnumalastofnunApproval / vinnumalastofnunAction
    // via the EDIT event once VMST already holds a record for the application
    // (sendApplication has fired at least once, populating sendApplication.data.id).
    // Deleting the application locally in that case would leave our system out
    // of sync with VMST, so the dynamic delete predicate must return false.
    it('should not let the applicant delete DRAFT once VMST has assigned a fund id', () => {
      const application = buildApplication({
        answers: { selectedChild: '0' },
        externalData: {
          sendApplication: {
            data: { id: 'VMST-12345' },
            status: 'success',
            date: new Date(),
          },
        },
        state: ApplicationStates.DRAFT,
      })
      const roleInState = new ApplicationTemplateHelper(
        application,
        ParentalLeaveTemplate,
      ).getRoleInState(Roles.APPLICANT)
      const del = roleInState?.delete
      const canDelete = typeof del === 'function' ? del(application) : !!del
      expect(canDelete).toBe(false)
    })

    // Edit-flow states are entered as part of a change / VMST-rejection edit.
    // Once this application itself has been sent to VMST (its own
    // sendApplication.data.id is populated), the dynamic predicate must lock
    // delete off even though the same states would allow delete on a fresh
    // follow-up whose sendApplication has never fired.
    it('should not let the applicant delete edit-flow states once VMST has the record', () => {
      const editFlowStates = [
        ApplicationStates.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS,
        ApplicationStates.EMPLOYER_WAITING_TO_ASSIGN_FOR_EDITS,
        ApplicationStates.EMPLOYER_APPROVE_EDITS,
        ApplicationStates.EMPLOYER_EDITS_ACTION,
      ]

      for (const state of editFlowStates) {
        const application = buildApplication({
          answers: { selectedChild: '0' },
          externalData: {
            sendApplication: {
              data: { id: 'VMST-12345' },
              status: 'success',
              date: new Date(),
            },
          },
          state,
        })
        const roleInState = new ApplicationTemplateHelper(
          application,
          ParentalLeaveTemplate,
        ).getRoleInState(Roles.APPLICANT)
        const del = roleInState?.delete
        const canDelete = typeof del === 'function' ? del(application) : !!del
        expect(canDelete).toBe(false)
      }
    })

    // A fresh follow-up sits in EDIT_OR_ADD_EMPLOYERS_AND_PERIODS with the
    // predecessor's fund id already fetched into navId.data by
    // setApplicationFundId — but sendApplication has not run for this
    // application yet. VMST has no record of *this* row, so the applicant must
    // be able to abandon it.
    it('should let the applicant delete a fresh follow-up before its own sendApplication has run', () => {
      const application = buildApplication({
        answers: {
          selectedChild: '0',
          applicationAction: 'change',
        },
        externalData: {
          navId: {
            data: '2017-05152',
            status: 'success',
            date: new Date(),
          },
          previousApplication: {
            data: { applicationFundId: '2017-05152' },
            status: 'success',
            date: new Date(),
          },
        },
        state: ApplicationStates.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS,
      })
      const roleInState = new ApplicationTemplateHelper(
        application,
        ParentalLeaveTemplate,
      ).getRoleInState(Roles.APPLICANT)
      const del = roleInState?.delete
      const canDelete = typeof del === 'function' ? del(application) : !!del
      expect(canDelete).toBe(true)
    })
  })

  describe('Spouse rejection', () => {
    it('should remove personalAllowanceFromSpouse on spouse rejection', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: {
            personalAllowanceFromSpouse: {
              usePersonalAllowance: YES,
              useAsMuchAsPossible: YES,
              usage: '100',
            },
          },
          state: ApplicationStates.OTHER_PARENT_APPROVAL,
        }),
        ParentalLeaveTemplate,
      )

      const [hasChanged, newState, newApplication] = helper.changeState({
        type: DefaultEvents.REJECT,
      })

      expect(hasChanged).toBe(true)
      expect(newState).toBe(ApplicationStates.OTHER_PARENT_ACTION)
      expect(newApplication.answers.personalAllowanceFromSpouse).toBeUndefined()
    })

    it('should remove periods on spouse rejection', () => {
      const periods = [
        {
          ratio: '100',
          endDate: '2021-05-15T00:00:00Z',
          startDate: '2021-01-15',
        },
        {
          ratio: '100',
          endDate: '2021-06-16',
          startDate: '2021-06-01',
        },
      ]

      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: {
            periods,
            requestRights: {
              isRequestingRights: YES,
              requestDays: '45',
            },
          },
          state: ApplicationStates.OTHER_PARENT_APPROVAL,
        }),
        ParentalLeaveTemplate,
      )

      const [hasChanged, newState, newApplication] = helper.changeState({
        type: DefaultEvents.REJECT,
      })

      expect(hasChanged).toBe(true)
      expect(newState).toBe(ApplicationStates.OTHER_PARENT_ACTION)
      expect(newApplication.answers.periods).toBeUndefined()
    })

    it('should remove validatedPeriods on spouse rejection', () => {
      const validatedPeriods = [
        {
          endDate: '2021-12-16',
          firstPeriodStart: 'estimatedDateOfBirth',
          ratio: '100',
          rawIndex: 0,
          startDate: '2021-06-17',
          useLength: YES,
        },
      ]

      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: {
            validatedPeriods,
            requestRights: {
              isRequestingRights: YES,
              requestDays: '45',
            },
          },
          state: ApplicationStates.OTHER_PARENT_APPROVAL,
        }),
        ParentalLeaveTemplate,
      )

      const [hasChanged, newState, newApplication] = helper.changeState({
        type: DefaultEvents.REJECT,
      })

      expect(hasChanged).toBe(true)
      expect(newState).toBe(ApplicationStates.OTHER_PARENT_ACTION)
      expect(newApplication.answers.validatedPeriods).toBeUndefined()
    })

    it('should reset value of isRequestiongRights and requestDays on spouse rejection', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: {
            requestRights: {
              isRequestingRights: YES,
              requestDays: '45',
            },
          },
          state: ApplicationStates.OTHER_PARENT_APPROVAL,
        }),
        ParentalLeaveTemplate,
      )

      const [hasChanged, newState, newApplication] = helper.changeState({
        type: DefaultEvents.REJECT,
      })

      expect(hasChanged).toBe(true)
      expect(newState).toBe(ApplicationStates.OTHER_PARENT_ACTION)
      expect(newApplication.answers.requestRights).toEqual({
        isRequestingRights: NO,
        requestDays: '0',
      })
    })

    it('should reset value of isGivingRights and giveDays on spouse rejection', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: {
            requestRights: {
              isRequestingRights: YES,
              requestDays: '45',
            },
            giveRights: {
              isGivingRights: YES,
              giveDays: '45',
            },
          },
          state: ApplicationStates.OTHER_PARENT_APPROVAL,
        }),
        ParentalLeaveTemplate,
      )

      const [hasChanged, newState, newApplication] = helper.changeState({
        type: DefaultEvents.REJECT,
      })

      expect(hasChanged).toBe(true)
      expect(newState).toBe(ApplicationStates.OTHER_PARENT_ACTION)
      expect(newApplication.answers.giveRights).toEqual({
        isGivingRights: NO,
        giveDays: '0',
      })
    })
  })
})

test.each([
  {
    answers: { applicationAction: ApplicationAction.CHANGE },
    isChange: true,
    isResidenceGrant: false,
  },
  {
    answers: { applicationAction: ApplicationAction.RESIDENCE_GRANT },
    isChange: false,
    isResidenceGrant: true,
  },
  {
    answers: { applicationAction: ApplicationAction.APPLY },
    isChange: false,
    isResidenceGrant: false,
  },
  // Applications created before one-application-per-action carry no action and
  // must read as first-time applications.
  { answers: {}, isChange: false, isResidenceGrant: false },
])(
  'should identify the action an application was created for',
  ({ answers, isChange, isResidenceGrant }) => {
    const context = {
      application: { answers },
    } as unknown as ApplicationContext

    expect(isChangeApplication(context)).toBe(isChange)
    expect(isResidenceGrantApplication(context)).toBe(isResidenceGrant)
  },
)
