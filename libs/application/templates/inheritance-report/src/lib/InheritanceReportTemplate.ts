import {
  DefaultStateLifeCycle,
  EphemeralStateLifeCycle,
} from '@island.is/application/core'
import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
} from '@island.is/application/types'
import { m } from './messages'
import { inheritanceReportSchema } from './dataSchema'
import { ApiActions, InheritanceReportEvent, Roles, States } from './constants'
import { Features } from '@island.is/feature-flags'

const InheritanceReportTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<InheritanceReportEvent>,
  InheritanceReportEvent
> = {
  type: ApplicationTypes.INHERITANCE_REPORT,
  name: m.applicationName,
  institution: m.institution,
  dataSchema: inheritanceReportSchema,
  featureFlag: Features.estateApplication,
  allowMultipleApplicationsInDraft: true,
  stateMachineConfig: {
    initial: States.draft,
    states: {
      [States.draft]: {
        meta: {
          name: '',
          status: 'draft',
          progress: 0.25,
          lifecycle: DefaultStateLifeCycle,
          onEntry: {
            apiModuleAction: ApiActions.syslumennOnEntry,
            shouldPersistToExternalData: true,
            throwOnError: false,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/form').then((module) =>
                  Promise.resolve(module.form),
                ),
              actions: [{ event: 'SUBMIT', name: '', type: 'primary' }],
              write: 'all',
              delete: true,
            },
          ],
        },
        on: {
          SUBMIT: [
            {
              target: States.done,
            },
          ],
        },
      },
      [States.done]: {
        meta: {
          name: 'Approved',
          status: 'approved',
          progress: 1,
          lifecycle: EphemeralStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/form').then((val) =>
                  Promise.resolve(val.form),
                ),
              read: 'all',
            },
          ],
        },
      },
    },
  },
  mapUserToRole(
    nationalId: string,
    application: Application,
  ): ApplicationRole | undefined {
    if (application.applicant === nationalId) {
      return Roles.APPLICANT
    }
  },
}

export default InheritanceReportTemplate
