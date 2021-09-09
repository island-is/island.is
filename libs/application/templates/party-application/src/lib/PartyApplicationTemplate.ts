import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  DefaultEvents,
  DefaultStateLifeCycle,
} from '@island.is/application/core'
import { dataSchema } from './dataSchema'
import { assign } from 'xstate'
import { ApiModuleActions, States, Roles } from '../constants'
import { EndorsementListTags } from '../constants'

const getConstituencyAdmins = (constituency: EndorsementListTags) => {
  switch (constituency) {
    case 'partyApplicationReykjavikurkjordaemiSudur2021': {
      return (
        process.env.PARTY_APPLICATION_RVK_SOUTH_ASSIGNED_ADMINS?.split(',') ??
        []
      )
    }
    case 'partyApplicationReykjavikurkjordaemiNordur2021': {
      return (
        process.env.PARTY_APPLICATION_RVK_NORTH_ASSIGNED_ADMINS?.split(',') ??
        []
      )
    }
    case 'partyApplicationSudvesturkjordaemi2021': {
      return (
        process.env.PARTY_APPLICATION_SOUTH_WEST_ASSIGNED_ADMINS?.split(',') ??
        []
      )
    }
    case 'partyApplicationNordvesturkjordaemi2021': {
      return (
        process.env.PARTY_APPLICATION_NORTH_WEST_ASSIGNED_ADMINS?.split(',') ??
        []
      )
    }
    case 'partyApplicationNordausturkjordaemi2021': {
      return (
        process.env.PARTY_APPLICATION_NORTH_ASSIGNED_ADMINS?.split(',') ?? []
      )
    }
    case 'partyApplicationSudurkjordaemi2021': {
      return (
        process.env.PARTY_APPLICATION_SOUTH_ASSIGNED_ADMINS?.split(',') ?? []
      )
    }
    default: {
      return []
    }
  }
}
type Events =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.ASSIGN }
  | { type: DefaultEvents.REJECT }
  | { type: DefaultEvents.EDIT }

const PartyApplicationTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.PARTY_APPLICATION,
  name: 'Framboð',
  dataSchema,
  readyForProduction: true,
  stateMachineConfig: {
    initial: States.DRAFT,
    states: {
      [States.DRAFT]: {
        meta: {
          name: States.DRAFT,
          progress: 0.25,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/ConstituencyForm').then((module) =>
                  Promise.resolve(module.ConstituencyForm),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Hefja söfnun',
                  type: 'primary',
                },
              ],
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: {
            target: States.COLLECT_ENDORSEMENTS,
          },
        },
      },
      [States.COLLECT_ENDORSEMENTS]: {
        meta: {
          name: 'Safna meðmælum',
          progress: 0.75,
          lifecycle: DefaultStateLifeCycle,
          onEntry: {
            apiModuleAction: ApiModuleActions.CreateEndorsementList,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/CollectEndorsementsForm').then((val) =>
                  Promise.resolve(val.CollectEndorsementsForm),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Submit',
                  type: 'primary',
                },
              ],
              read: 'all',
              write: 'all',
            },
            {
              id: Roles.SIGNATUREE,
              formLoader: () =>
                import('../forms/EndorsementForm').then((val) =>
                  Promise.resolve(val.EndorsementApplication),
                ),
              read: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: {
            target: States.IN_REVIEW,
          },
        },
      },
      [States.REJECTED]: {
        meta: {
          name: 'Safna meðmælum',
          progress: 0.75,
          lifecycle: DefaultStateLifeCycle,
          onEntry: {
            apiModuleAction: ApiModuleActions.ApplicationRejected,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/CollectEndorsementsForm').then((val) =>
                  Promise.resolve(val.CollectEndorsementsForm),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Submit',
                  type: 'primary',
                },
              ],
              read: 'all',
              write: 'all',
            },
            {
              id: Roles.SIGNATUREE,
              formLoader: () =>
                import('../forms/EndorsementForm').then((val) =>
                  Promise.resolve(val.EndorsementApplication),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Submit',
                  type: 'primary',
                },
              ],
              read: 'all',
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: {
            target: States.IN_REVIEW,
          },
        },
      },
      [States.IN_REVIEW]: {
        entry: 'assignToSupremeCourt',
        meta: {
          name: 'In Review',
          progress: 0.9,
          lifecycle: DefaultStateLifeCycle,
          onEntry: {
            apiModuleAction: ApiModuleActions.AssignSupremeCourt,
          },
          roles: [
            {
              id: Roles.ASSIGNEE,
              formLoader: () =>
                import('../forms/InReview').then((module) =>
                  Promise.resolve(module.InReview),
                ),
              actions: [
                {
                  event: DefaultEvents.APPROVE,
                  name: 'Samþykkja',
                  type: 'primary',
                },
                { event: DefaultEvents.REJECT, name: 'Hafna', type: 'reject' },
              ],
              read: 'all',
              write: 'all',
            },
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Approved').then((module) =>
                  Promise.resolve(module.Approved),
                ),
              read: 'all',
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.APPROVE]: [
            {
              target: States.APPROVED,
            },
          ],
          [DefaultEvents.REJECT]: { target: States.REJECTED },
        },
      },
      [States.APPROVED]: {
        entry: 'assignToSupremeCourt',
        meta: {
          name: States.APPROVED,
          progress: 1,
          lifecycle: DefaultStateLifeCycle,
          onEntry: {
            apiModuleAction: ApiModuleActions.ApplicationApproved,
          },
          roles: [
            {
              id: Roles.ASSIGNEE,
              formLoader: () =>
                import('../forms/ApprovedOverview').then((val) =>
                  Promise.resolve(val.Approved),
                ),
              read: 'all',
            },
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Approved').then((val) =>
                  Promise.resolve(val.Approved),
                ),
              read: 'all',
            },
          ],
        },
        type: 'final' as const,
      },
    },
  },
  stateMachineOptions: {
    actions: {
      assignToSupremeCourt: assign((context) => {
        return {
          ...context,
          application: {
            ...context.application,
            assignees: getConstituencyAdmins(
              context.application.answers.constituency as EndorsementListTags,
            ),
          },
        }
      }),
    },
  },
  mapUserToRole(
    nationalId: string,
    application: Application,
  ): ApplicationRole | undefined {
    if (application.assignees.includes(nationalId)) {
      return Roles.ASSIGNEE
    } else if (application.applicant === nationalId) {
      return Roles.APPLICANT
    } else if (
      application.state === States.COLLECT_ENDORSEMENTS ||
      application.state === States.REJECTED
    ) {
      // everyone can be signaturee if they are not the applicant
      return Roles.SIGNATUREE
    } else {
      return undefined
    }
  },
}

export default PartyApplicationTemplate
