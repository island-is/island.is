import { v4 as uuid } from 'uuid'

import { ForbiddenException } from '@nestjs/common'

import {
  CaseAppealRulingDecision,
  CaseAppealState,
  CaseIndictmentRulingDecision,
  CaseState,
  CaseTransition,
  indictmentCases,
  InstitutionType,
  investigationCases,
  restrictionCases,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { AppealCase, Case } from '../../repository'
import { transitionCase } from './case.state'

// Builds appealCase props for a Case object.
// undefined = no appeal case record exists in DB.
// CaseAppealState value = appeal case record exists with that state.
const withAppealCase = (appealState?: CaseAppealState) =>
  appealState !== undefined ? { appealCase: { appealState } as AppealCase } : {}

// All possible appeal state options including "no appeal case"
const allAppealOptions: (CaseAppealState | undefined)[] = [
  undefined,
  ...Object.values(CaseAppealState),
]

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
        it('no appeal case - should open', () => {
          // Act
          const res = transitionCase(
            CaseTransition.OPEN,
            { id: uuid(), state: fromState, type } as Case,
            { id: uuid() } as User,
          )

          // Assert
          expect(res).toMatchObject({ state: CaseState.DRAFT })
        })

        it.each(Object.values(CaseAppealState))(
          'appeal state %s - should not open',
          (fromAppealState) => {
            // Arrange
            const act = () =>
              transitionCase(
                CaseTransition.OPEN,
                {
                  id: uuid(),
                  state: fromState,
                  ...withAppealCase(fromAppealState),
                  type,
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
      )('state %s', (fromState) => {
        it.each(allAppealOptions)(
          'appeal state %s - should not open',
          (fromAppealState) => {
            // Arrange
            const act = () =>
              transitionCase(
                CaseTransition.OPEN,
                {
                  id: uuid(),
                  state: fromState,
                  ...withAppealCase(fromAppealState),
                  type,
                } as Case,
                { id: uuid() } as User,
              )

            // Act and assert
            expect(act).toThrow(ForbiddenException)
          },
        )
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
      it('no appeal case - should ask for confirmation', () => {
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

      it.each(Object.values(CaseAppealState))(
        'appeal state %s - should not ask for confirmation',
        (fromAppealState) => {
          // Arrange
          const act = () =>
            transitionCase(
              CaseTransition.ASK_FOR_CONFIRMATION,
              {
                ...caseWithDefendants(fromState),
                ...withAppealCase(fromAppealState),
              } as Case,
              { id: uuid() } as User,
            )

          // Act and assert
          expect(act).toThrow(ForbiddenException)
        },
      )
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
      describe.each(Object.values(CaseState))('state %s', (fromState) => {
        it.each(allAppealOptions)(
          'appeal state %s - should not ask for confirmation',
          (fromAppealState) => {
            // Arrange
            const act = () =>
              transitionCase(
                CaseTransition.ASK_FOR_CONFIRMATION,
                {
                  id: uuid(),
                  state: fromState,
                  ...withAppealCase(fromAppealState),
                  type,
                } as Case,
                { id: uuid() } as User,
              )

            // Act and assert
            expect(act).toThrow(ForbiddenException)
          },
        )
      })
    },
  )

  // --- DENY INDICTMENT ---

  describe.each(indictmentCases)('deny indictment %s', (type) => {
    const allowedFromStates = [CaseState.WAITING_FOR_CONFIRMATION]

    describe.each(allowedFromStates)('state %s', (fromState) => {
      it('no appeal case - should deny indictment', () => {
        // Act
        const res = transitionCase(
          CaseTransition.DENY_INDICTMENT,
          { id: uuid(), state: fromState, type } as Case,
          { id: uuid() } as User,
        )

        // Assert
        expect(res).toMatchObject({ state: CaseState.DRAFT })
      })

      it.each(Object.values(CaseAppealState))(
        'appeal state %s - should not deny indictment',
        (fromAppealState) => {
          // Arrange
          const act = () =>
            transitionCase(
              CaseTransition.DENY_INDICTMENT,
              {
                id: uuid(),
                state: fromState,
                ...withAppealCase(fromAppealState),
                type,
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
      describe.each(Object.values(CaseState))('state %s', (fromState) => {
        it.each(allAppealOptions)(
          'appeal state %s - should not deny indictment',
          (fromAppealState) => {
            // Arrange
            const act = () =>
              transitionCase(
                CaseTransition.DENY_INDICTMENT,
                {
                  id: uuid(),
                  state: fromState,
                  ...withAppealCase(fromAppealState),
                  type,
                } as Case,
                { id: uuid() } as User,
              )

            // Act and assert
            expect(act).toThrow(ForbiddenException)
          },
        )
      })
    },
  )

  // --- SUBMIT ---

  describe.each(indictmentCases)('submit %s', (type) => {
    const allowedFromStates = [CaseState.WAITING_FOR_CONFIRMATION]

    describe.each(allowedFromStates)('state %s', (fromState) => {
      it('no appeal case - should submit', () => {
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

      it.each(Object.values(CaseAppealState))(
        'appeal state %s - should not submit',
        (fromAppealState) => {
          // Arrange
          const act = () =>
            transitionCase(
              CaseTransition.SUBMIT,
              {
                id: uuid(),
                state: fromState,
                ...withAppealCase(fromAppealState),
                type,
                defendants: [{ id: uuid() }],
              } as Case,
              { id: uuid() } as User,
            )

          // Act and assert
          expect(act).toThrow(ForbiddenException)
        },
      )
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
        it('no appeal case - should submit', () => {
          // Act
          const res = transitionCase(
            CaseTransition.SUBMIT,
            { id: uuid(), state: fromState, type } as Case,
            { id: uuid() } as User,
          )

          // Assert
          expect(res).toMatchObject({ state: CaseState.SUBMITTED })
        })

        it.each(Object.values(CaseAppealState))(
          'appeal state %s - should not submit',
          (fromAppealState) => {
            // Arrange
            const act = () =>
              transitionCase(
                CaseTransition.SUBMIT,
                {
                  id: uuid(),
                  state: fromState,
                  ...withAppealCase(fromAppealState),
                  type,
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
      )('state %s', (fromState) => {
        it.each(allAppealOptions)(
          'appeal state %s - should not submit',
          (fromAppealState) => {
            // Arrange
            const act = () =>
              transitionCase(
                CaseTransition.SUBMIT,
                {
                  id: uuid(),
                  state: fromState,
                  ...withAppealCase(fromAppealState),
                  type,
                } as Case,
                { id: uuid() } as User,
              )

            // Act and assert
            expect(act).toThrow(ForbiddenException)
          },
        )
      })
    },
  )

  // --- ASK FOR CANCELLATION ---

  describe.each(indictmentCases)('ask for cancellation %s', (type) => {
    const allowedFromStates = [CaseState.SUBMITTED, CaseState.RECEIVED]

    describe.each(allowedFromStates)('state %s', (fromState) => {
      it('no appeal case - should ask for cancellation', () => {
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

      it.each(Object.values(CaseAppealState))(
        'appeal state %s - should not ask for cancellation',
        (fromAppealState) => {
          // Arrange
          const act = () =>
            transitionCase(
              CaseTransition.ASK_FOR_CANCELLATION,
              {
                id: uuid(),
                state: fromState,
                ...withAppealCase(fromAppealState),
                type,
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
      describe.each(Object.values(CaseState))('state %s', (fromState) => {
        it.each(allAppealOptions)(
          'appeal state %s - should not ask for cancellation',
          (fromAppealState) => {
            // Arrange
            const act = () =>
              transitionCase(
                CaseTransition.ASK_FOR_CANCELLATION,
                {
                  id: uuid(),
                  state: fromState,
                  ...withAppealCase(fromAppealState),
                  type,
                } as Case,
                { id: uuid() } as User,
              )

            // Act and assert
            expect(act).toThrow(ForbiddenException)
          },
        )
      })
    },
  )

  // --- RECEIVE ---

  describe.each(indictmentCases)('receive %s', (type) => {
    const allowedFromStates = [CaseState.SUBMITTED]

    describe.each(allowedFromStates)('state %s', (fromState) => {
      it('no appeal case - should receive', () => {
        // Act
        const res = transitionCase(
          CaseTransition.RECEIVE,
          { id: uuid(), state: fromState, type } as Case,
          { id: uuid() } as User,
        )

        // Assert
        expect(res).toMatchObject({ state: CaseState.RECEIVED })
      })

      it.each(Object.values(CaseAppealState))(
        'appeal state %s - should not receive',
        (fromAppealState) => {
          // Arrange
          const act = () =>
            transitionCase(
              CaseTransition.RECEIVE,
              {
                id: uuid(),
                state: fromState,
                ...withAppealCase(fromAppealState),
                type,
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
        it('no appeal case - should receive', () => {
          // Act
          const res = transitionCase(
            CaseTransition.RECEIVE,
            { id: uuid(), state: fromState, type } as Case,
            { id: uuid() } as User,
          )

          // Assert
          expect(res).toMatchObject({ state: CaseState.RECEIVED })
        })

        it.each(Object.values(CaseAppealState))(
          'appeal state %s - should not receive',
          (fromAppealState) => {
            // Arrange
            const act = () =>
              transitionCase(
                CaseTransition.RECEIVE,
                {
                  id: uuid(),
                  state: fromState,
                  ...withAppealCase(fromAppealState),
                  type,
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
      )('state %s', (fromState) => {
        it.each(allAppealOptions)(
          'appeal state %s - should not receive',
          (fromAppealState) => {
            // Arrange
            const act = () =>
              transitionCase(
                CaseTransition.RECEIVE,
                {
                  id: uuid(),
                  state: fromState,
                  ...withAppealCase(fromAppealState),
                  type,
                } as Case,
                { id: uuid() } as User,
              )

            // Act and assert
            expect(act).toThrow(ForbiddenException)
          },
        )
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
      it('no appeal case - should complete', () => {
        // Act
        const res = transitionCase(
          CaseTransition.COMPLETE,
          { id: uuid(), state: fromState, type } as Case,
          { id: uuid() } as User,
        )

        // Assert
        expect(res).toMatchObject({ state: CaseState.COMPLETED })
      })

      it.each(Object.values(CaseAppealState))(
        'appeal state %s - should not complete',
        (fromAppealState) => {
          // Arrange
          const act = () =>
            transitionCase(
              CaseTransition.COMPLETE,
              {
                id: uuid(),
                state: fromState,
                ...withAppealCase(fromAppealState),
                type,
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
      describe.each(Object.values(CaseState))('state %s', (fromState) => {
        it.each(allAppealOptions)(
          'appeal state %s - should not complete',
          (fromAppealState) => {
            // Arrange
            const act = () =>
              transitionCase(
                CaseTransition.COMPLETE,
                {
                  id: uuid(),
                  state: fromState,
                  ...withAppealCase(fromAppealState),
                  type,
                } as Case,
                { id: uuid() } as User,
              )

            // Act and assert
            expect(act).toThrow(ForbiddenException)
          },
        )
      })
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
        it.each(allAppealOptions)(
          'appeal state %s - should accept',
          (fromAppealState) => {
            // Act
            const res = transitionCase(
              CaseTransition.ACCEPT,
              {
                id: uuid(),
                state: fromState,
                ...withAppealCase(fromAppealState),
                type,
              } as Case,
              { id: uuid() } as User,
            )

            // Assert
            expect(res).toMatchObject({ state: CaseState.ACCEPTED })
          },
        )
      })

      describe.each(
        Object.values(CaseState).filter(
          (state) => !allowedFromStates.includes(state),
        ),
      )('state %s', (fromState) => {
        it.each(allAppealOptions)(
          'appeal state %s - should not accept',
          (fromAppealState) => {
            // Arrange
            const act = () =>
              transitionCase(
                CaseTransition.ACCEPT,
                {
                  id: uuid(),
                  state: fromState,
                  ...withAppealCase(fromAppealState),
                  type,
                } as Case,
                { id: uuid() } as User,
              )

            // Act and assert
            expect(act).toThrow(ForbiddenException)
          },
        )
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
        it.each(allAppealOptions)(
          'appeal state %s - should reject',
          (fromAppealState) => {
            // Act
            const res = transitionCase(
              CaseTransition.REJECT,
              {
                id: uuid(),
                state: fromState,
                ...withAppealCase(fromAppealState),
                type,
              } as Case,
              { id: uuid() } as User,
            )

            // Assert
            expect(res).toMatchObject({ state: CaseState.REJECTED })
          },
        )
      })

      describe.each(
        Object.values(CaseState).filter(
          (state) => !allowedFromStates.includes(state),
        ),
      )('state %s', (fromState) => {
        it.each(allAppealOptions)(
          'appeal state %s - should not reject',
          (fromAppealState) => {
            // Arrange
            const act = () =>
              transitionCase(
                CaseTransition.REJECT,
                {
                  id: uuid(),
                  state: fromState,
                  ...withAppealCase(fromAppealState),
                  type,
                } as Case,
                { id: uuid() } as User,
              )

            // Act and assert
            expect(act).toThrow(ForbiddenException)
          },
        )
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
        it.each(allAppealOptions)(
          'appeal state %s - should dismiss',
          (fromAppealState) => {
            // Act
            const res = transitionCase(
              CaseTransition.DISMISS,
              {
                id: uuid(),
                state: fromState,
                ...withAppealCase(fromAppealState),
                type,
              } as Case,
              { id: uuid() } as User,
            )

            // Assert
            expect(res).toMatchObject({ state: CaseState.DISMISSED })
          },
        )
      })

      describe.each(
        Object.values(CaseState).filter(
          (state) => !allowedFromStates.includes(state),
        ),
      )('state %s', (fromState) => {
        it.each(allAppealOptions)(
          'appeal state %s - should not dismiss',
          (fromAppealState) => {
            // Arrange
            const act = () =>
              transitionCase(
                CaseTransition.DISMISS,
                {
                  id: uuid(),
                  state: fromState,
                  ...withAppealCase(fromAppealState),
                  type,
                } as Case,
                { id: uuid() } as User,
              )

            // Act and assert
            expect(act).toThrow(ForbiddenException)
          },
        )
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
      it('no appeal case - should delete', () => {
        // Act
        const res = transitionCase(
          CaseTransition.DELETE,
          { id: uuid(), state: fromState, type } as Case,
          { id: uuid() } as User,
        )

        // Assert
        expect(res).toMatchObject({ state: CaseState.DELETED })
      })

      it.each(Object.values(CaseAppealState))(
        'appeal state %s - should not delete',
        (fromAppealState) => {
          // Arrange
          const act = () =>
            transitionCase(
              CaseTransition.DELETE,
              {
                id: uuid(),
                state: fromState,
                ...withAppealCase(fromAppealState),
                type,
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
        it('no appeal case - should delete', () => {
          // Act
          const res = transitionCase(
            CaseTransition.DELETE,
            { id: uuid(), state: fromState, type } as Case,
            { id: uuid() } as User,
          )

          // Assert
          expect(res).toMatchObject({ state: CaseState.DELETED })
        })

        it.each(Object.values(CaseAppealState))(
          'appeal state %s - should not delete',
          (fromAppealState) => {
            // Arrange
            const act = () =>
              transitionCase(
                CaseTransition.DELETE,
                {
                  id: uuid(),
                  state: fromState,
                  ...withAppealCase(fromAppealState),
                  type,
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
      )('state %s', (fromState) => {
        it.each(allAppealOptions)(
          'appeal state %s - should not delete',
          (fromAppealState) => {
            // Arrange
            const act = () =>
              transitionCase(
                CaseTransition.DELETE,
                {
                  id: uuid(),
                  state: fromState,
                  ...withAppealCase(fromAppealState),
                  type,
                } as Case,
                { id: uuid() } as User,
              )

            // Act and assert
            expect(act).toThrow(ForbiddenException)
          },
        )
      })
    },
  )

  // --- REOPEN ---

  describe.each(indictmentCases)('reopen %s', (type) => {
    const allowedFromStates = [CaseState.COMPLETED]

    describe.each(allowedFromStates)('state %s', (fromState) => {
      // Test appeal state dimension — REOPEN allows all appeal states
      it.each(allAppealOptions)(
        'appeal state %s - should reopen',
        (fromAppealState) => {
          // Act
          const res = transitionCase(
            CaseTransition.REOPEN,
            {
              id: uuid(),
              state: fromState,
              ...withAppealCase(fromAppealState),
              type,
            } as Case,
            { id: uuid() } as User,
          )

          // Assert
          expect(res).toMatchObject({ state: CaseState.CORRECTING })
        },
      )

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

  describe.each([...restrictionCases, ...investigationCases])(
    'reopen %s',
    (type) => {
      const allowedFromStates = [
        CaseState.ACCEPTED,
        CaseState.REJECTED,
        CaseState.DISMISSED,
      ]

      describe.each(allowedFromStates)('state %s', (fromState) => {
        it.each(allAppealOptions)(
          'appeal state %s - should reopen',
          (fromAppealState) => {
            // Act
            const res = transitionCase(
              CaseTransition.REOPEN,
              {
                id: uuid(),
                state: fromState,
                ...withAppealCase(fromAppealState),
                type,
              } as Case,
              { id: uuid() } as User,
            )

            // Assert
            expect(res).toMatchObject({ state: CaseState.RECEIVED })
          },
        )
      })

      describe.each(
        Object.values(CaseState).filter(
          (state) => !allowedFromStates.includes(state),
        ),
      )('state %s', (fromState) => {
        it.each(allAppealOptions)(
          'appeal state %s - should not reopen',
          (fromAppealState) => {
            // Arrange
            const act = () =>
              transitionCase(
                CaseTransition.REOPEN,
                {
                  id: uuid(),
                  state: fromState,
                  ...withAppealCase(fromAppealState),
                  type,
                } as Case,
                { id: uuid() } as User,
              )

            // Act and assert
            expect(act).toThrow(ForbiddenException)
          },
        )
      })
    },
  )

  // --- APPEAL ---

  describe.each(indictmentCases)('appeal %s', (type) => {
    const allowedFromStates = [CaseState.COMPLETED, CaseState.CORRECTING]

    describe.each(allowedFromStates)('state %s', (fromState) => {
      it('no appeal case - should appeal as prosecutor', () => {
        // Act
        const res = transitionCase(
          CaseTransition.APPEAL,
          {
            id: uuid(),
            state: fromState,
            type,
            indictmentRulingDecision: CaseIndictmentRulingDecision.DISMISSAL,
          } as Case,
          {
            id: uuid(),
            nationalId: '1234567890',
            role: UserRole.PROSECUTOR,
            institution: {
              type: InstitutionType.POLICE_PROSECUTORS_OFFICE,
            },
          } as User,
        )

        // Assert
        expect(res).toMatchObject({ appealState: CaseAppealState.APPEALED })
        expect(res.prosecutorPostponedAppealDate).toBeDefined()
        expect(res.appealedByNationalId).toBeUndefined()
      })

      it('no appeal case - should appeal as defender', () => {
        // Arrange
        const defenderNationalId = '0987654321'

        // Act
        const res = transitionCase(
          CaseTransition.APPEAL,
          {
            id: uuid(),
            state: fromState,
            type,
            indictmentRulingDecision: CaseIndictmentRulingDecision.DISMISSAL,
          } as Case,
          {
            id: uuid(),
            nationalId: defenderNationalId,
            role: UserRole.DEFENDER,
          } as User,
        )

        // Assert
        expect(res).toMatchObject({ appealState: CaseAppealState.APPEALED })
        expect(res.accusedPostponedAppealDate).toBeDefined()
        expect(res.appealedByNationalId).toBe(defenderNationalId)
      })

      it('should not appeal a non-dismissal indictment case', () => {
        // Arrange
        const act = () =>
          transitionCase(
            CaseTransition.APPEAL,
            {
              id: uuid(),
              state: fromState,
              type,
              indictmentRulingDecision: CaseIndictmentRulingDecision.RULING,
            } as Case,
            {
              id: uuid(),
              role: UserRole.PROSECUTOR,
              institution: {
                type: InstitutionType.POLICE_PROSECUTORS_OFFICE,
              },
            } as User,
          )

        // Act and assert
        expect(act).toThrow(ForbiddenException)
        expect(act).toThrow('Only dismissed indictment cases can be appealed')
      })

      it('should not appeal as neutral actor', () => {
        // Arrange
        const act = () =>
          transitionCase(
            CaseTransition.APPEAL,
            {
              id: uuid(),
              state: fromState,
              type,
              indictmentRulingDecision: CaseIndictmentRulingDecision.DISMISSAL,
            } as Case,
            {
              id: uuid(),
              role: UserRole.DISTRICT_COURT_JUDGE,
              institution: { type: InstitutionType.DISTRICT_COURT },
            } as User,
          )

        // Act and assert
        expect(act).toThrow(ForbiddenException)
        expect(act).toThrow('Current user cannot appeal an indictment case')
      })

      it.each(Object.values(CaseAppealState))(
        'appeal state %s - should not appeal',
        (fromAppealState) => {
          // Arrange
          const act = () =>
            transitionCase(
              CaseTransition.APPEAL,
              {
                id: uuid(),
                state: fromState,
                ...withAppealCase(fromAppealState),
                type,
                indictmentRulingDecision:
                  CaseIndictmentRulingDecision.DISMISSAL,
              } as Case,
              {
                id: uuid(),
                role: UserRole.PROSECUTOR,
                institution: {
                  type: InstitutionType.POLICE_PROSECUTORS_OFFICE,
                },
              } as User,
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
    )('state %s', (fromState) => {
      it.each(allAppealOptions)(
        'appeal state %s - should not appeal',
        (fromAppealState) => {
          // Arrange
          const act = () =>
            transitionCase(
              CaseTransition.APPEAL,
              {
                id: uuid(),
                state: fromState,
                ...withAppealCase(fromAppealState),
                type,
                indictmentRulingDecision:
                  CaseIndictmentRulingDecision.DISMISSAL,
              } as Case,
              {
                id: uuid(),
                role: UserRole.PROSECUTOR,
                institution: {
                  type: InstitutionType.POLICE_PROSECUTORS_OFFICE,
                },
              } as User,
            )

          // Act and assert
          expect(act).toThrow(ForbiddenException)
        },
      )
    })
  })

  describe.each([...restrictionCases, ...investigationCases])(
    'appeal %s',
    (type) => {
      const allowedFromStates = [
        CaseState.ACCEPTED,
        CaseState.REJECTED,
        CaseState.DISMISSED,
      ]

      describe.each(allowedFromStates)('state %s', (fromState) => {
        it('no appeal case - should appeal', () => {
          // Act
          const res = transitionCase(
            CaseTransition.APPEAL,
            {
              id: uuid(),
              state: fromState,
              type,
            } as Case,
            {
              id: uuid(),
              nationalId: '1234567890',
              role: UserRole.PROSECUTOR,
              institution: {
                type: InstitutionType.POLICE_PROSECUTORS_OFFICE,
              },
            } as User,
          )

          // Assert
          expect(res).toMatchObject({ appealState: CaseAppealState.APPEALED })
          expect(res.appealedByNationalId).toBeUndefined()
        })

        it.each(Object.values(CaseAppealState))(
          'appeal state %s - should not appeal',
          (fromAppealState) => {
            // Arrange
            const act = () =>
              transitionCase(
                CaseTransition.APPEAL,
                {
                  id: uuid(),
                  state: fromState,
                  ...withAppealCase(fromAppealState),
                  type,
                } as Case,
                {
                  id: uuid(),
                  role: UserRole.PROSECUTOR,
                  institution: {
                    type: InstitutionType.POLICE_PROSECUTORS_OFFICE,
                  },
                } as User,
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
      )('state %s', (fromState) => {
        it.each(allAppealOptions)(
          'appeal state %s - should not appeal',
          (fromAppealState) => {
            // Arrange
            const act = () =>
              transitionCase(
                CaseTransition.APPEAL,
                {
                  id: uuid(),
                  state: fromState,
                  ...withAppealCase(fromAppealState),
                  type,
                } as Case,
                {
                  id: uuid(),
                  role: UserRole.PROSECUTOR,
                  institution: {
                    type: InstitutionType.POLICE_PROSECUTORS_OFFICE,
                  },
                } as User,
              )

            // Act and assert
            expect(act).toThrow(ForbiddenException)
          },
        )
      })
    },
  )

  // --- WITHDRAW APPEAL ---

  describe.each(indictmentCases)('withdraw appeal %s', (type) => {
    const allowedFromStates = [CaseState.COMPLETED, CaseState.CORRECTING]
    const allowedFromAppealStates = [
      CaseAppealState.APPEALED,
      CaseAppealState.RECEIVED,
    ]
    const disallowedAppealStates = allAppealOptions.filter(
      (s) => !allowedFromAppealStates.includes(s),
    )

    describe.each(allowedFromStates)('state %s', (fromState) => {
      it.each(allowedFromAppealStates)(
        'appeal state %s - should withdraw appeal',
        (fromAppealState) => {
          // Act
          const res = transitionCase(
            CaseTransition.WITHDRAW_APPEAL,
            {
              id: uuid(),
              state: fromState,
              ...withAppealCase(fromAppealState),
              type,
            } as Case,
            { id: uuid() } as User,
          )

          // Assert
          expect(res).toMatchObject({
            appealState: CaseAppealState.WITHDRAWN,
          })
        },
      )

      it('should set DISCONTINUED when withdrawing from RECEIVED without ruling decision', () => {
        // Act
        const res = transitionCase(
          CaseTransition.WITHDRAW_APPEAL,
          {
            id: uuid(),
            state: fromState,
            ...withAppealCase(CaseAppealState.RECEIVED),
            type,
          } as Case,
          { id: uuid() } as User,
        )

        // Assert
        expect(res).toMatchObject({
          appealState: CaseAppealState.WITHDRAWN,
          appealRulingDecision: CaseAppealRulingDecision.DISCONTINUED,
        })
      })

      it('should not set DISCONTINUED when withdrawing from APPEALED', () => {
        // Act
        const res = transitionCase(
          CaseTransition.WITHDRAW_APPEAL,
          {
            id: uuid(),
            state: fromState,
            ...withAppealCase(CaseAppealState.APPEALED),
            type,
          } as Case,
          { id: uuid() } as User,
        )

        // Assert
        expect(res).toMatchObject({
          appealState: CaseAppealState.WITHDRAWN,
        })
        expect(res.appealRulingDecision).toBeUndefined()
      })

      it('should not override existing ruling decision when withdrawing from RECEIVED', () => {
        // Act
        const res = transitionCase(
          CaseTransition.WITHDRAW_APPEAL,
          {
            id: uuid(),
            state: fromState,
            appealCase: {
              appealState: CaseAppealState.RECEIVED,
              appealRulingDecision: CaseAppealRulingDecision.CHANGED,
            } as AppealCase,
            type,
          } as Case,
          { id: uuid() } as User,
        )

        // Assert
        expect(res).toMatchObject({
          appealState: CaseAppealState.WITHDRAWN,
        })
        expect(res.appealRulingDecision).toBeUndefined()
      })

      it.each(disallowedAppealStates)(
        'appeal state %s - should not withdraw appeal',
        (fromAppealState) => {
          // Arrange
          const act = () =>
            transitionCase(
              CaseTransition.WITHDRAW_APPEAL,
              {
                id: uuid(),
                state: fromState,
                ...withAppealCase(fromAppealState),
                type,
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
    )('state %s', (fromState) => {
      it.each(allAppealOptions)(
        'appeal state %s - should not withdraw appeal',
        (fromAppealState) => {
          // Arrange
          const act = () =>
            transitionCase(
              CaseTransition.WITHDRAW_APPEAL,
              {
                id: uuid(),
                state: fromState,
                ...withAppealCase(fromAppealState),
                type,
              } as Case,
              { id: uuid() } as User,
            )

          // Act and assert
          expect(act).toThrow(ForbiddenException)
        },
      )
    })
  })

  describe.each([...restrictionCases, ...investigationCases])(
    'withdraw appeal %s',
    (type) => {
      const allowedFromStates = [
        CaseState.ACCEPTED,
        CaseState.REJECTED,
        CaseState.DISMISSED,
      ]
      const allowedFromAppealStates = [
        CaseAppealState.APPEALED,
        CaseAppealState.RECEIVED,
      ]
      const disallowedAppealStates = allAppealOptions.filter(
        (s) => !allowedFromAppealStates.includes(s),
      )

      describe.each(allowedFromStates)('state %s', (fromState) => {
        it.each(allowedFromAppealStates)(
          'appeal state %s - should withdraw appeal',
          (fromAppealState) => {
            // Act
            const res = transitionCase(
              CaseTransition.WITHDRAW_APPEAL,
              {
                id: uuid(),
                state: fromState,
                ...withAppealCase(fromAppealState),
                type,
              } as Case,
              { id: uuid() } as User,
            )

            // Assert
            expect(res).toMatchObject({
              appealState: CaseAppealState.WITHDRAWN,
            })
          },
        )

        it('should set DISCONTINUED when withdrawing from RECEIVED without ruling decision', () => {
          // Act
          const res = transitionCase(
            CaseTransition.WITHDRAW_APPEAL,
            {
              id: uuid(),
              state: fromState,
              ...withAppealCase(CaseAppealState.RECEIVED),
              type,
            } as Case,
            { id: uuid() } as User,
          )

          // Assert
          expect(res).toMatchObject({
            appealState: CaseAppealState.WITHDRAWN,
            appealRulingDecision: CaseAppealRulingDecision.DISCONTINUED,
          })
        })

        it('should not set DISCONTINUED when withdrawing from APPEALED', () => {
          // Act
          const res = transitionCase(
            CaseTransition.WITHDRAW_APPEAL,
            {
              id: uuid(),
              state: fromState,
              ...withAppealCase(CaseAppealState.APPEALED),
              type,
            } as Case,
            { id: uuid() } as User,
          )

          // Assert
          expect(res).toMatchObject({
            appealState: CaseAppealState.WITHDRAWN,
          })
          expect(res.appealRulingDecision).toBeUndefined()
        })

        it('should not override existing ruling decision when withdrawing from RECEIVED', () => {
          // Act
          const res = transitionCase(
            CaseTransition.WITHDRAW_APPEAL,
            {
              id: uuid(),
              state: fromState,
              appealCase: {
                appealState: CaseAppealState.RECEIVED,
                appealRulingDecision: CaseAppealRulingDecision.CHANGED,
              } as AppealCase,
              type,
            } as Case,
            { id: uuid() } as User,
          )

          // Assert
          expect(res).toMatchObject({
            appealState: CaseAppealState.WITHDRAWN,
          })
          expect(res.appealRulingDecision).toBeUndefined()
        })

        it.each(disallowedAppealStates)(
          'appeal state %s - should not withdraw appeal',
          (fromAppealState) => {
            // Arrange
            const act = () =>
              transitionCase(
                CaseTransition.WITHDRAW_APPEAL,
                {
                  id: uuid(),
                  state: fromState,
                  ...withAppealCase(fromAppealState),
                  type,
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
      )('state %s', (fromState) => {
        it.each(allAppealOptions)(
          'appeal state %s - should not withdraw appeal',
          (fromAppealState) => {
            // Arrange
            const act = () =>
              transitionCase(
                CaseTransition.WITHDRAW_APPEAL,
                {
                  id: uuid(),
                  state: fromState,
                  ...withAppealCase(fromAppealState),
                  type,
                } as Case,
                { id: uuid() } as User,
              )

            // Act and assert
            expect(act).toThrow(ForbiddenException)
          },
        )
      })
    },
  )

  // --- RECEIVE APPEAL ---

  describe.each(indictmentCases)('receive appeal %s', (type) => {
    const allowedFromStates = [CaseState.COMPLETED, CaseState.CORRECTING]
    const allowedFromAppealStates = [CaseAppealState.APPEALED]
    const disallowedAppealStates = allAppealOptions.filter(
      (s) => !allowedFromAppealStates.includes(s),
    )

    describe.each(allowedFromStates)('state %s', (fromState) => {
      it.each(allowedFromAppealStates)(
        'appeal state %s - should receive appeal',
        (fromAppealState) => {
          // Act
          const res = transitionCase(
            CaseTransition.RECEIVE_APPEAL,
            {
              id: uuid(),
              state: fromState,
              ...withAppealCase(fromAppealState),
              type,
            } as Case,
            { id: uuid() } as User,
          )

          // Assert
          expect(res).toMatchObject({ appealState: CaseAppealState.RECEIVED })
          expect(res.appealReceivedByCourtDate).toBeDefined()
        },
      )

      it.each(disallowedAppealStates)(
        'appeal state %s - should not receive appeal',
        (fromAppealState) => {
          // Arrange
          const act = () =>
            transitionCase(
              CaseTransition.RECEIVE_APPEAL,
              {
                id: uuid(),
                state: fromState,
                ...withAppealCase(fromAppealState),
                type,
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
    )('state %s', (fromState) => {
      it.each(allAppealOptions)(
        'appeal state %s - should not receive appeal',
        (fromAppealState) => {
          // Arrange
          const act = () =>
            transitionCase(
              CaseTransition.RECEIVE_APPEAL,
              {
                id: uuid(),
                state: fromState,
                ...withAppealCase(fromAppealState),
                type,
              } as Case,
              { id: uuid() } as User,
            )

          // Act and assert
          expect(act).toThrow(ForbiddenException)
        },
      )
    })
  })

  describe.each([...restrictionCases, ...investigationCases])(
    'receive appeal %s',
    (type) => {
      const allowedFromStates = [
        CaseState.ACCEPTED,
        CaseState.REJECTED,
        CaseState.DISMISSED,
      ]
      const allowedFromAppealStates = [CaseAppealState.APPEALED]
      const disallowedAppealStates = allAppealOptions.filter(
        (s) => !allowedFromAppealStates.includes(s),
      )

      describe.each(allowedFromStates)('state %s', (fromState) => {
        it.each(allowedFromAppealStates)(
          'appeal state %s - should receive appeal',
          (fromAppealState) => {
            // Act
            const res = transitionCase(
              CaseTransition.RECEIVE_APPEAL,
              {
                id: uuid(),
                state: fromState,
                ...withAppealCase(fromAppealState),
                type,
              } as Case,
              { id: uuid() } as User,
            )

            // Assert
            expect(res).toMatchObject({
              appealState: CaseAppealState.RECEIVED,
            })
          },
        )

        it.each(disallowedAppealStates)(
          'appeal state %s - should not receive appeal',
          (fromAppealState) => {
            // Arrange
            const act = () =>
              transitionCase(
                CaseTransition.RECEIVE_APPEAL,
                {
                  id: uuid(),
                  state: fromState,
                  ...withAppealCase(fromAppealState),
                  type,
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
      )('state %s', (fromState) => {
        it.each(allAppealOptions)(
          'appeal state %s - should not receive appeal',
          (fromAppealState) => {
            // Arrange
            const act = () =>
              transitionCase(
                CaseTransition.RECEIVE_APPEAL,
                {
                  id: uuid(),
                  state: fromState,
                  ...withAppealCase(fromAppealState),
                  type,
                } as Case,
                { id: uuid() } as User,
              )

            // Act and assert
            expect(act).toThrow(ForbiddenException)
          },
        )
      })
    },
  )

  // --- COMPLETE APPEAL ---

  describe.each(indictmentCases)('complete appeal %s', (type) => {
    const allowedFromStates = [CaseState.COMPLETED, CaseState.CORRECTING]
    const allowedFromAppealStates = [
      CaseAppealState.RECEIVED,
      CaseAppealState.WITHDRAWN,
    ]
    const disallowedAppealStates = allAppealOptions.filter(
      (s) => !allowedFromAppealStates.includes(s),
    )

    describe.each(allowedFromStates)('state %s', (fromState) => {
      it.each(allowedFromAppealStates)(
        'appeal state %s - should complete appeal',
        (fromAppealState) => {
          // Act
          const res = transitionCase(
            CaseTransition.COMPLETE_APPEAL,
            {
              id: uuid(),
              state: fromState,
              ...withAppealCase(fromAppealState),
              type,
            } as Case,
            { id: uuid() } as User,
          )

          // Assert
          expect(res).toMatchObject({
            appealState: CaseAppealState.COMPLETED,
          })
        },
      )

      it.each(disallowedAppealStates)(
        'appeal state %s - should not complete appeal',
        (fromAppealState) => {
          // Arrange
          const act = () =>
            transitionCase(
              CaseTransition.COMPLETE_APPEAL,
              {
                id: uuid(),
                state: fromState,
                ...withAppealCase(fromAppealState),
                type,
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
    )('state %s', (fromState) => {
      it.each(allAppealOptions)(
        'appeal state %s - should not complete appeal',
        (fromAppealState) => {
          // Arrange
          const act = () =>
            transitionCase(
              CaseTransition.COMPLETE_APPEAL,
              {
                id: uuid(),
                state: fromState,
                ...withAppealCase(fromAppealState),
                type,
              } as Case,
              { id: uuid() } as User,
            )

          // Act and assert
          expect(act).toThrow(ForbiddenException)
        },
      )
    })
  })

  describe.each([...restrictionCases, ...investigationCases])(
    'complete appeal %s',
    (type) => {
      const allowedFromStates = [
        CaseState.ACCEPTED,
        CaseState.REJECTED,
        CaseState.DISMISSED,
      ]
      const allowedFromAppealStates = [
        CaseAppealState.RECEIVED,
        CaseAppealState.WITHDRAWN,
      ]
      const disallowedAppealStates = allAppealOptions.filter(
        (s) => !allowedFromAppealStates.includes(s),
      )

      describe.each(allowedFromStates)('state %s', (fromState) => {
        it.each(allowedFromAppealStates)(
          'appeal state %s - should complete appeal',
          (fromAppealState) => {
            // Act
            const res = transitionCase(
              CaseTransition.COMPLETE_APPEAL,
              {
                id: uuid(),
                state: fromState,
                ...withAppealCase(fromAppealState),
                type,
              } as Case,
              { id: uuid() } as User,
            )

            // Assert
            expect(res).toMatchObject({
              appealState: CaseAppealState.COMPLETED,
            })
          },
        )

        it.each(disallowedAppealStates)(
          'appeal state %s - should not complete appeal',
          (fromAppealState) => {
            // Arrange
            const act = () =>
              transitionCase(
                CaseTransition.COMPLETE_APPEAL,
                {
                  id: uuid(),
                  state: fromState,
                  ...withAppealCase(fromAppealState),
                  type,
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
      )('state %s', (fromState) => {
        it.each(allAppealOptions)(
          'appeal state %s - should not complete appeal',
          (fromAppealState) => {
            // Arrange
            const act = () =>
              transitionCase(
                CaseTransition.COMPLETE_APPEAL,
                {
                  id: uuid(),
                  state: fromState,
                  ...withAppealCase(fromAppealState),
                  type,
                } as Case,
                { id: uuid() } as User,
              )

            // Act and assert
            expect(act).toThrow(ForbiddenException)
          },
        )
      })
    },
  )

  // --- REOPEN APPEAL ---

  describe.each(indictmentCases)('reopen appeal %s', (type) => {
    const allowedFromStates = [CaseState.COMPLETED, CaseState.CORRECTING]
    const allowedFromAppealStates = [CaseAppealState.COMPLETED]
    const disallowedAppealStates = allAppealOptions.filter(
      (s) => !allowedFromAppealStates.includes(s),
    )

    describe.each(allowedFromStates)('state %s', (fromState) => {
      it.each(allowedFromAppealStates)(
        'appeal state %s - should reopen appeal',
        (fromAppealState) => {
          // Act
          const res = transitionCase(
            CaseTransition.REOPEN_APPEAL,
            {
              id: uuid(),
              state: fromState,
              ...withAppealCase(fromAppealState),
              type,
            } as Case,
            { id: uuid() } as User,
          )

          // Assert
          expect(res).toMatchObject({ appealState: CaseAppealState.RECEIVED })
        },
      )

      it.each(disallowedAppealStates)(
        'appeal state %s - should not reopen appeal',
        (fromAppealState) => {
          // Arrange
          const act = () =>
            transitionCase(
              CaseTransition.REOPEN_APPEAL,
              {
                id: uuid(),
                state: fromState,
                ...withAppealCase(fromAppealState),
                type,
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
    )('state %s', (fromState) => {
      it.each(allAppealOptions)(
        'appeal state %s - should not reopen appeal',
        (fromAppealState) => {
          // Arrange
          const act = () =>
            transitionCase(
              CaseTransition.REOPEN_APPEAL,
              {
                id: uuid(),
                state: fromState,
                ...withAppealCase(fromAppealState),
                type,
              } as Case,
              { id: uuid() } as User,
            )

          // Act and assert
          expect(act).toThrow(ForbiddenException)
        },
      )
    })
  })

  describe.each([...restrictionCases, ...investigationCases])(
    'reopen appeal %s',
    (type) => {
      const allowedFromStates = [
        CaseState.ACCEPTED,
        CaseState.REJECTED,
        CaseState.DISMISSED,
      ]
      const allowedFromAppealStates = [CaseAppealState.COMPLETED]
      const disallowedAppealStates = allAppealOptions.filter(
        (s) => !allowedFromAppealStates.includes(s),
      )

      describe.each(allowedFromStates)('state %s', (fromState) => {
        it.each(allowedFromAppealStates)(
          'appeal state %s - should reopen appeal',
          (fromAppealState) => {
            // Act
            const res = transitionCase(
              CaseTransition.REOPEN_APPEAL,
              {
                id: uuid(),
                state: fromState,
                ...withAppealCase(fromAppealState),
                type,
              } as Case,
              { id: uuid() } as User,
            )

            // Assert
            expect(res).toMatchObject({
              appealState: CaseAppealState.RECEIVED,
            })
          },
        )

        it.each(disallowedAppealStates)(
          'appeal state %s - should not reopen appeal',
          (fromAppealState) => {
            // Arrange
            const act = () =>
              transitionCase(
                CaseTransition.REOPEN_APPEAL,
                {
                  id: uuid(),
                  state: fromState,
                  ...withAppealCase(fromAppealState),
                  type,
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
      )('state %s', (fromState) => {
        it.each(allAppealOptions)(
          'appeal state %s - should not reopen appeal',
          (fromAppealState) => {
            // Arrange
            const act = () =>
              transitionCase(
                CaseTransition.REOPEN_APPEAL,
                {
                  id: uuid(),
                  state: fromState,
                  ...withAppealCase(fromAppealState),
                  type,
                } as Case,
                { id: uuid() } as User,
              )

            // Act and assert
            expect(act).toThrow(ForbiddenException)
          },
        )
      })
    },
  )

  // --- MOVE ---

  describe.each(indictmentCases)('move %s', (type) => {
    const allowedFromStates = [CaseState.RECEIVED]

    describe.each(allowedFromStates)('state %s', (fromState) => {
      it('no appeal case - should move case to submitted', () => {
        // Act
        const res = transitionCase(
          CaseTransition.MOVE,
          { id: uuid(), state: fromState, type } as Case,
          { id: uuid() } as User,
        )

        // Assert
        expect(res).toMatchObject({ state: CaseState.SUBMITTED })
      })

      it.each(Object.values(CaseAppealState))(
        'appeal state %s - should not move',
        (fromAppealState) => {
          // Arrange
          const act = () =>
            transitionCase(
              CaseTransition.MOVE,
              {
                id: uuid(),
                state: fromState,
                ...withAppealCase(fromAppealState),
                type,
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
        it('no appeal case - should move case to submitted', () => {
          // Act
          const res = transitionCase(
            CaseTransition.MOVE,
            { id: uuid(), state: fromState, type } as Case,
            { id: uuid() } as User,
          )

          // Assert
          expect(res).toMatchObject({ state: CaseState.SUBMITTED })
        })

        it.each(Object.values(CaseAppealState))(
          'appeal state %s - should not move',
          (fromAppealState) => {
            // Arrange
            const act = () =>
              transitionCase(
                CaseTransition.MOVE,
                {
                  id: uuid(),
                  state: fromState,
                  ...withAppealCase(fromAppealState),
                  type,
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
