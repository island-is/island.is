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

import { pruneAfterDays } from '@island.is/application/core'

import { Events, Roles, States, NO, ChildPensionReason } from './constants'
import { dataSchema } from './dataSchema'
import { childPensionFormMessage } from './messages'
import { answerValidators } from './answerValidators'
import { getApplicationAnswers } from './childPensionUtils'

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
        exit: ['clearChildPensionAddChild', 'clearParentIsDead'],
        meta: {
          name: States.DRAFT,
          status: 'draft',
          lifecycle: pruneAfterDays(30),
          progress: 0.25,
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
