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
  NationalRegistrySpouseApi,
  ChildrenCustodyInformationApi,
} from '@island.is/application/types'
import { pruneAfterDays } from '@island.is/application/core'

import { ConnectedApplications, Events, Roles, States } from './constants'
import { dataSchema } from './dataSchema'
import { oldAgePensionFormMessage } from './messages'
import { answerValidators } from './answerValidators'
import {
  NationalRegistryResidenceHistoryApi,
  NationalRegistryCohabitantsApi,
} from '../dataProviders'
import { getApplicationAnswers } from './oldAgePensionUtils'

const OldAgePensionTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.OLD_AGE_PENSION,
  name: oldAgePensionFormMessage.shared.applicationTitle,
  institution: oldAgePensionFormMessage.shared.institution,
  readyForProduction: false, // hafa þett svona atm?
  translationNamespaces: [ApplicationConfigurations.OldAgePension.translation],
  dataSchema,
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        meta: {
          name: States.PREREQUISITES,
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
                NationalRegistrySpouseApi,
                NationalRegistryResidenceHistoryApi,
                NationalRegistryCohabitantsApi,
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
        exit: ['clearHomeAllowance'],
        meta: {
          name: States.DRAFT,
          status: 'draft',
          lifecycle: pruneAfterDays(30),
          progress: 0.25,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/OldAgePensionForm').then((val) =>
                  Promise.resolve(val.OldAgePensionForm),
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
      clearHomeAllowance: assign((context) => {
        const { application } = context
        const { connectedApplications } = getApplicationAnswers(
          application.answers,
        )

        if (
          !connectedApplications?.includes(ConnectedApplications.HOMEALLOWANCE)
        ) {
          unset(application.answers, 'homeAllowance')
          unset(application.answers, 'fileUploadHomeAllowance')
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

export default OldAgePensionTemplate
