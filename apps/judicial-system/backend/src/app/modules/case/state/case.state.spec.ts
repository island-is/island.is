import { v4 as uuid } from 'uuid'

import { ForbiddenException } from '@nestjs/common'

import {
  AppealCaseState,
  CaseIndictmentRulingDecision,
  CaseState,
  CaseTransition,
  indictmentCases,
  IndictmentDecision,
  investigationCases,
  restrictionCases,
  User,
} from '@island.is/judicial-system/types'

import { Case } from '../../repository'
import { transitionCase } from './case.state'

describe('Transition Case', () => {
  // --- OPEN ---

  describe.each(indictmentCases)('open %s', (type) => {
    describe.each(Object.values(CaseState))(
      'state %s - should not open',
      (fromState) => {
        // Arrange
        const act = () =>
          transitionCase(
            CaseTransition.OPEN,
            { id: uuid(), state: fromState, type } as Case,
            { id: uuid() } as User,
          )

        // Act and assert
        expect(act).toThrow(ForbiddenException)
      },
    )
  })

  describe.each([...restrictionCases, ...investigationCases])(
    'open %s',
    (type) => {
      const allowedFromStates = [CaseState.NEW]

      describe.each(allowedFromStates)('state %s', (fromState) => {
        it('should open', () => {
          // Act
          const res = transitionCase(
            CaseTransition.OPEN,
            { id: uuid(), state: fromState, type } as Case,
            { id: uuid() } as User,
          )

          // Assert
          expect(res).toMatchObject({ state: CaseState.DRAFT })
        })
      })

      describe.each(
        Object.values(CaseState).filter(
          (state) => !allowedFromStates.includes(state),
        ),
      )('state %s - should not open', (fromState) => {
        // Arrange
        const act = () =>
          transitionCase(
            CaseTransition.OPEN,
            { id: uuid(), state: fromState, type } as Case,
            { id: uuid() } as User,
          )

        // Act and assert
        expect(act).toThrow(ForbiddenException)
      })
    },
  )

  // --- ASK FOR CONFIRMATION ---

  describe.each(indictmentCases)('ask for confirmation %s', (type) => {
    const allowedFromStates = [CaseState.DRAFT, CaseState.SUBMITTED]
    const caseWithDefendants = (fromState: CaseState) =>
      ({
        id: uuid(),
        state: fromState,
        type,
        defendants: [{ id: uuid(), name: 'Test Defendant' }],
      } as Case)

    describe.each(allowedFromStates)('state %s', (fromState) => {
      it('should ask for confirmation', () => {
        // Act
        const res = transitionCase(
          CaseTransition.ASK_FOR_CONFIRMATION,
          caseWithDefendants(fromState),
          { id: uuid() } as User,
        )

        // Assert
        expect(res).toMatchObject({
          state: CaseState.WAITING_FOR_CONFIRMATION,
        })
      })
    })

    it('should throw when 0 defendants (LÖKE/create flow guard)', () => {
      const act = () =>
        transitionCase(
          CaseTransition.ASK_FOR_CONFIRMATION,
          {
            id: uuid(),
            state: CaseState.DRAFT,
            type,
            defendants: [],
          } as unknown as Case,
          { id: uuid() } as User,
        )

      expect(act).toThrow(ForbiddenException)
      expect(act).toThrow(
        'Cannot submit indictment to court without at least one defendant',
      )
    })

    describe.each(
      Object.values(CaseState).filter(
        (state) => !allowedFromStates.includes(state),
      ),
    )('state %s - should not ask for confirmation', (fromState) => {
      // Arrange
      const act = () =>
        transitionCase(
          CaseTransition.ASK_FOR_CONFIRMATION,
          { id: uuid(), state: fromState, type } as Case,
          { id: uuid() } as User,
        )

      // Act and assert
      expect(act).toThrow(ForbiddenException)
    })
  })

  describe.each([...restrictionCases, ...investigationCases])(
    'ask for confirmation %s',
    (type) => {
      describe.each(Object.values(CaseState))(
        'state %s - should not ask for confirmation',
        (fromState) => {
          // Arrange
          const act = () =>
            transitionCase(
              CaseTransition.ASK_FOR_CONFIRMATION,
              { id: uuid(), state: fromState, type } as Case,
              { id: uuid() } as User,
            )

          // Act and assert
          expect(act).toThrow(ForbiddenException)
        },
      )
    },
  )

  // --- DENY INDICTMENT ---

  describe.each(indictmentCases)('deny indictment %s', (type) => {
    const allowedFromStates = [CaseState.WAITING_FOR_CONFIRMATION]

    describe.each(allowedFromStates)('state %s', (fromState) => {
      it('should deny indictment', () => {
        // Act
        const res = transitionCase(
          CaseTransition.DENY_INDICTMENT,
          { id: uuid(), state: fromState, type } as Case,
          { id: uuid() } as User,
        )

        // Assert
        expect(res).toMatchObject({ state: CaseState.DRAFT })
      })
    })

    describe.each(
      Object.values(CaseState).filter(
        (state) => !allowedFromStates.includes(state),
      ),
    )('state %s - should not deny indictment', (fromState) => {
      // Arrange
      const act = () =>
        transitionCase(
          CaseTransition.DENY_INDICTMENT,
          { id: uuid(), state: fromState, type } as Case,
          { id: uuid() } as User,
        )

      // Act and assert
      expect(act).toThrow(ForbiddenException)
    })
  })

  describe.each([...restrictionCases, ...investigationCases])(
    'deny indictment %s',
    (type) => {
      describe.each(Object.values(CaseState))(
        'state %s - should not deny indictment',
        (fromState) => {
          // Arrange
          const act = () =>
            transitionCase(
              CaseTransition.DENY_INDICTMENT,
              { id: uuid(), state: fromState, type } as Case,
              { id: uuid() } as User,
            )

          // Act and assert
          expect(act).toThrow(ForbiddenException)
        },
      )
    },
  )

  // --- SUBMIT ---

  describe.each(indictmentCases)('submit %s', (type) => {
    const allowedFromStates = [CaseState.WAITING_FOR_CONFIRMATION]

    describe.each(allowedFromStates)('state %s', (fromState) => {
      it('should submit', () => {
        // Act (case must have at least one defendant to submit indictment)
        const res = transitionCase(
          CaseTransition.SUBMIT,
          {
            id: uuid(),
            state: fromState,
            type,
            defendants: [{ id: uuid() }],
          } as Case,
          { id: uuid() } as User,
        )

        // Assert
        expect(res).toMatchObject({ state: CaseState.SUBMITTED })
      })
    })

    it('should throw when 0 defendants (submit guard)', () => {
      const act = () =>
        transitionCase(
          CaseTransition.SUBMIT,
          {
            id: uuid(),
            state: CaseState.WAITING_FOR_CONFIRMATION,
            type,
            defendants: [],
          } as unknown as Case,
          { id: uuid() } as User,
        )

      expect(act).toThrow(ForbiddenException)
      expect(act).toThrow(
        'Cannot submit indictment to court without at least one defendant',
      )
    })

    describe.each(
      Object.values(CaseState).filter(
        (state) => !allowedFromStates.includes(state),
      ),
    )('state %s - should not submit', (fromState) => {
      // Arrange
      const act = () =>
        transitionCase(
          CaseTransition.SUBMIT,
          { id: uuid(), state: fromState, type } as Case,
          { id: uuid() } as User,
        )

      // Act and assert
      expect(act).toThrow(ForbiddenException)
    })
  })

  describe.each([...restrictionCases, ...investigationCases])(
    'submit %s',
    (type) => {
      const allowedFromStates = [CaseState.DRAFT]

      describe.each(allowedFromStates)('state %s', (fromState) => {
        it('should submit', () => {
          // Act
          const res = transitionCase(
            CaseTransition.SUBMIT,
            { id: uuid(), state: fromState, type } as Case,
            { id: uuid() } as User,
          )

          // Assert
          expect(res).toMatchObject({ state: CaseState.SUBMITTED })
        })
      })

      describe.each(
        Object.values(CaseState).filter(
          (state) => !allowedFromStates.includes(state),
        ),
      )('state %s - should not submit', (fromState) => {
        // Arrange
        const act = () =>
          transitionCase(
            CaseTransition.SUBMIT,
            { id: uuid(), state: fromState, type } as Case,
            { id: uuid() } as User,
          )

        // Act and assert
        expect(act).toThrow(ForbiddenException)
      })
    },
  )

  // --- ASK FOR CANCELLATION ---

  describe.each(indictmentCases)('ask for cancellation %s', (type) => {
    const allowedFromStates = [CaseState.SUBMITTED, CaseState.RECEIVED]

    describe.each(allowedFromStates)('state %s', (fromState) => {
      it('should ask for cancellation', () => {
        // Act
        const res = transitionCase(
          CaseTransition.ASK_FOR_CANCELLATION,
          { id: uuid(), state: fromState, type } as Case,
          { id: uuid() } as User,
        )

        // Assert
        expect(res).toMatchObject({
          state: CaseState.WAITING_FOR_CANCELLATION,
        })
      })
    })

    describe.each(
      Object.values(CaseState).filter(
        (state) => !allowedFromStates.includes(state),
      ),
    )('state %s - should not ask for cancellation', (fromState) => {
      // Arrange
      const act = () =>
        transitionCase(
          CaseTransition.ASK_FOR_CANCELLATION,
          { id: uuid(), state: fromState, type } as Case,
          { id: uuid() } as User,
        )

      // Act and assert
      expect(act).toThrow(ForbiddenException)
    })
  })

  describe.each([...restrictionCases, ...investigationCases])(
    'ask for cancellation %s',
    (type) => {
      describe.each(Object.values(CaseState))(
        'state %s - should not ask for cancellation',
        (fromState) => {
          // Arrange
          const act = () =>
            transitionCase(
              CaseTransition.ASK_FOR_CANCELLATION,
              { id: uuid(), state: fromState, type } as Case,
              { id: uuid() } as User,
            )

          // Act and assert
          expect(act).toThrow(ForbiddenException)
        },
      )
    },
  )

  // --- RECEIVE ---

  describe.each(indictmentCases)('receive %s', (type) => {
    const allowedFromStates = [CaseState.SUBMITTED]

    describe.each(allowedFromStates)('state %s', (fromState) => {
      it('should receive', () => {
        // Act
        const res = transitionCase(
          CaseTransition.RECEIVE,
          { id: uuid(), state: fromState, type } as Case,
          { id: uuid() } as User,
        )

        // Assert
        expect(res).toMatchObject({ state: CaseState.RECEIVED })
      })
    })

    describe.each(
      Object.values(CaseState).filter(
        (state) => !allowedFromStates.includes(state),
      ),
    )('state %s - should not receive', (fromState) => {
      // Arrange
      const act = () =>
        transitionCase(
          CaseTransition.RECEIVE,
          { id: uuid(), state: fromState, type } as Case,
          { id: uuid() } as User,
        )

      // Act and assert
      expect(act).toThrow(ForbiddenException)
    })
  })

  describe.each([...restrictionCases, ...investigationCases])(
    'receive %s',
    (type) => {
      const allowedFromStates = [CaseState.SUBMITTED]

      describe.each(allowedFromStates)('state %s', (fromState) => {
        it('should receive', () => {
          // Act
          const res = transitionCase(
            CaseTransition.RECEIVE,
            { id: uuid(), state: fromState, type } as Case,
            { id: uuid() } as User,
          )

          // Assert
          expect(res).toMatchObject({ state: CaseState.RECEIVED })
        })
      })

      describe.each(
        Object.values(CaseState).filter(
          (state) => !allowedFromStates.includes(state),
        ),
      )('state %s - should not receive', (fromState) => {
        // Arrange
        const act = () =>
          transitionCase(
            CaseTransition.RECEIVE,
            { id: uuid(), state: fromState, type } as Case,
            { id: uuid() } as User,
          )

        // Act and assert
        expect(act).toThrow(ForbiddenException)
      })
    },
  )

  // --- COMPLETE ---

  describe.each(indictmentCases)('complete %s', (type) => {
    const allowedFromStates = [
      CaseState.WAITING_FOR_CANCELLATION,
      CaseState.RECEIVED,
      CaseState.CORRECTING,
    ]

    describe.each(allowedFromStates)('state %s', (fromState) => {
      it('should complete', () => {
        // Act
        const res = transitionCase(
          CaseTransition.COMPLETE,
          { id: uuid(), state: fromState, type } as Case,
          { id: uuid() } as User,
        )

        // Assert
        expect(res).toMatchObject({ state: CaseState.COMPLETED })
      })
    })

    describe.each(
      Object.values(CaseState).filter(
        (state) => !allowedFromStates.includes(state),
      ),
    )('state %s - should not complete', (fromState) => {
      // Arrange
      const act = () =>
        transitionCase(
          CaseTransition.COMPLETE,
          { id: uuid(), state: fromState, type } as Case,
          { id: uuid() } as User,
        )

      // Act and assert
      expect(act).toThrow(ForbiddenException)
    })
  })

  describe.each([...restrictionCases, ...investigationCases])(
    'complete %s',
    (type) => {
      describe.each(Object.values(CaseState))(
        'state %s - should not complete',
        (fromState) => {
          // Arrange
          const act = () =>
            transitionCase(
              CaseTransition.COMPLETE,
              { id: uuid(), state: fromState, type } as Case,
              { id: uuid() } as User,
            )

          // Act and assert
          expect(act).toThrow(ForbiddenException)
        },
      )
    },
  )

  // --- ACCEPT ---

  describe.each(indictmentCases)('accept %s', (type) => {
    describe.each(Object.values(CaseState))(
      'state %s - should not accept',
      (fromState) => {
        // Arrange
        const act = () =>
          transitionCase(
            CaseTransition.ACCEPT,
            { id: uuid(), state: fromState, type } as Case,
            { id: uuid() } as User,
          )

        // Act and assert
        expect(act).toThrow(ForbiddenException)
      },
    )
  })

  describe.each([...restrictionCases, ...investigationCases])(
    'accept %s',
    (type) => {
      const allowedFromStates = [CaseState.RECEIVED]

      describe.each(allowedFromStates)('state %s', (fromState) => {
        it('should accept', () => {
          // Act
          const res = transitionCase(
            CaseTransition.ACCEPT,
            { id: uuid(), state: fromState, type } as Case,
            { id: uuid() } as User,
          )

          // Assert
          expect(res).toMatchObject({ state: CaseState.ACCEPTED })
        })
      })

      describe.each(
        Object.values(CaseState).filter(
          (state) => !allowedFromStates.includes(state),
        ),
      )('state %s - should not accept', (fromState) => {
        // Arrange
        const act = () =>
          transitionCase(
            CaseTransition.ACCEPT,
            { id: uuid(), state: fromState, type } as Case,
            { id: uuid() } as User,
          )

        // Act and assert
        expect(act).toThrow(ForbiddenException)
      })
    },
  )

  // --- REJECT ---

  describe.each(indictmentCases)('reject %s', (type) => {
    describe.each(Object.values(CaseState))(
      'state %s - should not reject',
      (fromState) => {
        // Arrange
        const act = () =>
          transitionCase(
            CaseTransition.REJECT,
            { id: uuid(), state: fromState, type } as Case,
            { id: uuid() } as User,
          )

        // Act and assert
        expect(act).toThrow(ForbiddenException)
      },
    )
  })

  describe.each([...restrictionCases, ...investigationCases])(
    'reject %s',
    (type) => {
      const allowedFromStates = [CaseState.RECEIVED]

      describe.each(allowedFromStates)('state %s', (fromState) => {
        it('should reject', () => {
          // Act
          const res = transitionCase(
            CaseTransition.REJECT,
            { id: uuid(), state: fromState, type } as Case,
            { id: uuid() } as User,
          )

          // Assert
          expect(res).toMatchObject({ state: CaseState.REJECTED })
        })
      })

      describe.each(
        Object.values(CaseState).filter(
          (state) => !allowedFromStates.includes(state),
        ),
      )('state %s - should not reject', (fromState) => {
        // Arrange
        const act = () =>
          transitionCase(
            CaseTransition.REJECT,
            { id: uuid(), state: fromState, type } as Case,
            { id: uuid() } as User,
          )

        // Act and assert
        expect(act).toThrow(ForbiddenException)
      })
    },
  )

  // --- DISMISS ---

  describe.each(indictmentCases)('dismiss %s', (type) => {
    describe.each(Object.values(CaseState))(
      'state %s - should not dismiss',
      (fromState) => {
        // Arrange
        const act = () =>
          transitionCase(
            CaseTransition.DISMISS,
            { id: uuid(), state: fromState, type } as Case,
            { id: uuid() } as User,
          )

        // Act and assert
        expect(act).toThrow(ForbiddenException)
      },
    )
  })

  describe.each([...restrictionCases, ...investigationCases])(
    'dismiss %s',
    (type) => {
      const allowedFromStates = [CaseState.RECEIVED]

      describe.each(allowedFromStates)('state %s', (fromState) => {
        it('should dismiss', () => {
          // Act
          const res = transitionCase(
            CaseTransition.DISMISS,
            { id: uuid(), state: fromState, type } as Case,
            { id: uuid() } as User,
          )

          // Assert
          expect(res).toMatchObject({ state: CaseState.DISMISSED })
        })
      })

      describe.each(
        Object.values(CaseState).filter(
          (state) => !allowedFromStates.includes(state),
        ),
      )('state %s - should not dismiss', (fromState) => {
        // Arrange
        const act = () =>
          transitionCase(
            CaseTransition.DISMISS,
            { id: uuid(), state: fromState, type } as Case,
            { id: uuid() } as User,
          )

        // Act and assert
        expect(act).toThrow(ForbiddenException)
      })
    },
  )

  // --- DELETE ---

  describe.each(indictmentCases)('delete %s', (type) => {
    const allowedFromStates = [
      CaseState.DRAFT,
      CaseState.WAITING_FOR_CONFIRMATION,
    ]

    describe.each(allowedFromStates)('state %s', (fromState) => {
      it('should delete', () => {
        // Act
        const res = transitionCase(
          CaseTransition.DELETE,
          { id: uuid(), state: fromState, type } as Case,
          { id: uuid() } as User,
        )

        // Assert
        expect(res).toMatchObject({ state: CaseState.DELETED })
      })
    })

    describe.each(
      Object.values(CaseState).filter(
        (state) => !allowedFromStates.includes(state),
      ),
    )('state %s - should not delete', (fromState) => {
      // Arrange
      const act = () =>
        transitionCase(
          CaseTransition.DELETE,
          { id: uuid(), state: fromState, type } as Case,
          { id: uuid() } as User,
        )

      // Act and assert
      expect(act).toThrow(ForbiddenException)
    })
  })

  describe.each([...restrictionCases, ...investigationCases])(
    'delete %s',
    (type) => {
      const allowedFromStates = [
        CaseState.NEW,
        CaseState.DRAFT,
        CaseState.SUBMITTED,
        CaseState.RECEIVED,
      ]

      describe.each(allowedFromStates)('state %s', (fromState) => {
        it('should delete', () => {
          // Act
          const res = transitionCase(
            CaseTransition.DELETE,
            { id: uuid(), state: fromState, type } as Case,
            { id: uuid() } as User,
          )

          // Assert
          expect(res).toMatchObject({ state: CaseState.DELETED })
        })
      })

      describe.each(
        Object.values(CaseState).filter(
          (state) => !allowedFromStates.includes(state),
        ),
      )('state %s - should not delete', (fromState) => {
        // Arrange
        const act = () =>
          transitionCase(
            CaseTransition.DELETE,
            { id: uuid(), state: fromState, type } as Case,
            { id: uuid() } as User,
          )

        // Act and assert
        expect(act).toThrow(ForbiddenException)
      })
    },
  )

  // --- REOPEN ---

  describe.each(indictmentCases)('reopen %s', (type) => {
    const allowedFromStates = [CaseState.COMPLETED]

    describe.each(allowedFromStates)('state %s', (fromState) => {
      it('should reopen', () => {
        // Act
        const res = transitionCase(
          CaseTransition.REOPEN,
          { id: uuid(), state: fromState, type } as Case,
          { id: uuid() } as User,
        )

        // Assert
        expect(res).toMatchObject({
          state: CaseState.RECEIVED,
          indictmentDecision: IndictmentDecision.POSTPONING,
          postponedIndefinitelyExplanation: 'Mál enduropnað',
          indictmentReviewerId: null,
          courtRecordHash: null,
        })
      })

      // Test indictment ruling decision dimension
      const allowedIndictmentRulingDecisions = [
        undefined,
        CaseIndictmentRulingDecision.RULING,
        CaseIndictmentRulingDecision.FINE,
        CaseIndictmentRulingDecision.DISMISSAL,
        CaseIndictmentRulingDecision.CANCELLATION,
        CaseIndictmentRulingDecision.MERGE,
      ]

      describe.each(allowedIndictmentRulingDecisions)(
        'indictment ruling decision %s - should reopen',
        (indictmentRulingDecision) => {
          // Act
          const res = transitionCase(
            CaseTransition.REOPEN,
            {
              id: uuid(),
              state: fromState,
              type,
              indictmentRulingDecision,
            } as Case,
            { id: uuid() } as User,
          )

          // Assert
          expect(res).toMatchObject({ state: CaseState.RECEIVED })
        },
      )

      describe.each(
        Object.values(CaseIndictmentRulingDecision).filter(
          (indictmentRulingDecision) =>
            !allowedIndictmentRulingDecisions.includes(
              indictmentRulingDecision,
            ),
        ),
      )(
        'indictment ruling decision %s - should not reopen',
        (indictmentRulingDecision) => {
          // Arrange
          const act = () =>
            transitionCase(
              CaseTransition.REOPEN,
              {
                id: uuid(),
                state: fromState,
                type,
                indictmentRulingDecision,
              } as Case,
              { id: uuid() } as User,
            )

          // Act and assert
          expect(act).toThrow(ForbiddenException)
        },
      )

      it('should not reopen if case has been merged', () => {
        // Arrange
        const act = () =>
          transitionCase(
            CaseTransition.REOPEN,
            {
              id: uuid(),
              state: fromState,
              type,
              mergeCaseId: uuid(),
            } as Case,
            { id: uuid() } as User,
          )

        // Act and assert
        expect(act).toThrow(ForbiddenException)
      })

      it('should not reopen if appeal is active (APPEALED)', () => {
        // Arrange
        const act = () =>
          transitionCase(
            CaseTransition.REOPEN,
            {
              id: uuid(),
              state: fromState,
              type,
              appealCase: { appealState: AppealCaseState.APPEALED },
            } as Case,
            { id: uuid() } as User,
          )

        // Act and assert
        expect(act).toThrow(ForbiddenException)
      })

      it('should not reopen if appeal is active (RECEIVED)', () => {
        // Arrange
        const act = () =>
          transitionCase(
            CaseTransition.REOPEN,
            {
              id: uuid(),
              state: fromState,
              type,
              appealCase: { appealState: AppealCaseState.RECEIVED },
            } as Case,
            { id: uuid() } as User,
          )

        // Act and assert
        expect(act).toThrow(ForbiddenException)
      })
    })

    describe.each(
      Object.values(CaseState).filter(
        (state) => !allowedFromStates.includes(state),
      ),
    )('state %s - should not reopen', (fromState) => {
      // Arrange
      const act = () =>
        transitionCase(
          CaseTransition.REOPEN,
          { id: uuid(), state: fromState, type } as Case,
          { id: uuid() } as User,
        )

      // Act and assert
      expect(act).toThrow(ForbiddenException)
    })
  })

  // --- CORRECT ---

  describe.each(indictmentCases)('correct %s', (type) => {
    const allowedFromStates = [CaseState.COMPLETED]

    describe.each(allowedFromStates)('state %s', (fromState) => {
      it('should correct', () => {
        // Act
        const res = transitionCase(
          CaseTransition.CORRECT,
          { id: uuid(), state: fromState, type } as Case,
          { id: uuid() } as User,
        )

        // Assert
        expect(res).toMatchObject({
          state: CaseState.CORRECTING,
          courtRecordHash: null,
        })
      })

      // Test indictment ruling decision dimension
      const allowedIndictmentRulingDecisions = [
        undefined,
        CaseIndictmentRulingDecision.RULING,
        CaseIndictmentRulingDecision.FINE,
        CaseIndictmentRulingDecision.DISMISSAL,
        CaseIndictmentRulingDecision.CANCELLATION,
        CaseIndictmentRulingDecision.MERGE,
      ]

      describe.each(allowedIndictmentRulingDecisions)(
        'indictment ruling decision %s - should correct',
        (indictmentRulingDecision) => {
          // Act
          const res = transitionCase(
            CaseTransition.CORRECT,
            {
              id: uuid(),
              state: fromState,
              type,
              indictmentRulingDecision,
            } as Case,
            { id: uuid() } as User,
          )

          // Assert
          expect(res).toMatchObject({ state: CaseState.CORRECTING })
        },
      )

      describe.each(
        Object.values(CaseIndictmentRulingDecision).filter(
          (indictmentRulingDecision) =>
            !allowedIndictmentRulingDecisions.includes(
              indictmentRulingDecision,
            ),
        ),
      )(
        'indictment ruling decision %s - should not correct',
        (indictmentRulingDecision) => {
          // Arrange
          const act = () =>
            transitionCase(
              CaseTransition.CORRECT,
              {
                id: uuid(),
                state: fromState,
                type,
                indictmentRulingDecision,
              } as Case,
              { id: uuid() } as User,
            )

          // Act and assert
          expect(act).toThrow(ForbiddenException)
        },
      )
    })

    describe.each(
      Object.values(CaseState).filter(
        (state) => !allowedFromStates.includes(state),
      ),
    )('state %s - should not correct', (fromState) => {
      // Arrange
      const act = () =>
        transitionCase(
          CaseTransition.CORRECT,
          { id: uuid(), state: fromState, type } as Case,
          { id: uuid() } as User,
        )

      // Act and assert
      expect(act).toThrow(ForbiddenException)
    })
  })

  describe.each([...restrictionCases, ...investigationCases])(
    'reopen %s',
    (type) => {
      const allowedFromStates = [
        CaseState.ACCEPTED,
        CaseState.REJECTED,
        CaseState.DISMISSED,
      ]

      describe.each(allowedFromStates)('state %s', (fromState) => {
        it('should reopen', () => {
          // Act
          const res = transitionCase(
            CaseTransition.REOPEN,
            { id: uuid(), state: fromState, type } as Case,
            { id: uuid() } as User,
          )

          // Assert
          expect(res).toMatchObject({ state: CaseState.RECEIVED })
        })
      })

      describe.each(
        Object.values(CaseState).filter(
          (state) => !allowedFromStates.includes(state),
        ),
      )('state %s - should not reopen', (fromState) => {
        // Arrange
        const act = () =>
          transitionCase(
            CaseTransition.REOPEN,
            { id: uuid(), state: fromState, type } as Case,
            { id: uuid() } as User,
          )

        // Act and assert
        expect(act).toThrow(ForbiddenException)
      })
    },
  )

  // --- MOVE ---

  describe.each(indictmentCases)('move %s', (type) => {
    const allowedFromStates = [CaseState.RECEIVED]

    describe.each(allowedFromStates)('state %s', (fromState) => {
      it('should move case to submitted', () => {
        // Act
        const res = transitionCase(
          CaseTransition.MOVE,
          { id: uuid(), state: fromState, type } as Case,
          { id: uuid() } as User,
        )

        // Assert
        expect(res).toMatchObject({ state: CaseState.SUBMITTED })
      })
    })

    describe.each(
      Object.values(CaseState).filter(
        (state) => !allowedFromStates.includes(state),
      ),
    )('state %s - should not move case', (fromState) => {
      // Arrange
      const act = () =>
        transitionCase(
          CaseTransition.MOVE,
          { id: uuid(), state: fromState, type } as Case,
          { id: uuid() } as User,
        )

      // Act and assert
      expect(act).toThrow(ForbiddenException)
    })
  })

  describe.each([...restrictionCases, ...investigationCases])(
    'move %s',
    (type) => {
      const allowedFromStates = [CaseState.RECEIVED]

      describe.each(allowedFromStates)('state %s', (fromState) => {
        it('should move case to submitted', () => {
          // Act
          const res = transitionCase(
            CaseTransition.MOVE,
            { id: uuid(), state: fromState, type } as Case,
            { id: uuid() } as User,
          )

          // Assert
          expect(res).toMatchObject({ state: CaseState.SUBMITTED })
        })
      })

      describe.each(
        Object.values(CaseState).filter(
          (state) => !allowedFromStates.includes(state),
        ),
      )('state %s - should not move case', (fromState) => {
        // Arrange
        const act = () =>
          transitionCase(
            CaseTransition.MOVE,
            { id: uuid(), state: fromState, type } as Case,
            { id: uuid() } as User,
          )

        // Act and assert
        expect(act).toThrow(ForbiddenException)
      })
    },
  )
})
