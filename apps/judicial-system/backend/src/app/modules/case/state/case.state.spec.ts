import { ForbiddenException } from '@nestjs/common'

import {
  CaseAppealState,
  CaseState,
  CaseTransition,
} from '@island.is/judicial-system/types'

import { transitionCase } from './case.state'

describe('Transition Case', () => {
  describe('open', () => {
    const allowedFromStates = [CaseState.NEW]
    const allowedFromAppealStates = [undefined]

    describe.each(allowedFromStates)('state %s', (fromState) => {
      it.each(allowedFromAppealStates)(
        'appeal state %s - should open',
        (fromAppealState) => {
          // Act
          const res = transitionCase(
            CaseTransition.OPEN,
            fromState,
            fromAppealState,
          )

          // Assert
          expect(res).toEqual({ state: CaseState.DRAFT })
        },
      )

      it.each(Object.values(CaseAppealState))(
        'appeal state %s - should not open',
        (fromAppealState) => {
          // Arrange
          const act = () =>
            transitionCase(CaseTransition.OPEN, fromState, fromAppealState)

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
            transitionCase(CaseTransition.OPEN, fromState, fromAppealState)

          // Act and assert
          expect(act).toThrow(ForbiddenException)
        },
      )
    })
  })

  describe('submit', () => {
    const allowedFromStates = [CaseState.DRAFT]
    const allowedFromAppealStates = [undefined]

    describe.each(allowedFromStates)('state %s', (fromState) => {
      it.each(allowedFromAppealStates)(
        'appeal state %s - should submit',
        (fromAppealState) => {
          // Act
          const res = transitionCase(
            CaseTransition.SUBMIT,
            fromState,
            fromAppealState,
          )

          // Assert
          expect(res).toEqual({ state: CaseState.SUBMITTED })
        },
      )

      it.each(Object.values(CaseAppealState))(
        'appeal state %s - should not submit',
        (fromAppealState) => {
          // Arrange
          const act = () =>
            transitionCase(CaseTransition.SUBMIT, fromState, fromAppealState)

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
            transitionCase(CaseTransition.SUBMIT, fromState, fromAppealState)

          // Act and assert
          expect(act).toThrow(ForbiddenException)
        },
      )
    })
  })

  describe('reveive', () => {
    const allowedFromStates = [CaseState.SUBMITTED]
    const allowedFromAppealStates = [undefined]

    describe.each(allowedFromStates)('state %s', (fromState) => {
      it.each(allowedFromAppealStates)(
        'appeal state %s - should receive',
        (fromAppealState) => {
          // Act
          const res = transitionCase(
            CaseTransition.RECEIVE,
            fromState,
            fromAppealState,
          )

          // Assert
          expect(res).toEqual({ state: CaseState.RECEIVED })
        },
      )

      it.each(Object.values(CaseAppealState))(
        'appeal state %s - should not receive',
        (fromAppealState) => {
          // Arrange
          const act = () =>
            transitionCase(CaseTransition.RECEIVE, fromState, fromAppealState)

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
            transitionCase(CaseTransition.RECEIVE, fromState, fromAppealState)

          // Act and assert
          expect(act).toThrow(ForbiddenException)
        },
      )
    })
  })

  describe('delete', () => {
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
            fromState,
            fromAppealState,
          )

          // Assert
          expect(res).toEqual({ state: CaseState.DELETED })
        },
      )

      it.each(Object.values(CaseAppealState))(
        'appeal state %s - should not delete',
        (fromAppealState) => {
          // Arrange
          const act = () =>
            transitionCase(CaseTransition.DELETE, fromState, fromAppealState)

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
            transitionCase(CaseTransition.DELETE, fromState, fromAppealState)

          // Act and assert
          expect(act).toThrow(ForbiddenException)
        },
      )
    })
  })

  describe('accept', () => {
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
            fromState,
            fromAppealState,
          )

          // Assert
          expect(res).toEqual({ state: CaseState.ACCEPTED })
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
            transitionCase(CaseTransition.ACCEPT, fromState, fromAppealState)

          // Act and assert
          expect(act).toThrow(ForbiddenException)
        },
      )
    })
  })

  describe('reject', () => {
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
            fromState,
            fromAppealState,
          )

          // Assert
          expect(res).toEqual({ state: CaseState.REJECTED })
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
            transitionCase(CaseTransition.REJECT, fromState, fromAppealState)

          // Act and assert
          expect(act).toThrow(ForbiddenException)
        },
      )
    })
  })

  describe('dismiss', () => {
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
            fromState,
            fromAppealState,
          )

          // Assert
          expect(res).toEqual({ state: CaseState.DISMISSED })
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
            transitionCase(CaseTransition.DISMISS, fromState, fromAppealState)

          // Act and assert
          expect(act).toThrow(ForbiddenException)
        },
      )
    })
  })

  describe('reopen', () => {
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
            fromState,
            fromAppealState,
          )

          // Assert
          expect(res).toEqual({ state: CaseState.RECEIVED })
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
            transitionCase(CaseTransition.REOPEN, fromState, fromAppealState)

          // Act and assert
          expect(act).toThrow(ForbiddenException)
        },
      )
    })
  })

  describe('appeal', () => {
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
            fromState,
            fromAppealState,
          )

          // Assert
          expect(res).toEqual({ appealState: CaseAppealState.APPEALED })
        },
      )

      it.each(Object.values(CaseAppealState))(
        'appeal state %s - should not appeal',
        (fromAppealState) => {
          // Arrange
          const act = () =>
            transitionCase(CaseTransition.APPEAL, fromState, fromAppealState)

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
            transitionCase(CaseTransition.APPEAL, fromState, fromAppealState)

          // Act and assert
          expect(act).toThrow(ForbiddenException)
        },
      )
    })
  })

  describe('receive appeal', () => {
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
            fromState,
            fromAppealState,
          )

          // Assert
          expect(res).toEqual({ appealState: CaseAppealState.RECEIVED })
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
            fromState,
            fromAppealState,
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
              fromState,
              fromAppealState,
            )

          // Act and assert
          expect(act).toThrow(ForbiddenException)
        },
      )
    })
  })

  describe('complete appeal', () => {
    const allowedFromStates = [
      CaseState.ACCEPTED,
      CaseState.REJECTED,
      CaseState.DISMISSED,
    ]
    const allowedFromAppealStates = [CaseAppealState.RECEIVED]

    describe.each(allowedFromStates)('state %s', (fromState) => {
      it.each(allowedFromAppealStates)(
        'appeal state %s - should complete appeal',
        (fromAppealState) => {
          // Act
          const res = transitionCase(
            CaseTransition.COMPLETE_APPEAL,
            fromState,
            fromAppealState,
          )

          // Assert
          expect(res).toEqual({ appealState: CaseAppealState.COMPLETED })
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
            fromState,
            fromAppealState,
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
              fromState,
              fromAppealState,
            )

          // Act and assert
          expect(act).toThrow(ForbiddenException)
        },
      )
    })
  })

  describe('reopen appeal', () => {
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
            fromState,
            fromAppealState,
          )

          // Assert
          expect(res).toEqual({ appealState: CaseAppealState.RECEIVED })
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
            fromState,
            fromAppealState,
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
              fromState,
              fromAppealState,
            )

          // Act and assert
          expect(act).toThrow(ForbiddenException)
        },
      )
    })
  })
})
