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
  ADOPTION,
  ApplicationAction,
  PARENTAL_LEAVE,
  SPOUSE,
  States as ApplicationStates,
  PARENTAL_GRANT,
  PLEvents,
  RejectedBy,
  Roles,
  StartDateOptions,
} from '../constants'

import { createNationalId } from '@island.is/testing/fixtures'
import { ChildrenApi, GetPersonInformation } from '../dataProviders'
import {
  getReapprovalAfterEdit,
  isChangeApplication,
  isResidenceGrantApplication,
} from './parentalLeaveTemplateUtils'
import {
  draftStateDescription,
  editOrAddPeriodsStatePendingAction,
} from './parentalLeaveUtils'
import { parentalLeaveFormMessages, statesMessages } from './messages'

const buildApplication = (data: {
  answers?: FormValue
  externalData?: ExternalData
  state?: string
  assignees?: string[]
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
    assignees = [],
  } = data

  return {
    id: '12345',
    assignees,
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
      vmstApplicationId: 'root-app-id',
    }

    it('should resolve the child index from the VMST leave on the way out of prerequisites', () => {
      // If this match fails, `selectedChild` stays unset and everything downstream
      // that needs the child throws "Missing selected child".
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: {
            applicationAction: ApplicationAction.CHANGE,
            initialQuery: 'root-application-id',
          },
          externalData: {
            children: {
              data: {
                children: [
                  {
                    hasRights: true,
                    remainingDays: 180,
                    parentalRelation: 'primary',
                    expectedDateOfBirth: '2026-01-01',
                  },
                  {
                    hasRights: true,
                    remainingDays: 180,
                    parentalRelation: 'primary',
                    expectedDateOfBirth: '2027-03-04',
                    existingApplicationId: 'root-application-id',
                  },
                ],
                existingApplications: [],
                childApplicationLinks: [
                  {
                    childKey: 'vmst:root-application-id',
                    vmstApplicationId: 'root-application-id',
                  },
                ],
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
      expect(newApplication.answers.selectedChild).toBe('1')
      expect(newApplication.answers.vmstApplicationId).toBe(
        'root-application-id',
      )
    })

    it('should not trust a follow-up id VMST does not list for the applicant', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: {
            applicationAction: ApplicationAction.CHANGE,
            initialQuery: 'someone-elses-application-id',
            selectedChild: '0',
          },
          externalData: {
            children: {
              data: { children: [], childApplicationLinks: [] },
              date: new Date(),
              status: 'success',
            },
          },
          state: ApplicationStates.PREREQUISITES,
        }),
        ParentalLeaveTemplate,
      )

      const [, , newApplication] = helper.changeState({
        type: DefaultEvents.SUBMIT,
      })

      expect(newApplication.answers.vmstApplicationId).not.toBe(
        'someone-elses-application-id',
      )
    })

    it('should prefill an adoption follow-up from VMST rights without replacing the matched child', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: {
            applicationAction: ApplicationAction.CHANGE,
            initialQuery: 'root-application-id',
          },
          externalData: {
            children: {
              data: {
                children: [
                  {
                    hasRights: true,
                    remainingDays: 180,
                    parentalRelation: 'primary',
                    expectedDateOfBirth: '2026-01-01',
                  },
                  {
                    hasRights: true,
                    remainingDays: 180,
                    parentalRelation: 'primary',
                    expectedDateOfBirth: '',
                    adoptionDate: '2027-03-04',
                    existingApplicationId: 'root-application-id',
                  },
                ],
                childApplicationLinks: [
                  {
                    childKey: 'vmst:root-application-id',
                    vmstApplicationId: 'root-application-id',
                  },
                ],
              },
              date: new Date(),
              status: 'success',
            },
            VMSTApplicationRights: {
              data: [{ rightsUnit: 'M-Æ-L-GR', days: '180' }],
              date: new Date(),
              status: 'success',
            },
          },
          state: ApplicationStates.PREREQUISITES,
        }),
        ParentalLeaveTemplate,
      )

      const [, , newApplication] = helper.changeState({
        type: DefaultEvents.SUBMIT,
      })

      expect(newApplication.answers.noChildrenFound).toEqual({
        typeOfApplication: ADOPTION,
      })
      expect(newApplication.answers.selectedChild).toBe('1')
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
          firstPeriodStart: StartDateOptions.SPECIFIC_DATE,
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
          state: ApplicationStates.EMPLOYER_APPROVE_EDITS,
        }),
        ParentalLeaveTemplate,
      )

      const [hasChanged, newState, newApplication] = helper.changeState({
        type: DefaultEvents.REJECT,
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

    it('should restore the VMST change baseline when the applicant cancels', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: {
            ...CHANGE_ANSWERS,
            employment: {
              isSelfEmployed: NO,
              isReceivingUnemploymentBenefits: NO,
            },
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
            VMSTApplicationInformation: {
              data: {
                employers: [
                  {
                    email: 'baseline@test.is',
                    nationalRegistryId: '0101302719',
                  },
                ],
                periods: [
                  {
                    from: '2021-01-10',
                    to: '2021-05-10T00:00:00Z',
                    ratio: '50',
                    approved: true,
                    paid: false,
                    rightsCodePeriod: 'M-L-GR',
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

      const [hasChanged, newState, newApplication] = helper.changeState({
        type: DefaultEvents.ABORT,
      })

      expect(hasChanged).toBe(true)
      expect(newState).toBe(ApplicationStates.VINNUMALASTOFNUN_APPROVE_EDITS)
      expect(newApplication.answers.employers).toEqual([
        {
          email: 'baseline@test.is',
          ratio: '',
          companyNationalRegistryId: '0101302719',
        },
      ])
      expect(newApplication.answers.periods).toEqual([
        expect.objectContaining({
          ratio: '50',
          endDate: '2021-05-10T00:00:00Z',
          startDate: '2021-01-10',
        }),
      ])
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

        expect(() => helper.changeState({ type: DefaultEvents.EDIT })).toThrow(
          `EDIT is invalid for state ${state}`,
        )
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

    // The other parent or employer has been notified but VMST has not been sent this change, so a
    // follow-up applicant walking away should be able to delete the draft rather
    // than wait 970 days for it to prune.
    it.each([
      ApplicationStates.OTHER_PARENT_APPROVAL_FOR_EDITS,
      ApplicationStates.EMPLOYER_WAITING_TO_ASSIGN_FOR_EDITS,
      ApplicationStates.EMPLOYER_APPROVE_EDITS,
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
      ApplicationStates.OTHER_PARENT_APPROVAL_FOR_EDITS,
      ApplicationStates.EMPLOYER_WAITING_TO_ASSIGN_FOR_EDITS,
      ApplicationStates.EMPLOYER_APPROVE_EDITS,
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

    it('should send a VMST rejection straight to draft so the applicant can fix or delete the rejected submission', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: { selectedChild: '0' },
          state: ApplicationStates.VINNUMALASTOFNUN_APPROVAL,
        }),
        ParentalLeaveTemplate,
      )

      const [hasChanged, newState, newApplication] = helper.changeState({
        type: DefaultEvents.REJECT,
      })

      expect(hasChanged).toBe(true)
      expect(newState).toBe(ApplicationStates.DRAFT)
      expect(newApplication.answers.rejectedBy).toBe(RejectedBy.VMST)
    })

    it('should return VMST rejection corrections to initial VMST review on submit', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: { selectedChild: '0' },
          state: ApplicationStates.VINNUMALASTOFNUN_APPROVAL,
        }),
        ParentalLeaveTemplate,
      )

      const [, , correctionApplication] = helper.changeState({
        type: DefaultEvents.REJECT,
      })
      const correctionHelper = new ApplicationTemplateHelper(
        correctionApplication,
        ParentalLeaveTemplate,
      )

      const [hasChanged, newState, resubmitted] = correctionHelper.changeState({
        type: DefaultEvents.SUBMIT,
      })

      expect(hasChanged).toBe(true)
      expect(newState).toBe(ApplicationStates.VINNUMALASTOFNUN_APPROVAL)
      expect(resubmitted.answers.rejectedBy).toBeUndefined()
    })

    it('should not offer ABORT from draft after a VMST rejection', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: { selectedChild: '0' },
          state: ApplicationStates.VINNUMALASTOFNUN_APPROVAL,
        }),
        ParentalLeaveTemplate,
      )

      const [, , correctionApplication] = helper.changeState({
        type: DefaultEvents.REJECT,
      })
      const correctionHelper = new ApplicationTemplateHelper(
        correctionApplication,
        ParentalLeaveTemplate,
      )

      expect(() =>
        correctionHelper.changeState({ type: DefaultEvents.ABORT }),
      ).toThrow(`ABORT is invalid for state ${ApplicationStates.DRAFT}`)
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
      // As `getVMSTApplicationAnswers` maps VMST's period below
      const baselinePeriods = [
        {
          startDate: '2027-04-06',
          endDate: '2027-04-20',
          ratio: '100',
          firstPeriodStart: StartDateOptions.SPECIFIC_DATE,
          rawIndex: 0,
          rightCodePeriod: 'M-L-GR',
          paid: false,
          approved: true,
        },
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
            VMSTApplicationInformation: {
              data: {
                periods: [
                  {
                    from: '2027-04-06',
                    to: '2027-04-20',
                    ratio: '100',
                    approved: true,
                    paid: false,
                    rightsCodePeriod: 'M-L-GR',
                  },
                ],
                applicationRights: [{ rightsUnit: 'M-L-GR', days: '180' }],
                employers: [],
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
            VMSTApplicationInformation: {
              data: {
                periods: [
                  {
                    from: '2027-04-06',
                    to: '2027-04-20',
                    ratio: '100',
                    approved: true,
                    paid: false,
                    rightsCodePeriod: 'M-L-GR',
                  },
                ],
                applicationRights: [{ rightsUnit: 'M-L-GR', days: '180' }],
                employers: [],
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

  describe('late VMST callbacks after DRAFT rewind', () => {
    // After the applicant EDITs their way out of VINNUMALASTOFNUN_APPROVAL the
    // row is back in DRAFT but VMST still has a record of it. Without an
    // APPROVE/REJECT handler on DRAFT a late VMST callback would be dropped.
    it('should transition DRAFT to APPROVED on APPROVE once VMST has a fund id', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: { selectedChild: '0' },
          externalData: {
            navId: {
              data: '2017-05152',
              status: 'success',
              date: new Date(),
            },
          },
          state: ApplicationStates.DRAFT,
        }),
        ParentalLeaveTemplate,
      )

      const [hasChanged, newState] = helper.changeState({
        type: DefaultEvents.APPROVE,
      })

      expect(hasChanged).toBe(true)
      expect(newState).toBe(ApplicationStates.APPROVED)
    })

    it('should keep DRAFT and flag a late VMST REJECT once VMST has a fund id', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: { selectedChild: '0' },
          externalData: {
            navId: {
              data: '2017-05152',
              status: 'success',
              date: new Date(),
            },
          },
          state: ApplicationStates.DRAFT,
        }),
        ParentalLeaveTemplate,
      )

      const [hasChanged, newState, newApplication] = helper.changeState({
        type: DefaultEvents.REJECT,
      })

      expect(hasChanged).toBe(true)
      expect(newState).toBe(ApplicationStates.DRAFT)
      expect(newApplication.answers.rejectedBy).toBe(RejectedBy.VMST)
    })

    it('should ignore APPROVE from DRAFT when VMST has no record yet', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: { selectedChild: '0' },
          state: ApplicationStates.DRAFT,
        }),
        ParentalLeaveTemplate,
      )

      const [hasChanged, newState] = helper.changeState({
        type: DefaultEvents.APPROVE,
      })

      expect(hasChanged).toBe(false)
      expect(newState).toBe(ApplicationStates.DRAFT)
    })

    it('should ignore REJECT from DRAFT when VMST has no record yet', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: { selectedChild: '0' },
          state: ApplicationStates.DRAFT,
        }),
        ParentalLeaveTemplate,
      )

      const [hasChanged, newState] = helper.changeState({
        type: DefaultEvents.REJECT,
      })

      expect(hasChanged).toBe(false)
      expect(newState).toBe(ApplicationStates.DRAFT)
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

    it('should keep the registry child picked after answering the no-children-found screens', () => {
      // Picking "Ný umsókn", answering adoption and then going back to a
      // registry child leaves those answers behind; they must not win.
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: {
            selectedChild: '2',
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

      const [, , newApplication] = helper.changeState({
        type: DefaultEvents.SUBMIT,
      })

      expect(newApplication.answers.selectedChild).toBe('2')
      // They would otherwise steer the draft form, e.g. ask for an adoption upload.
      expect(newApplication.answers.noChildrenFound).toBeUndefined()
      expect(newApplication.answers.fosterCareOrAdoption).toBeUndefined()
    })
  })

  describe('data provider ordering', () => {
    it('should run the children provider after the ones it reads from', () => {
      // getChildren reads `person` (applicant gender). Providers default to
      // order 0 and run in parallel, so Children has to be later or it races it.
      expect(ChildrenApi.order ?? 0).toBeGreaterThan(
        GetPersonInformation.order ?? 0,
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
      expect(
        canApplicantDelete(ApplicationStates.EMPLOYER_WAITING_TO_ASSIGN),
      ).toBe(true)
      expect(canApplicantDelete(ApplicationStates.EMPLOYER_APPROVAL)).toBe(true)
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
    })

    it('should not let the applicant delete once the record is with VMST', () => {
      expect(
        canApplicantDelete(ApplicationStates.VINNUMALASTOFNUN_APPROVAL),
      ).toBe(false)
      expect(
        canApplicantDelete(ApplicationStates.VINNUMALASTOFNUN_APPROVE_EDITS),
      ).toBe(false)
      expect(canApplicantDelete(ApplicationStates.APPROVED)).toBe(false)
    })

    // DRAFT can be re-entered from vinnumalastofnunApproval via EDIT or REJECT once VMST already holds a record for the application
    // (sendApplication has fired at least once, populating sendApplication.data.id).
    // Deleting the application locally in that case would leave our system out
    // of sync with VMST, so the dynamic delete predicate must return false.
    it.each<{ externalData: ExternalData; source: string }>([
      {
        externalData: {
          sendApplication: {
            data: { id: 'VMST-12345' },
            status: 'success' as const,
            date: new Date(),
          },
        },
        source: 'sendApplication',
      },
      {
        externalData: {
          navId: {
            data: 'VMST-12345',
            status: 'success' as const,
            date: new Date(),
          },
        },
        source: 'legacy navId',
      },
    ])(
      'should not let the applicant delete DRAFT once VMST has assigned an id through $source',
      ({ externalData }) => {
        const application = buildApplication({
          answers: { selectedChild: '0' },
          externalData,
          state: ApplicationStates.DRAFT,
        })
        const roleInState = new ApplicationTemplateHelper(
          application,
          ParentalLeaveTemplate,
        ).getRoleInState(Roles.APPLICANT)
        const del = roleInState?.delete
        const canDelete = typeof del === 'function' ? del(application) : !!del
        expect(canDelete).toBe(false)
      },
    )

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

  it('should persist the default access consent for a manual other parent', () => {
    const helper = new ApplicationTemplateHelper(
      buildApplication({
        state: ApplicationStates.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS,
        answers: {
          otherParentObj: {
            chooseOtherParent: 'manual',
            otherParentId: createNationalId('person'),
          },
        },
      }),
      ParentalLeaveTemplate,
    )

    const [hasChanged, , application] = helper.changeState({
      type: DefaultEvents.SUBMIT,
    })

    expect(hasChanged).toBe(true)
    expect(application.answers).toMatchObject({
      otherParentRightOfAccess: YES,
    })
  })

  describe('actions bound to a single transition', () => {
    const reviewerId = createNationalId('person')
    const companyId = createNationalId('company')
    const pendingEmployerAnswers = () => ({
      applicationType: { option: PARENTAL_LEAVE },
      selectedChild: '0',
      employerNationalRegistryId: companyId,
      employers: [
        {
          email: 'employer@example.is',
          ratio: '100',
          isApproved: false,
          reviewerNationalRegistryId: reviewerId,
        },
      ],
    })

    it('should mark the employer approved when the employer approves', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          state: ApplicationStates.EMPLOYER_APPROVAL,
          assignees: [reviewerId],
          answers: pendingEmployerAnswers(),
        }),
        ParentalLeaveTemplate,
      )

      const [hasChanged, newState, newApplication] = helper.changeState({
        type: DefaultEvents.APPROVE,
      })

      expect(hasChanged).toBe(true)
      expect(newState).toBe(ApplicationStates.VINNUMALASTOFNUN_APPROVAL)
      expect(newApplication.assignees).toEqual([])
      expect(newApplication.answers.employers).toEqual([
        expect.objectContaining({
          isApproved: true,
          companyNationalRegistryId: companyId,
        }),
      ])
    })

    it.each<[DefaultEvents.REJECT | DefaultEvents.EDIT, string]>([
      [DefaultEvents.REJECT, ApplicationStates.DRAFT],
      [DefaultEvents.EDIT, ApplicationStates.DRAFT],
    ])(
      'should not mark the employer approved on %s',
      (event, expectedState) => {
        const helper = new ApplicationTemplateHelper(
          buildApplication({
            state: ApplicationStates.EMPLOYER_APPROVAL,
            assignees: [reviewerId],
            answers: pendingEmployerAnswers(),
          }),
          ParentalLeaveTemplate,
        )

        const [hasChanged, newState, newApplication] = helper.changeState({
          type: event,
        })

        expect(hasChanged).toBe(true)
        expect(newState).toBe(expectedState)
        expect(newApplication.assignees).toEqual([])
        expect(newApplication.answers.employers).toEqual([
          expect.objectContaining({ isApproved: false }),
        ])
      },
    )

    it.each([
      [
        ApplicationStates.EMPLOYER_WAITING_TO_ASSIGN,
        ApplicationStates.EMPLOYER_APPROVAL,
      ],
      [
        ApplicationStates.EMPLOYER_WAITING_TO_ASSIGN_FOR_EDITS,
        ApplicationStates.EMPLOYER_APPROVE_EDITS,
      ],
    ])(
      'should record the assigned employer reviewer when assigned in %s',
      (state, expectedState) => {
        const helper = new ApplicationTemplateHelper(
          buildApplication({
            state,
            assignees: [reviewerId],
            answers: {
              applicationType: { option: PARENTAL_LEAVE },
              selectedChild: '0',
              employers: [
                {
                  email: 'employer@example.is',
                  ratio: '100',
                  isApproved: false,
                },
              ],
            },
          }),
          ParentalLeaveTemplate,
        )

        const [hasChanged, newState, newApplication] = helper.changeState({
          type: DefaultEvents.ASSIGN,
        })

        expect(hasChanged).toBe(true)
        expect(newState).toBe(expectedState)
        expect(newApplication.answers).toMatchObject({
          employerReviewerNationalRegistryId: reviewerId,
          employers: [{ reviewerNationalRegistryId: reviewerId }],
        })
      },
    )

    it('should not record an employer reviewer when the applicant edits instead', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          state: ApplicationStates.EMPLOYER_WAITING_TO_ASSIGN,
          answers: {
            applicationType: { option: PARENTAL_LEAVE },
            selectedChild: '0',
            employers: [
              { email: 'employer@example.is', ratio: '100', isApproved: false },
            ],
          },
        }),
        ParentalLeaveTemplate,
      )

      const [, newState, newApplication] = helper.changeState({
        type: DefaultEvents.EDIT,
      })

      expect(newState).toBe(ApplicationStates.DRAFT)
      expect(
        newApplication.answers.employerReviewerNationalRegistryId,
      ).toBeUndefined()
    })

    it.each<
      [DefaultEvents.APPROVE | DefaultEvents.REJECT, string, string | undefined]
    >([
      [
        DefaultEvents.APPROVE,
        ApplicationStates.VINNUMALASTOFNUN_APPROVE_EDITS,
        YES,
      ],
      [DefaultEvents.REJECT, ApplicationStates.CLOSED, undefined],
    ])(
      'should only record the residence grant as applied for on %s',
      (event, expectedState, expected) => {
        const helper = new ApplicationTemplateHelper(
          buildApplication({
            state: ApplicationStates.RESIDENCE_GRANT_APPLICATION,
            answers: {
              applicationType: { option: PARENTAL_LEAVE },
              selectedChild: '0',
            },
          }),
          ParentalLeaveTemplate,
        )

        const [hasChanged, newState, newApplication] = helper.changeState({
          type: event,
        })

        expect(hasChanged).toBe(true)
        expect(newState).toBe(expectedState)
        expect(newApplication.answers.hasAppliedForReidenceGrant).toBe(expected)
      },
    )

    it('should keep a pending employer change when the change form is re-entered', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          state: ApplicationStates.EMPLOYER_APPROVE_EDITS,
          assignees: [reviewerId],
          answers: {
            ...pendingEmployerAnswers(),
            applicationAction: ApplicationAction.CHANGE,
            changeEmployer: YES,
          },
        }),
        ParentalLeaveTemplate,
      )

      const [, newState, newApplication] = helper.changeState({
        type: DefaultEvents.EDIT,
      })

      expect(newState).toBe(ApplicationStates.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS)
      expect(newApplication.answers.changeEmployer).toBe(YES)
    })

    it('should keep the rejected employer change in the change form for the applicant to fix', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          state: ApplicationStates.EMPLOYER_APPROVE_EDITS,
          assignees: [reviewerId],
          answers: {
            ...pendingEmployerAnswers(),
            applicationAction: ApplicationAction.CHANGE,
            changeEmployer: YES,
          },
        }),
        ParentalLeaveTemplate,
      )

      const [, newState, newApplication] = helper.changeState({
        type: DefaultEvents.REJECT,
      })

      expect(newState).toBe(ApplicationStates.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS)
      expect(newApplication.answers.changeEmployer).toBe(YES)
      expect(newApplication.answers.rejectedBy).toBe(RejectedBy.EMPLOYER)
      expect(newApplication.assignees).toEqual([])
    })

    it('should clear the assignees when the other parent rejects the application', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          state: ApplicationStates.OTHER_PARENT_APPROVAL,
          assignees: [reviewerId],
          answers: {
            applicationType: { option: PARENTAL_LEAVE },
            selectedChild: '0',
          },
        }),
        ParentalLeaveTemplate,
      )

      const [hasChanged, newState, newApplication] = helper.changeState({
        type: DefaultEvents.REJECT,
      })

      expect(hasChanged).toBe(true)
      expect(newState).toBe(ApplicationStates.DRAFT)
      expect(newApplication.assignees).toEqual([])
    })

    it('should clear the assignees when the application is closed while awaiting employer edits', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          state: ApplicationStates.EMPLOYER_APPROVE_EDITS,
          assignees: [reviewerId],
          answers: {
            applicationType: { option: PARENTAL_LEAVE },
            selectedChild: '0',
          },
        }),
        ParentalLeaveTemplate,
      )

      const [hasChanged, newState, newApplication] = helper.changeState({
        type: 'CLOSED',
      })

      expect(hasChanged).toBe(true)
      expect(newState).toBe(ApplicationStates.CLOSED)
      expect(newApplication.assignees).toEqual([])
    })
  })

  describe('rejection', () => {
    it.each([
      [
        ApplicationStates.OTHER_PARENT_APPROVAL,
        ApplicationStates.DRAFT,
        RejectedBy.OTHER_PARENT,
      ],
      [
        ApplicationStates.EMPLOYER_APPROVAL,
        ApplicationStates.DRAFT,
        RejectedBy.EMPLOYER,
      ],
      [
        ApplicationStates.VINNUMALASTOFNUN_APPROVAL,
        ApplicationStates.DRAFT,
        RejectedBy.VMST,
      ],
      [
        ApplicationStates.OTHER_PARENT_APPROVAL_FOR_EDITS,
        ApplicationStates.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS,
        RejectedBy.OTHER_PARENT,
      ],
      [
        ApplicationStates.EMPLOYER_APPROVE_EDITS,
        ApplicationStates.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS,
        RejectedBy.EMPLOYER,
      ],
      [
        ApplicationStates.VINNUMALASTOFNUN_APPROVE_EDITS,
        ApplicationStates.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS,
        RejectedBy.VMST,
      ],
    ])(
      'should send a rejection in %s straight back to %s and record who rejected',
      (state, expectedState, rejectedBy) => {
        const helper = new ApplicationTemplateHelper(
          buildApplication({
            state,
            assignees: [createNationalId('person')],
            answers: {
              applicationType: { option: PARENTAL_LEAVE },
              selectedChild: '0',
            },
          }),
          ParentalLeaveTemplate,
        )

        const [hasChanged, newState, newApplication] = helper.changeState({
          type: DefaultEvents.REJECT,
        })

        expect(hasChanged).toBe(true)
        expect(newState).toBe(expectedState)
        expect(newApplication.answers.rejectedBy).toBe(rejectedBy)
        expect(newApplication.assignees).toEqual([])
      },
    )

    it('should clear who rejected once the applicant resubmits the change form', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          state: ApplicationStates.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS,
          answers: {
            applicationType: { option: PARENTAL_LEAVE },
            selectedChild: '0',
            rejectedBy: RejectedBy.VMST,
          },
        }),
        ParentalLeaveTemplate,
      )

      const [hasChanged, , newApplication] = helper.changeState({
        type: DefaultEvents.SUBMIT,
      })

      expect(hasChanged).toBe(true)
      expect(newApplication.answers.rejectedBy).toBeUndefined()
    })

    it.each([
      ApplicationStates.DRAFT,
      ApplicationStates.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS,
    ])(
      'should notify the applicant when %s is entered by a rejection',
      (state) => {
        const onEntry =
          ParentalLeaveTemplate.stateMachineConfig.states?.[state]?.meta
            ?.onEntry

        expect(onEntry).toEqual(
          expect.objectContaining({
            action: 'notifyApplicantOfRejection',
            triggerEvent: DefaultEvents.REJECT,
            throwOnError: false,
          }),
        )
      },
    )

    it('should explain on the draft card who rejected the application', () => {
      expect(draftStateDescription(buildApplication({ answers: {} }))).toBe(
        statesMessages.draftDescription,
      )
      expect(
        draftStateDescription(
          buildApplication({ answers: { rejectedBy: RejectedBy.EMPLOYER } }),
        ),
      ).toBe(parentalLeaveFormMessages.draftFlow.draftNotApprovedEmployerDesc)
    })

    it('should show why the change form was reopened', () => {
      expect(
        editOrAddPeriodsStatePendingAction(buildApplication({ answers: {} }))
          .title,
      ).toBe(statesMessages.editOrAddPeriodsTitle)
      expect(
        editOrAddPeriodsStatePendingAction(
          buildApplication({ answers: { rejectedBy: RejectedBy.VMST } }),
        ).title,
      ).toBe(statesMessages.vinnumalastofnunApproveEditsRejectHistoryLogMessage)
    })
  })

  describe('taking an application back to edit it', () => {
    it('should ask every party again when a first-time application is resubmitted', () => {
      const application = buildApplication({
        state: ApplicationStates.EMPLOYER_APPROVAL,
        answers: {
          applicationType: { option: PARENTAL_LEAVE },
          otherParent: SPOUSE,
          usePersonalAllowanceFromSpouse: YES,
          employment: {
            isSelfEmployed: NO,
            isReceivingUnemploymentBenefits: NO,
          },
          employers: [{ email: 'employer@example.is', ratio: '100' }],
        },
      })

      expect(getReapprovalAfterEdit(application)).toEqual({
        isEditFlow: false,
        otherParent: true,
        employer: true,
      })
    })

    it('should leave out parties a first-time application does not need', () => {
      const application = buildApplication({
        state: ApplicationStates.VINNUMALASTOFNUN_APPROVAL,
        answers: {
          applicationType: { option: PARENTAL_LEAVE },
          employment: {
            isSelfEmployed: YES,
            isReceivingUnemploymentBenefits: NO,
          },
        },
      })

      expect(getReapprovalAfterEdit(application)).toEqual({
        isEditFlow: false,
        otherParent: false,
        employer: false,
      })
    })

    it.each([
      ApplicationStates.OTHER_PARENT_APPROVAL_FOR_EDITS,
      ApplicationStates.EMPLOYER_WAITING_TO_ASSIGN_FOR_EDITS,
      ApplicationStates.EMPLOYER_APPROVE_EDITS,
      ApplicationStates.VINNUMALASTOFNUN_APPROVE_EDITS,
    ])('should treat %s as the edit flow', (state) => {
      expect(
        getReapprovalAfterEdit(buildApplication({ state })).isEditFlow,
      ).toBe(true)
    })
  })

  describe('Spouse rejection', () => {
    it.each([
      [ApplicationStates.OTHER_PARENT_APPROVAL, ApplicationStates.DRAFT],
      [
        ApplicationStates.OTHER_PARENT_APPROVAL_FOR_EDITS,
        ApplicationStates.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS,
      ],
    ])(
      'should remove personalAllowanceFromSpouse on spouse rejection from %s',
      (state, expectedState) => {
        const helper = new ApplicationTemplateHelper(
          buildApplication({
            answers: {
              personalAllowanceFromSpouse: {
                usePersonalAllowance: YES,
                useAsMuchAsPossible: YES,
                usage: '100',
              },
            },
            state,
          }),
          ParentalLeaveTemplate,
        )

        const [hasChanged, newState, newApplication] = helper.changeState({
          type: DefaultEvents.REJECT,
        })

        expect(hasChanged).toBe(true)
        expect(newState).toBe(expectedState)
        expect(
          newApplication.answers.personalAllowanceFromSpouse,
        ).toBeUndefined()
      },
    )

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
      expect(newState).toBe(ApplicationStates.DRAFT)
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
      expect(newState).toBe(ApplicationStates.DRAFT)
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
      expect(newState).toBe(ApplicationStates.DRAFT)
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
      expect(newState).toBe(ApplicationStates.DRAFT)
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
