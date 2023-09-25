import { assign } from 'xstate'
import unset from 'lodash/unset'
import {
  ApplicationTemplate,
  ApplicationContext,
  ApplicationStateSchema,
  Application,
  ApplicationTypes,
  ApplicationConfigurations,
  ApplicationRole,
  DefaultEvents,
  NationalRegistryUserApi,
  UserProfileApi,
  ChildrenCustodyInformationApi,
} from '@island.is/application/types'

import {
  coreHistoryMessages,
  pruneAfterDays,
} from '@island.is/application/core'

import { Events, Roles, States, NO, ChildPensionReason } from './constants'
import { dataSchema } from './dataSchema'
import { childPensionFormMessage } from './messages'
import { answerValidators } from './answerValidators'
import {
  childCustodyLivesWithApplicant,
  getApplicationAnswers,
} from './childPensionUtils'
import { NationalRegistryResidenceHistoryApi } from '../dataProviders'

const ChildPensionTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.CHILD_PENSION,
  name: childPensionFormMessage.shared.applicationTitle,
  institution: childPensionFormMessage.shared.institution,
  translationNamespaces: [ApplicationConfigurations.childPension.translation],
  dataSchema,
  stateMachineConfig: {
    initial: States.PREREQUESITES,
    states: {
      [States.PREREQUESITES]: {
        meta: {
          name: States.PREREQUESITES,
          status: 'draft',
          lifecycle: pruneAfterDays(1),
          progress: 0.25,
          actionCard: {
            historyLogs: [
              {
                logMessage: coreHistoryMessages.applicationStarted,
                onEvent: DefaultEvents.SUBMIT,
              },
            ],
          },
          //onExit: defineTemplateApi - kalla á TR
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Prerequisites').then((val) =>
                  Promise.resolve(val.PrerequisitesForm),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Submit',
                  type: 'primary',
                },
              ],
              write: 'all',
              api: [
                NationalRegistryUserApi,
                UserProfileApi,
                ChildrenCustodyInformationApi,
                NationalRegistryResidenceHistoryApi,
              ],
              delete: true,
            },
          ],
        },
        on: {
          SUBMIT: States.DRAFT,
        },
      },
      [States.DRAFT]: {
        exit: [
          'clearChildPensionAddChild',
          'clearParentIsDead',
          'clearParentsPenitentiary',
          'clearChildPensionNotLivesWithApplicant',
          'clearSelectedChildren',
        ],
        meta: {
          name: States.DRAFT,
          status: 'draft',
          lifecycle: pruneAfterDays(30),
          progress: 0.25,
          actionCard: {
            historyLogs: {
              onEvent: DefaultEvents.SUBMIT,
              logMessage: coreHistoryMessages.applicationSent,
            },
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/ChildPensionForm').then((val) =>
                  Promise.resolve(val.ChildPensionForm),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Submit',
                  type: 'primary',
                },
              ],
              write: 'all',
              delete: true,
            },
          ],
        },
        // on: {
        //   SUBMIT: [],
        // },
      },
    },
  },
  stateMachineOptions: {
    actions: {
      clearChildPensionAddChild: assign((context) => {
        const { application } = context
        const { childPensionAddChild } = getApplicationAnswers(
          application.answers,
        )

        if (childPensionAddChild === NO) {
          unset(application.answers, 'registerChildRepeater')
          unset(application.answers, 'fileUpload.maintenance')
        }

        return context
      }),
      clearParentIsDead: assign((context) => {
        const { application } = context
        const { registeredChildren, selectedChildrenInCustody } =
          getApplicationAnswers(application.answers)

        for (const [index, child] of selectedChildrenInCustody.entries()) {
          if (
            child.parentIsDead &&
            !child.reason?.includes(ChildPensionReason.PARENT_IS_DEAD)
          ) {
            unset(
              application.answers,
              `chooseChildren.selectedChildrenInCustody[${index}].parentIsDead`,
            )
          }
        }

        for (const [index, child] of registeredChildren.entries()) {
          if (
            child.parentIsDead &&
            !child.reason?.includes(ChildPensionReason.PARENT_IS_DEAD)
          ) {
            unset(
              application.answers,
              `registerChildRepeater[${index}].parentIsDead`,
            )
          }
        }

        return context
      }),
      clearParentsPenitentiary: assign((context) => {
        const { application } = context
        const { registeredChildren, selectedChildrenInCustody } =
          getApplicationAnswers(application.answers)

        for (const [index, child] of selectedChildrenInCustody.entries()) {
          if (
            child.parentsPenitentiary &&
            !child.reason?.includes(ChildPensionReason.PARENTS_PENITENTIARY)
          ) {
            unset(
              application.answers,
              `chooseChildren.selectedChildrenInCustody[${index}].parentsPenitentiary`,
            )
          }
        }

        for (const [index, child] of registeredChildren.entries()) {
          if (
            child.parentsPenitentiary &&
            !child.reason?.includes(ChildPensionReason.PARENTS_PENITENTIARY)
          ) {
            unset(
              application.answers,
              `registerChildRepeater[${index}].parentsPenitentiary`,
            )
          }
        }

        return context
      }),
      clearChildPensionNotLivesWithApplicant: assign((context) => {
        const { application } = context

        const doesNotLiveWithApplicant = childCustodyLivesWithApplicant(
          application.answers,
          application.externalData,
        )

        if (!doesNotLiveWithApplicant)
          unset(application.answers, 'fileUpload.notLivesWithApplicant')

        return context
      }),
      clearSelectedChildren: assign((context) => {
        const { application } = context

        const { selectedCustodyKids } = getApplicationAnswers(
          application.answers,
        )

        if (selectedCustodyKids.length === 0) {
          unset(application.answers, 'chooseChildren')
        }

        return context
      }),
    },
  },
  mapUserToRole(
    id: string,
    application: Application,
  ): ApplicationRole | undefined {
    if (id === application.applicant) {
      return Roles.APPLICANT
    }
    return undefined
  },
  answerValidators,
}

export default ChildPensionTemplate
