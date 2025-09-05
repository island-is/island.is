import { uuid } from 'uuidv4'

import { ForbiddenException } from '@nestjs/common'

import {
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

import { Case } from '../../repository'
import { transitionCase } from './case.state'

describe('Transition Case', () => {
  describe.each(indictmentCases)('open %s - should open', (type) => {
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
      const allowedFromAppealStates = [undefined]

      describe.each(allowedFromStates)('state %s', (fromState) => {
        it.each(allowedFromAppealStates)(
          'appeal state %s - should open',
          (fromAppealState) => {
            // Act
            const res = transitionCase(
              CaseTransition.OPEN,
              {
                id: uuid(),
                state: fromState,
                appealState: fromAppealState,
                type,
              } as Case,
              { id: uuid() } as User,
            )

            // Assert
            expect(res).toMatchObject({ state: CaseState.DRAFT })
          },
        )

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
                  appealState: fromAppealState,
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
                  appealState: fromAppealState,
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

  describe.each(indictmentCases)('ask for confirmation %s', (type) => {
    const allowedFromStates = [CaseState.DRAFT, CaseState.SUBMITTED]

    describe.each(allowedFromStates)(
      'state %s - should ask for confirmation',
      (fromState) => {
        // Act
        const res = transitionCase(
          CaseTransition.ASK_FOR_CONFIRMATION,
          { id: uuid(), state: fromState, type } as Case,
          { id: uuid() } as User,
        )

        // Assert
        expect(res).toMatchObject({ state: CaseState.WAITING_FOR_CONFIRMATION })
      },
    )

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
        it.each([undefined, ...Object.values(CaseAppealState)])(
          'appeal state %s - should not ask for confirmation',
          (fromAppealState) => {
            // Arrange
            const act = () =>
              transitionCase(
                CaseTransition.ASK_FOR_CONFIRMATION,
                {
                  id: uuid(),
                  state: fromState,
                  appealState: fromAppealState,
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

  describe.each(indictmentCases)('deny indictment %s', (type) => {
    const allowedFromStates = [CaseState.WAITING_FOR_CONFIRMATION]

    describe.each(allowedFromStates)(
      'state %s - should deny indictment',
      (fromState) => {
        // Act
        const res = transitionCase(
          CaseTransition.DENY_INDICTMENT,
          { id: uuid(), state: fromState, type } as Case,
          { id: uuid() } as User,
        )

        // Assert
        expect(res).toMatchObject({ state: CaseState.DRAFT })
      },
    )

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
        it.each([undefined, ...Object.values(CaseAppealState)])(
          'appeal state %s - should not deny indictment',
          (fromAppealState) => {
            // Arrange
            const act = () =>
              transitionCase(
                CaseTransition.DENY_INDICTMENT,
                {
                  id: uuid(),
                  state: fromState,
                  appealState: fromAppealState,
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

  describe.each(indictmentCases)('submit %s', (type) => {
    const allowedFromStates = [CaseState.WAITING_FOR_CONFIRMATION]

    describe.each(allowedFromStates)(
      'state %s - should submit',
      (fromState) => {
        // Act
        const res = transitionCase(
          CaseTransition.SUBMIT,
          { id: uuid(), state: fromState, type } as Case,
          { id: uuid() } as User,
        )

        // Assert
        expect(res).toMatchObject({ state: CaseState.SUBMITTED })
      },
    )

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
      const allowedFromAppealStates = [undefined]

      describe.each(allowedFromStates)('state %s', (fromState) => {
        it.each(allowedFromAppealStates)(
          'appeal state %s - should submit',
          (fromAppealState) => {
            // Act
            const res = transitionCase(
              CaseTransition.SUBMIT,
              {
                id: uuid(),
                state: fromState,
                appealState: fromAppealState,
                type,
              } as Case,
              { id: uuid() } as User,
            )

            // Assert
            expect(res).toMatchObject({ state: CaseState.SUBMITTED })
          },
        )

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
                  appealState: fromAppealState,
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
                  appealState: fromAppealState,
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

  describe.each(indictmentCases)('ask for cancellation %s', (type) => {
    const allowedFromStates = [CaseState.SUBMITTED, CaseState.RECEIVED]

    describe.each(allowedFromStates)(
      'state %s - should ask for cancellation',
      (fromState) => {
        // Act
        const res = transitionCase(
          CaseTransition.ASK_FOR_CANCELLATION,
          { id: uuid(), state: fromState, type } as Case,
          { id: uuid() } as User,
        )

        // Assert
        expect(res).toMatchObject({ state: CaseState.WAITING_FOR_CANCELLATION })
      },
    )

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
        it.each([undefined, ...Object.values(CaseAppealState)])(
          'appeal state %s - should not ask for cancellation',
          (fromAppealState) => {
            // Arrange
            const act = () =>
              transitionCase(
                CaseTransition.ASK_FOR_CANCELLATION,
                {
                  id: uuid(),
                  state: fromState,
                  appealState: fromAppealState,
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

  describe.each(indictmentCases)('receive %s', (type) => {
    const allowedFromStates = [CaseState.SUBMITTED]

    describe.each(allowedFromStates)(
      'state %s - should receive',
      (fromState) => {
        // Act
        const res = transitionCase(
          CaseTransition.RECEIVE,
          { id: uuid(), state: fromState, type } as Case,
          { id: uuid() } as User,
        )

        // Assert
        expect(res).toMatchObject({ state: CaseState.RECEIVED })
      },
    )

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
      const allowedFromAppealStates = [undefined]

      describe.each(allowedFromStates)('state %s', (fromState) => {
        it.each(allowedFromAppealStates)(
          'appeal state %s - should receive',
          (fromAppealState) => {
            // Act
            const res = transitionCase(
              CaseTransition.RECEIVE,
              {
                id: uuid(),
                state: fromState,
                appealState: fromAppealState,
                type,
              } as Case,
              { id: uuid() } as User,
            )

            // Assert
            expect(res).toMatchObject({ state: CaseState.RECEIVED })
          },
        )

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
                  appealState: fromAppealState,
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
                  appealState: fromAppealState,
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

  describe.each(indictmentCases)('return indictment %s', (type) => {
    const allowedFromStates = [CaseState.RECEIVED]

    describe.each(allowedFromStates)(
      'state %s - should return indictment',
      (fromState) => {
        // Act
        const res = transitionCase(
          CaseTransition.RETURN_INDICTMENT,
          { id: uuid(), state: fromState, type } as Case,
          { id: uuid() } as User,
        )

        // Assert
        expect(res).toMatchObject({ state: CaseState.DRAFT })
      },
    )

    describe.each(
      Object.values(CaseState).filter(
        (state) => !allowedFromStates.includes(state),
      ),
    )('state %s - should not return indictment', (fromState) => {
      // Arrange
      const act = () =>
        transitionCase(
          CaseTransition.RETURN_INDICTMENT,
          { id: uuid(), state: fromState, type } as Case,
          { id: uuid() } as User,
        )

      // Act and assert
      expect(act).toThrow(ForbiddenException)
    })
  })

  describe.each([...restrictionCases, ...investigationCases])(
    'return indictment %s',
    (type) => {
      describe.each(Object.values(CaseState))('state %s', (fromState) => {
        it.each([undefined, ...Object.values(CaseAppealState)])(
          'appeal state %s - should not return indictment',
          (fromAppealState) => {
            // Arrange
            const act = () =>
              transitionCase(
                CaseTransition.RETURN_INDICTMENT,
                {
                  id: uuid(),
                  state: fromState,
                  appealState: fromAppealState,
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

  describe.each(indictmentCases)('complete %s', (type) => {
    const allowedFromStates = [
      CaseState.WAITING_FOR_CANCELLATION,
      CaseState.RECEIVED,
    ]

    describe.each(allowedFromStates)(
      'state %s - should complete',
      (fromState) => {
        // Act
        const res = transitionCase(
          CaseTransition.COMPLETE,
          { id: uuid(), state: fromState, type } as Case,
          { id: uuid() } as User,
        )

        // Assert
        expect(res).toMatchObject({ state: CaseState.COMPLETED })
      },
    )

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
        it.each([undefined, ...Object.values(CaseAppealState)])(
          'appeal state %s - should not complete',
          (fromAppealState) => {
            // Arrange
            const act = () =>
              transitionCase(
                CaseTransition.COMPLETE,
                {
                  id: uuid(),
                  state: fromState,
                  appealState: fromAppealState,
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
      const allowedFromAppealStates = [
        undefined,
        ...Object.values(CaseAppealState),
      ]

      describe.each(allowedFromStates)('state %s', (fromState) => {
        it.each(allowedFromAppealStates)(
          'appeal state %s - should accept',
          (fromAppealState) => {
            // Act
            const res = transitionCase(
              CaseTransition.ACCEPT,
              {
                id: uuid(),
                state: fromState,
                appealState: fromAppealState,
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
        it.each(Object.values(CaseAppealState))(
          'appeal state %s - should not accept',
          (fromAppealState) => {
            // Arrange
            const act = () =>
              transitionCase(
                CaseTransition.ACCEPT,
                {
                  id: uuid(),
                  state: fromState,
                  appealState: fromAppealState,
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
      const allowedFromAppealStates = [
        undefined,
        ...Object.values(CaseAppealState),
      ]

      describe.each(allowedFromStates)('state %s', (fromState) => {
        it.each(allowedFromAppealStates)(
          'appeal state %s - should reject',
          (fromAppealState) => {
            // Act
            const res = transitionCase(
              CaseTransition.REJECT,
              {
                id: uuid(),
                state: fromState,
                appealState: fromAppealState,
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
        it.each(Object.values(CaseAppealState))(
          'appeal state %s - should not reject',
          (fromAppealState) => {
            // Arrange
            const act = () =>
              transitionCase(
                CaseTransition.REJECT,
                {
                  id: uuid(),
                  state: fromState,
                  appealState: fromAppealState,
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
      const allowedFromAppealStates = [
        undefined,
        ...Object.values(CaseAppealState),
      ]

      describe.each(allowedFromStates)('state %s', (fromState) => {
        it.each(allowedFromAppealStates)(
          'appeal state %s - should dismiss',
          (fromAppealState) => {
            // Act
            const res = transitionCase(
              CaseTransition.DISMISS,
              {
                id: uuid(),
                state: fromState,
                appealState: fromAppealState,
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
        it.each(Object.values(CaseAppealState))(
          'appeal state %s - should not dismiss',
          (fromAppealState) => {
            // Arrange
            const act = () =>
              transitionCase(
                CaseTransition.DISMISS,
                {
                  id: uuid(),
                  state: fromState,
                  appealState: fromAppealState,
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

  describe.each(indictmentCases)('delete %s', (type) => {
    const allowedFromStates = [
      CaseState.DRAFT,
      CaseState.WAITING_FOR_CONFIRMATION,
    ]

    describe.each(allowedFromStates)(
      'state %s - should delete',
      (fromState) => {
        // Act
        const res = transitionCase(
          CaseTransition.DELETE,
          { id: uuid(), state: fromState, type } as Case,
          { id: uuid() } as User,
        )

        // Assert
        expect(res).toMatchObject({ state: CaseState.DELETED })
      },
    )

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
      const allowedFromAppealStates = [undefined]

      describe.each(allowedFromStates)('state %s', (fromState) => {
        it.each(allowedFromAppealStates)(
          'appeal state %s - should delete',
          (fromAppealState) => {
            // Act
            const res = transitionCase(
              CaseTransition.DELETE,
              {
                id: uuid(),
                state: fromState,
                appealState: fromAppealState,
                type,
              } as Case,
              { id: uuid() } as User,
            )

            // Assert
            expect(res).toMatchObject({ state: CaseState.DELETED })
          },
        )

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
                  appealState: fromAppealState,
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
                  appealState: fromAppealState,
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

  describe.each(indictmentCases)('reopen %s', (type) => {
    const allowedFromStates = [CaseState.COMPLETED]

    describe.each(allowedFromStates)('state %s', (fromState) => {
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
      const allowedFromAppealStates = [
        undefined,
        ...Object.values(CaseAppealState),
      ]

      describe.each(allowedFromStates)('state %s', (fromState) => {
        it.each(allowedFromAppealStates)(
          'appeal state %s - should reopen',
          (fromAppealState) => {
            // Act
            const res = transitionCase(
              CaseTransition.REOPEN,
              {
                id: uuid(),
                state: fromState,
                appealState: fromAppealState,
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
        it.each(Object.values(CaseAppealState))(
          'appeal state %s - should not reopen',
          (fromAppealState) => {
            // Arrange
            const act = () =>
              transitionCase(
                CaseTransition.REOPEN,
                {
                  id: uuid(),
                  state: fromState,
                  appealState: fromAppealState,
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

  describe.each(indictmentCases)('appeal %s', (type) => {
    describe.each(Object.values(CaseState))(
      'state %s - should not appeal',
      (fromState) => {
        // Arrange
        const act = () =>
          transitionCase(
            CaseTransition.APPEAL,
            { id: uuid(), state: fromState, type } as Case,
            { id: uuid() } as User,
          )

        // Act and assert
        expect(act).toThrow(ForbiddenException)
      },
    )
  })

  describe.each([...restrictionCases, ...investigationCases])(
    'appeal %s',
    (type) => {
      const allowedFromStates = [
        CaseState.ACCEPTED,
        CaseState.REJECTED,
        CaseState.DISMISSED,
      ]
      const allowedFromAppealStates = [undefined]

      describe.each(allowedFromStates)('state %s', (fromState) => {
        it.each(allowedFromAppealStates)(
          'appeal state %s - should appeal',
          (fromAppealState) => {
            // Act
            const res = transitionCase(
              CaseTransition.APPEAL,
              {
                id: uuid(),
                state: fromState,
                appealState: fromAppealState,
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

            // Assert
            expect(res).toMatchObject({ appealState: CaseAppealState.APPEALED })
          },
        )

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
                  appealState: fromAppealState,
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
                  appealState: fromAppealState,
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

  describe.each(indictmentCases)('withdraw appeal %s', (type) => {
    describe.each(Object.values(CaseState))(
      'state %s - should not withdraw appeal',
      (fromState) => {
        // Arrange
        const act = () =>
          transitionCase(
            CaseTransition.WITHDRAW_APPEAL,
            { id: uuid(), state: fromState, type } as Case,
            { id: uuid() } as User,
          )

        // Act and assert
        expect(act).toThrow(ForbiddenException)
      },
    )
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
                appealState: fromAppealState,
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

        it.each(
          Object.values(CaseAppealState).filter(
            (appealState) => !allowedFromAppealStates.includes(appealState),
          ),
        )('appeal state %s - should not withdraw appeal', (fromAppealState) => {
          // Arrange
          const act = () =>
            transitionCase(
              CaseTransition.WITHDRAW_APPEAL,
              {
                id: uuid(),
                state: fromState,
                appealState: fromAppealState,
                type,
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
      )('state %s', (fromState) => {
        it.each(Object.values(CaseAppealState))(
          'appeal state %s - should not withdraw appeal',
          (fromAppealState) => {
            // Arrange
            const act = () =>
              transitionCase(
                CaseTransition.WITHDRAW_APPEAL,
                {
                  id: uuid(),
                  state: fromState,
                  appealState: fromAppealState,
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

  describe.each(indictmentCases)('receive appeal %s', (type) => {
    describe.each(Object.values(CaseState))(
      'state %s - should not receive appeal',
      (fromState) => {
        // Arrange
        const act = () =>
          transitionCase(
            CaseTransition.RECEIVE_APPEAL,
            { id: uuid(), state: fromState, type } as Case,
            { id: uuid() } as User,
          )

        // Act and assert
        expect(act).toThrow(ForbiddenException)
      },
    )
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
                appealState: fromAppealState,
                type,
              } as Case,
              { id: uuid() } as User,
            )

            // Assert
            expect(res).toMatchObject({ appealState: CaseAppealState.RECEIVED })
          },
        )

        it.each(
          Object.values(CaseAppealState).filter(
            (appealState) => !allowedFromAppealStates.includes(appealState),
          ),
        )('appeal state %s - should not receive appeal', (fromAppealState) => {
          // Arrange
          const act = () =>
            transitionCase(
              CaseTransition.RECEIVE_APPEAL,
              {
                id: uuid(),
                state: fromState,
                appealState: fromAppealState,
                type,
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
      )('state %s', (fromState) => {
        it.each(Object.values(CaseAppealState))(
          'appeal state %s - should not receive appeal',
          (fromAppealState) => {
            // Arrange
            const act = () =>
              transitionCase(
                CaseTransition.RECEIVE_APPEAL,
                {
                  id: uuid(),
                  state: fromState,
                  appealState: fromAppealState,
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

  describe.each(indictmentCases)('complete appeal %s', (type) => {
    describe.each(Object.values(CaseState))(
      'state %s - should not complete appeal',
      (fromState) => {
        // Arrange
        const act = () =>
          transitionCase(
            CaseTransition.COMPLETE_APPEAL,
            { id: uuid(), state: fromState, type } as Case,
            { id: uuid() } as User,
          )

        // Act and assert
        expect(act).toThrow(ForbiddenException)
      },
    )
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
                appealState: fromAppealState,
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

        it.each(
          Object.values(CaseAppealState).filter(
            (appealState) => !allowedFromAppealStates.includes(appealState),
          ),
        )('appeal state %s - should not complete appeal', (fromAppealState) => {
          // Arrange
          const act = () =>
            transitionCase(
              CaseTransition.COMPLETE_APPEAL,
              {
                id: uuid(),
                state: fromState,
                appealState: fromAppealState,
                type,
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
      )('state %s', (fromState) => {
        it.each(Object.values(CaseAppealState))(
          'appeal state %s - should not complete appeal',
          (fromAppealState) => {
            // Arrange
            const act = () =>
              transitionCase(
                CaseTransition.COMPLETE_APPEAL,
                {
                  id: uuid(),
                  state: fromState,
                  appealState: fromAppealState,
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

  describe.each(indictmentCases)('reopen appeal %s', (type) => {
    describe.each(Object.values(CaseState))(
      'state %s - should not reopen appeal',
      (fromState) => {
        // Arrange
        const act = () =>
          transitionCase(
            CaseTransition.REOPEN_APPEAL,
            { id: uuid(), state: fromState, type } as Case,
            { id: uuid() } as User,
          )

        // Act and assert
        expect(act).toThrow(ForbiddenException)
      },
    )
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
                appealState: fromAppealState,
                type,
              } as Case,
              { id: uuid() } as User,
            )

            // Assert
            expect(res).toMatchObject({ appealState: CaseAppealState.RECEIVED })
          },
        )

        it.each(
          Object.values(CaseAppealState).filter(
            (appealState) => !allowedFromAppealStates.includes(appealState),
          ),
        )('appeal state %s - should not reopen appeal', (fromAppealState) => {
          // Arrange
          const act = () =>
            transitionCase(
              CaseTransition.REOPEN_APPEAL,
              {
                id: uuid(),
                state: fromState,
                appealState: fromAppealState,
                type,
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
      )('state %s', (fromState) => {
        it.each(Object.values(CaseAppealState))(
          'appeal state %s - should not reopen appeal',
          (fromAppealState) => {
            // Arrange
            const act = () =>
              transitionCase(
                CaseTransition.REOPEN_APPEAL,
                {
                  id: uuid(),
                  state: fromState,
                  appealState: fromAppealState,
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

  describe.each(indictmentCases)('move %s', (type) => {
    const allowedFromStates = [CaseState.RECEIVED]

    describe.each(allowedFromStates)(
      'state %s - should move case to submitted',
      (fromState) => {
        // Act
        const res = transitionCase(
          CaseTransition.MOVE,
          { id: uuid(), state: fromState, type } as Case,
          { id: uuid() } as User,
        )

        // Assert
        expect(res).toMatchObject({ state: CaseState.SUBMITTED })
      },
    )

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
})
