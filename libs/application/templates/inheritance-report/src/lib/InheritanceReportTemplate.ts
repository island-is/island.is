import {
  coreHistoryMessages,
  pruneAfterDays,
} from '@island.is/application/core'
import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  defineTemplateApi,
  NationalRegistryV3UserApi,
  UserProfileApi,
  DefaultEvents,
  ApplicationConfigurations,
} from '@island.is/application/types'
import { m } from './messages'
import { inheritanceReportSchema } from './dataSchema'
import {
  DRAFT_PRUNE_DAYS,
  ApiActions,
  ESTATE_INHERITANCE,
  InheritanceReportEvent,
  PREPAID_INHERITANCE,
  Roles,
  States,
} from './constants'
import { EstateOnEntryApi, MaritalStatusApi } from '../dataProviders'
import { FeatureFlagClient } from '@island.is/feature-flags'
import {
  getApplicationFeatureFlags,
  InheritanceReportFeatureFlags,
} from './getApplicationFeatureFlags'
import { CodeOwners } from '@island.is/shared/constants'
import { InheritanceReportExternalData } from '../types'

const configuration =
  ApplicationConfigurations[ApplicationTypes.INHERITANCE_REPORT]

const haveAllSignatoriesSigned = (context: ApplicationContext) => {
  const externalData = context.application
    .externalData as InheritanceReportExternalData
  const signatories = externalData?.getSignatories?.data?.signatories || []
  return signatories.length > 0 && signatories.every((s) => s.signed)
}

const InheritanceReportTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<InheritanceReportEvent>,
  InheritanceReportEvent
