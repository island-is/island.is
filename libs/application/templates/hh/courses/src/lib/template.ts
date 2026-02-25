import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  DefaultEvents,
  FormModes,
  ApplicationConfigurations,
  defineTemplateApi,
  HealthCenterApi,
  InstitutionNationalIds,
} from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { buildPaymentState } from '@island.is/application/utils'
import { Features } from '@island.is/feature-flags'
import { CodeOwners } from '@island.is/shared/constants'
import {
  DefaultStateLifeCycle,
  EphemeralStateLifeCycle,
} from '@island.is/application/core'
import { UserProfileApi, NationalRegistryUserApi } from '../dataProviders'
import { ApiActions, Events, Roles, States } from '../utils/constants'
import { dataSchema } from './dataSchema'
import {
  HhCoursesSelectedChargeItemApi,
  HhCoursesParticipantAvailabilityApi,
} from '../dataProviders'

import { m } from './messages'
import { getChargeItems } from '../utils/getChargeItems'
import { hasCourseBeenFullyBooked } from '../utils/hasCourseBeenFullyBooked'

const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.HEILSUGAESLA_HOFUDBORDARSVAEDISINS_NAMSKEID,
  name: (application: Application) => {
    const courseTitle = getValueViaPath<string>(
      application.externalData,
      'hhCoursesSelectedChargeItem.data.courseTitle',
    )
    return courseTitle
      ? {
          name: m.general.applicationTitleWithCourse,
          value: courseTitle,
        }
      : m.general.applicationTitle
  },
  codeOwner: CodeOwners.Stefna,
  institution: m.general.institutionName,
  applicationText: m.general.applicationListTitle,
  newApplicationButtonLabel: m.general.newApplicationButtonLabel,
  translationNamespaces:
    ApplicationConfigurations[
      ApplicationTypes.HEILSUGAESLA_HOFUDBORDARSVAEDISINS_NAMSKEID
    ].translation,
  dataSchema,
  allowMultipleApplicationsInDraft: true,
  initialQueryParameter: 'selection',
  featureFlag: Features.isHHCourseApplicationEnabled,
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        meta: {
          name: 'Prerequisites',
          progress: 0,
          status: FormModes.DRAFT,
          lifecycle: EphemeralStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/prerequisitesForm').then((module) =>
                  Promise.resolve(module.Prerequisites),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: m.general.confirmButtonLabel,
                  type: 'primary',
                },
              ],
              write: 'all',
              read: 'all',
              api: [
                UserProfileApi,
                NationalRegistryUserApi,
                HealthCenterApi,
                HhCoursesSelectedChargeItemApi,
              ],
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: {
            target: States.DRAFT,
          },
        },
      },
      [States.DRAFT]: {
        meta: {
          name: 'Main form',
          progress: 0.4,
          status: FormModes.DRAFT,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/mainForm').then((module) =>
                  Promise.resolve(module.MainForm),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: m.overview.submitTitle,
                  type: 'primary',
                },
              ],
              write: 'all',
              read: 'all',
              delete: true,
            },
          ],
          onExit: [
            HhCoursesParticipantAvailabilityApi.configure({
              order: 0,
            }),
            HhCoursesSelectedChargeItemApi.configure({
              order: 1,
            }),
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: [
            {
              target: States.PAYMENT,
              cond: ({ application }) =>
                getChargeItems(application).length > 0 &&
                !hasCourseBeenFullyBooked(application),
            },
            {
              target: States.COMPLETED,
              cond: ({ application }) =>
                getChargeItems(application).length === 0 &&
                !hasCourseBeenFullyBooked(application),
            },
          ],
        },
      },
      [States.PAYMENT]: buildPaymentState({
        organizationId:
          InstitutionNationalIds.HEILSUGAESLA_HOFUDBORDARSVAEDISINS,
        chargeItems: getChargeItems,
        submitTarget: States.COMPLETED,
        lifecycle: {
          shouldBeListed: true,
          shouldBePruned: true,
          whenToPrune: 20 * 60 * 1000, // 20 minutes
        },
      }),
      [States.COMPLETED]: {
        meta: {
          name: 'Completed form',
          progress: 1,
          status: FormModes.COMPLETED,
          lifecycle: DefaultStateLifeCycle,
          onEntry: [
            defineTemplateApi({
              action: ApiActions.submitApplication,
              triggerEvent: DefaultEvents.SUBMIT,
            }),
          ],
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/completedForm').then((module) =>
                  Promise.resolve(module.completedForm),
                ),
              read: 'all',
              delete: true,
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
    if (nationalId === application.applicant) {
      return Roles.APPLICANT
    }
    return undefined
  },
}

export default template
