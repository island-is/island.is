import { EphemeralStateLifeCycle } from '@island.is/application/core'
import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  defineTemplateApi,
  NationalRegistryUserApi,
  UserProfileApi,
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
  featureFlag: Features.inheritanceReport,
  allowMultipleApplicationsInDraft: false,
  stateMachineConfig: {
    initial: States.draft,
    states: {
      [States.draft]: {
        meta: {
          name: '',
          status: 'draft',
          progress: 0.15,
          lifecycle: EphemeralStateLifeCycle,
          onEntry: defineTemplateApi({
            action: ApiActions.syslumennOnEntry,
            shouldPersistToExternalData: true,
            throwOnError: false,
          }),
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
              api: [NationalRegistryUserApi, UserProfileApi],
            },
          ],
        },
        on: {
          SUBMIT: {
            target: States.done,
          },
        },
      },
      [States.done]: {
        meta: {
          name: 'Done',
          status: 'approved',
          progress: 1,
          lifecycle: EphemeralStateLifeCycle,
          onEntry: defineTemplateApi({
            action: ApiActions.completeApplication,
            throwOnError: true,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/done').then((val) =>
                  Promise.resolve(val.done),
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