> = {
  type: ApplicationTypes.INHERITANCE_REPORT,
  name: ({ answers }) =>
    answers.applicationFor === PREPAID_INHERITANCE
      ? m.prerequisitesTitle.defaultMessage +
        ' - ' +
        m.applicationNamePrepaid.defaultMessage
      : answers.applicationFor === ESTATE_INHERITANCE
      ? m.prerequisitesTitle.defaultMessage +
        ' - ' +
        m.applicationNameEstate.defaultMessage
      : m.prerequisitesTitle.defaultMessage,
  codeOwner: CodeOwners.Juni,
  institution: m.institution,
  dataSchema: inheritanceReportSchema,
  translationNamespaces: configuration.translation,
  allowMultipleApplicationsInDraft: false,
  stateMachineConfig: {
    initial: States.prerequisites,
    states: {
      [States.prerequisites]: {
        meta: {
          name: '',
          status: 'draft',
          progress: 0,
          lifecycle: pruneAfterDays(DRAFT_PRUNE_DAYS),
          roles: [
            {
              id: Roles.ESTATE_INHERITANCE_APPLICANT,
              formLoader: async ({ featureFlagClient }) => {
                const featureFlags = await getApplicationFeatureFlags(
                  featureFlagClient as FeatureFlagClient,
                )

                const getForm = await import('../forms/prerequisites').then(
                  (val) => val.getForm,
                )

                return getForm({
                  allowEstateApplication:
                    featureFlags[
                      InheritanceReportFeatureFlags.AllowEstateApplication
                    ],
                  allowPrepaidApplication:
                    featureFlags[
                      InheritanceReportFeatureFlags.AllowPrepaidApplication
                    ],
                })
              },
              actions: [{ event: 'SUBMIT', name: '', type: 'primary' }],
              write: 'all',
              delete: true,
            },
          ],
          actionCard: {
            displayPruneAt: true,
            historyLogs: [
              {
                logMessage: coreHistoryMessages.applicationStarted,
                onEvent: DefaultEvents.SUBMIT,
              },
            ],
          },
        },
        on: {
          SUBMIT: {
            target: States.draft,
          },
        },
      },
      [States.draft]: {
        meta: {
          name: '',
          status: 'draft',
          progress: 0.15,
          lifecycle: pruneAfterDays(DRAFT_PRUNE_DAYS),
          actionCard: {
            displayPruneAt: true,
            // Submission to syslumenn happens on entry to the signing state
            // (reached via this SUBMIT transition), so log "applicationSent"
            // here rather than on the later signing -> done finalization.
            historyLogs: [
              {
                logMessage: coreHistoryMessages.applicationSent,
                onEvent: DefaultEvents.SUBMIT,
              },
            ],
          },
          roles: [
            {
              id: Roles.ESTATE_INHERITANCE_APPLICANT,
              formLoader: () =>
                import('../forms/form').then((module) =>
                  Promise.resolve(module.estateInheritanceForm),
                ),
              actions: [{ event: 'SUBMIT', name: '', type: 'primary' }],
              write: 'all',
              delete: true,
              api: [
                NationalRegistryV3UserApi,
                UserProfileApi,
                EstateOnEntryApi,
              ],
            },
            {
              id: Roles.PREPAID_INHERITANCE_APPLICANT,
              formLoader: () =>
                import('../forms/form').then((module) =>
                  Promise.resolve(module.prepaidInheritanceForm),
                ),
              actions: [{ event: 'SUBMIT', name: '', type: 'primary' }],
              write: 'all',
              delete: true,
              api: [
                NationalRegistryV3UserApi,
                UserProfileApi,
                EstateOnEntryApi,
                MaritalStatusApi,
              ],
            },
          ],
        },
        on: {
          SUBMIT: {
            target: States.signing,
          },
        },
      },
      [States.signing]: {
        meta: {
          name: 'Signing',
          status: 'inprogress',
          progress: 0.85,
          lifecycle: {
            shouldBeListed: true,
            shouldBePruned: true,
            whenToPrune: 90 * 24 * 3600 * 1000, // 90 days
          },
          // Submit the report to syslumenn on entry, then optionally email a
          // copy of the application to the parties (when the applicant opted
          // in). Sending the copy must never block submission.
          onEntry: [
            defineTemplateApi({
              action: ApiActions.submitToSyslumenn,
              throwOnError: true,
              order: 0,
            }),
            defineTemplateApi({
              action: ApiActions.sendApplicationCopyToParties,
              shouldPersistToExternalData: true,
              externalDataId: 'sendApplicationCopyToParties',
              throwOnError: false,
              order: 1,
            }),
          ],
          actionCard: {
            pendingAction: (application) => {
              const externalData =
                application.externalData as InheritanceReportExternalData
              const signatories =
                externalData?.getSignatories?.data?.signatories || []

              // No signatories tracked: show a neutral "submitted" confirmation
              // instead of a misleading pending state.
              if (signatories.length === 0) {
                return {
                  title: m.applicationSubmittedTitle,
                  content: m.applicationSubmittedDescription,
                  displayStatus: 'info',
                }
              }

              const allSigned = signatories.every((s) => s.signed)

              if (allSigned) {
                return {
                  title: m.signingCompleteTitle,
                  content: m.signingCompleteDescription,
                  displayStatus: 'success',
                }
              }

              return {
                title: m.signingPendingTitle,
                content: m.signingPendingDescription,
                displayStatus: 'info',
              }
            },
          },
          roles: [
            Roles.ESTATE_INHERITANCE_APPLICANT,
            Roles.PREPAID_INHERITANCE_APPLICANT,
          ].map((roleId) => ({
            id: roleId,
            formLoader: () =>
              import('../forms/signing').then((val) =>
                Promise.resolve(val.signingForm),
              ),
            actions: [
              {
                event: DefaultEvents.SUBMIT,
                name: '',
                type: 'primary' as const,
              },
            ],
            write: 'all' as const,
            read: 'all' as const,
            api: [
              defineTemplateApi({
                action: ApiActions.getSignatories,
                shouldPersistToExternalData: true,
                externalDataId: 'getSignatories',
                throwOnError: false,
              }),
            ],
          })),
        },
        on: {
          // Finalize only once all parties have signed at syslumenn. The signing
          // form only surfaces the finish button when this condition is met,
          // so this acts as an auto-completion on the applicant's next visit.
          SUBMIT: {
            target: States.done,
            cond: haveAllSignatoriesSigned,
          },
        },
      },
      [States.done]: {
        meta: {
          name: 'Done',
          status: 'completed',
          progress: 1,
          lifecycle: pruneAfterDays(60),
          actionCard: {
            displayPruneAt: true,
          },
          roles: [
            Roles.ESTATE_INHERITANCE_APPLICANT,
            Roles.PREPAID_INHERITANCE_APPLICANT,
          ].map((roleId) => ({
            id: roleId,
            formLoader: () =>
              import('../forms/done').then((val) => Promise.resolve(val.done)),
            read: 'all' as const,
          })),
        },
      },
    },
  },
  mapUserToRole(
    nationalId: string,
    application: Application,
  ): ApplicationRole | undefined {
    const { applicant } = application

    if (applicant === nationalId) {
      if (application.answers.applicationFor === PREPAID_INHERITANCE) {
        return Roles.PREPAID_INHERITANCE_APPLICANT
      }
      return Roles.ESTATE_INHERITANCE_APPLICANT
    }

    return undefined
  },
}

export default InheritanceReportTemplate
