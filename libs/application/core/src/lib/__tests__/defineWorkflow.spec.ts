import { defineWorkflow } from '../defineWorkflow'
import {
  ApplicationStateMeta,
  DefaultEvents,
  StateLifeCycle,
} from '@island.is/application/types'

const pruneAfterDays = (days: number): StateLifeCycle => ({
  shouldBeListed: true,
  shouldBePruned: true,
  whenToPrune: days * 24 * 3600 * 1000,
})

describe('defineWorkflow — golden-file parity with XState parental-leave', () => {
  it('produces structurally identical ApplicationStateMeta for prerequisites phase', () => {
    const { stateMachineConfig } = defineWorkflow({
      initialPhase: 'prerequisites',
      phases: {
        prerequisites: {
          name: 'prerequisites',
          status: 'draft',
          lifecycle: {
            shouldBeListed: false,
            shouldBePruned: true,
            whenToPrune: 7 * 24 * 3600 * 1000,
          },
          actionCard: {
            historyLogs: [
              {
                onEvent: DefaultEvents.SUBMIT,
                logMessage: 'Application started',
              },
            ],
          },
          roles: [
            {
              id: 'applicant',
              formLoader: () =>
                Promise.resolve({} as any),
              actions: [
                { event: DefaultEvents.SUBMIT, name: 'Submit', type: 'primary' as const },
              ],
              write: 'all',
              delete: true,
            },
          ],
          exit: [
            'otherParentToSpouse',
            'attemptToSetPrimaryParentAsOtherParent',
            'setRightsToOtherParent',
            'setMultipleBirthsIfNo',
          ],
          transitions: {
            SUBMIT: 'draft',
          },
        },
        draft: {
          name: 'draft',
          status: 'draft',
          lifecycle: pruneAfterDays(970),
          entry: 'clearAssignees',
          exit: [
            'clearOtherParentDataIfSelectedNo',
            'setOtherParentIdIfSelectedSpouse',
          ],
          actionCard: {
            historyLogs: {
              onEvent: DefaultEvents.SUBMIT,
              logMessage: 'Application sent',
            },
          },
          roles: [
            {
              id: 'applicant',
              formLoader: () =>
                Promise.resolve({} as any),
              actions: [
                { event: DefaultEvents.SUBMIT, name: 'Submit', type: 'primary' as const },
              ],
              write: 'all',
              delete: true,
            },
          ],
          transitions: {
            SUBMIT: [
              { target: 'otherParentApproval', guard: 'needsOtherParentApproval' },
              { target: 'employerWaitingToAssign', guard: 'hasEmployer' },
              { target: 'vinnumalastofnunApproval' },
            ],
          },
        },
        otherParentApproval: {
          name: 'otherParentApproval',
          status: 'inprogress',
          lifecycle: pruneAfterDays(970),
          actionCard: {
            pendingAction: {
              displayStatus: 'warning',
              title: 'Waiting for other parent',
            },
            historyLogs: [
              { onEvent: DefaultEvents.APPROVE, logMessage: 'Other parent approved' },
              { onEvent: DefaultEvents.REJECT, logMessage: 'Other parent rejected' },
            ],
          },
          roles: [
            {
              id: 'assignee',
              formLoader: () => Promise.resolve({} as any),
              actions: [
                { event: DefaultEvents.APPROVE, name: 'Approve', type: 'primary' as const },
                { event: DefaultEvents.REJECT, name: 'Reject', type: 'reject' as const },
              ],
              read: { answers: ['requestRights', 'periods'] },
              write: { answers: ['requestRights', 'periods'] },
            },
            {
              id: 'applicant',
              formLoader: () => Promise.resolve({} as any),
              read: 'all',
              write: 'all',
              delete: true,
            },
          ],
          transitions: {
            [DefaultEvents.APPROVE]: [
              { target: 'employerWaitingToAssign', guard: 'hasEmployer' },
              { target: 'vinnumalastofnunApproval' },
            ],
            [DefaultEvents.REJECT]: 'otherParentRequiresAction',
            [DefaultEvents.EDIT]: 'draft',
          },
        },
        otherParentRequiresAction: {
          name: 'otherParentRequiresAction',
          status: 'inprogress',
          lifecycle: pruneAfterDays(970),
          roles: [],
          transitions: {
            [DefaultEvents.EDIT]: 'draft',
          },
        },
        employerWaitingToAssign: {
          name: 'employerWaitingToAssign',
          status: 'inprogress',
          lifecycle: pruneAfterDays(970),
          roles: [],
          transitions: {
            [DefaultEvents.ASSIGN]: 'employerApproval',
            [DefaultEvents.EDIT]: 'draft',
          },
        },
        employerApproval: {
          name: 'employerApproval',
          status: 'inprogress',
          lifecycle: pruneAfterDays(970),
          roles: [],
          transitions: {
            [DefaultEvents.APPROVE]: [
              { target: 'vinnumalastofnunApproval', guard: 'allEmployersHaveApproved' },
              { target: 'employerWaitingToAssign' },
            ],
            [DefaultEvents.REJECT]: 'employerRequiresAction',
            [DefaultEvents.EDIT]: 'draft',
          },
        },
        employerRequiresAction: {
          name: 'employerRequiresAction',
          status: 'inprogress',
          lifecycle: pruneAfterDays(970),
          roles: [],
          transitions: {
            [DefaultEvents.EDIT]: 'draft',
          },
        },
        vinnumalastofnunApproval: {
          name: 'vinnumalastofnunApproval',
          status: 'inprogress',
          lifecycle: pruneAfterDays(970),
          roles: [],
          transitions: {
            [DefaultEvents.APPROVE]: 'approved',
            [DefaultEvents.REJECT]: 'vinnumalastofnunRequiresAction',
          },
        },
        vinnumalastofnunRequiresAction: {
          name: 'vinnumalastofnunRequiresAction',
          status: 'inprogress',
          lifecycle: pruneAfterDays(970),
          roles: [],
          transitions: {
            [DefaultEvents.EDIT]: 'draft',
          },
        },
        approved: {
          name: 'approved',
          status: 'approved',
          lifecycle: { shouldBeListed: true, shouldBePruned: false },
          roles: [],
          transitions: {
            [DefaultEvents.EDIT]: 'editOrAddEmployersAndPeriods',
          },
        },
        closed: {
          name: 'closed',
          status: 'completed',
          lifecycle: { shouldBeListed: true, shouldBePruned: false },
          roles: [],
        },
        editOrAddEmployersAndPeriods: {
          name: 'editOrAddEmployersAndPeriods',
          status: 'inprogress',
          lifecycle: pruneAfterDays(970),
          roles: [],
          transitions: {
            [DefaultEvents.SUBMIT]: [
              { target: 'employerWaitingToAssignForEdits', guard: 'hasEmployer' },
              { target: 'vinnumalastofnunApproveEdits' },
            ],
          },
        },
        employerWaitingToAssignForEdits: {
          name: 'employerWaitingToAssignForEdits',
          status: 'inprogress',
          lifecycle: pruneAfterDays(970),
          roles: [],
          transitions: {},
        },
        vinnumalastofnunApproveEdits: {
          name: 'vinnumalastofnunApproveEdits',
          status: 'inprogress',
          lifecycle: pruneAfterDays(970),
          roles: [],
          transitions: {
            [DefaultEvents.APPROVE]: 'approved',
          },
        },
      },
      guards: {
        needsOtherParentApproval: (ctx) => false,
        hasEmployer: (ctx) => false,
        allEmployersHaveApproved: (ctx) => false,
      },
    })

    expect(stateMachineConfig.initial).toBe('prerequisites')

    const prereqState = stateMachineConfig.states['prerequisites']
    const prereqMeta = prereqState.meta as ApplicationStateMeta

    expect(prereqMeta.name).toBe('prerequisites')
    expect(prereqMeta.status).toBe('draft')
    expect(prereqMeta.lifecycle).toEqual({
      shouldBeListed: false,
      shouldBePruned: true,
      whenToPrune: 7 * 24 * 3600 * 1000,
    })
    expect(prereqMeta.roles).toHaveLength(1)
    expect(prereqMeta.roles![0].id).toBe('applicant')
    expect(prereqMeta.roles![0].actions).toEqual([
      { event: DefaultEvents.SUBMIT, name: 'Submit', type: 'primary' },
    ])
    expect(prereqState.exit).toEqual([
      'otherParentToSpouse',
      'attemptToSetPrimaryParentAsOtherParent',
      'setRightsToOtherParent',
      'setMultipleBirthsIfNo',
    ])
    expect(prereqState.on).toEqual({ SUBMIT: 'draft' })
  })

  it('compiles transitions with guards to XState cond format', () => {
    const { stateMachineConfig } = defineWorkflow({
      initialPhase: 'draft',
      phases: {
        draft: {
          name: 'draft',
          status: 'draft',
          lifecycle: pruneAfterDays(30),
          transitions: {
            SUBMIT: [
              { target: 'otherParentApproval', guard: 'needsOtherParentApproval' },
              { target: 'employerWaitingToAssign', guard: 'hasEmployer' },
              { target: 'vinnumalastofnunApproval' },
            ],
          },
        },
        otherParentApproval: {
          name: 'otherParentApproval',
          status: 'inprogress',
          lifecycle: pruneAfterDays(30),
        },
        employerWaitingToAssign: {
          name: 'employerWaitingToAssign',
          status: 'inprogress',
          lifecycle: pruneAfterDays(30),
        },
        vinnumalastofnunApproval: {
          name: 'vinnumalastofnunApproval',
          status: 'inprogress',
          lifecycle: pruneAfterDays(30),
        },
      },
      guards: {
        needsOtherParentApproval: () => true,
        hasEmployer: () => false,
      },
    })

    const draftOn = stateMachineConfig.states['draft'].on ?? {}
    expect(draftOn.SUBMIT).toEqual([
      { target: 'otherParentApproval', cond: 'needsOtherParentApproval' },
      { target: 'employerWaitingToAssign', cond: 'hasEmployer' },
      { target: 'vinnumalastofnunApproval' },
    ])
  })

  it('produces meta with all ApplicationStateMeta fields', () => {
    const { stateMachineConfig } = defineWorkflow({
      initialPhase: 'draft',
      phases: {
        draft: {
          name: 'Draft',
          status: 'draft',
          lifecycle: { shouldBeListed: true, shouldBePruned: false },
          progress: 0.5,
          actionCard: {
            historyLogs: [
              { onEvent: 'SUBMIT', logMessage: 'Submitted' },
            ],
            pendingAction: {
              displayStatus: 'info',
              title: 'In progress',
              content: 'Complete your application',
            },
            displayPruneAt: true,
          },
          roles: [
            {
              id: 'applicant',
              read: 'all',
              write: 'all',
              delete: true,
              formLoader: () => Promise.resolve({} as any),
              actions: [{ event: 'SUBMIT', name: 'Submit', type: 'primary' as const }],
            },
          ],
          onEntry: [{ action: 'fetchData' } as any],
          onExit: [{ action: 'validateData' } as any],
          onDelete: [{ action: 'cleanup' } as any],
        },
      },
    })

    const meta = stateMachineConfig.states['draft'].meta as ApplicationStateMeta
    expect(meta.name).toBe('Draft')
    expect(meta.status).toBe('draft')
    expect(meta.progress).toBe(0.5)
    expect(meta.lifecycle).toEqual({ shouldBeListed: true, shouldBePruned: false })
    expect(meta.roles).toHaveLength(1)
    expect(meta.actionCard?.pendingAction).toEqual({
      displayStatus: 'info',
      title: 'In progress',
      content: 'Complete your application',
    })
    expect(meta.actionCard?.displayPruneAt).toBe(true)
    expect(meta.onEntry).toEqual([{ action: 'fetchData' }])
    expect(meta.onExit).toEqual([{ action: 'validateData' }])
    expect(meta.onDelete).toEqual([{ action: 'cleanup' }])
  })

  it('stores guards in stateMachineOptions.guards', () => {
    const guardFn = () => true
    const { stateMachineOptions } = defineWorkflow({
      initialPhase: 'draft',
      phases: {
        draft: {
          name: 'Draft',
          status: 'draft',
          lifecycle: { shouldBeListed: true, shouldBePruned: false },
        },
      },
      guards: {
        myGuard: guardFn,
      },
    })

    expect(stateMachineOptions.guards).toBeDefined()
    expect(stateMachineOptions.guards!['myGuard']).toBe(guardFn)
  })

  it('handles cycles (REJECT -> draft -> SUBMIT -> inReview)', () => {
    const { stateMachineConfig } = defineWorkflow({
      initialPhase: 'draft',
      phases: {
        draft: {
          name: 'draft',
          status: 'draft',
          lifecycle: pruneAfterDays(30),
          transitions: { SUBMIT: 'inReview' },
        },
        inReview: {
          name: 'inReview',
          status: 'inprogress',
          lifecycle: pruneAfterDays(30),
          transitions: {
            APPROVE: 'done',
            REJECT: 'draft',
          },
        },
        done: {
          name: 'done',
          status: 'completed',
          lifecycle: { shouldBeListed: true, shouldBePruned: false },
        },
      },
    })

    expect(stateMachineConfig.states['inReview'].on?.REJECT).toBe('draft')
    expect(stateMachineConfig.states['inReview'].on?.APPROVE).toBe('done')
    expect(stateMachineConfig.states['draft'].on?.SUBMIT).toBe('inReview')
  })
})
