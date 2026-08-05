import type { ApolloError } from '@apollo/client'
import { getSubmitErrorReasonToToast } from './util'

const apolloErrorWith = (problem: unknown): ApolloError =>
  ({ graphQLErrors: [{ extensions: { problem } }] } as unknown as ApolloError)

// A real submit failure carrying a structured provider errorReason.
const structuredReasonError = apolloErrorWith({
  type: 'https://docs.devland.is/reference/problems/template-api-error',
  errorReason: {
    title: 'Eitthvað fór úrskeiðis',
    summary: 'Umsókn um BE réttindi synjað',
  },
})

describe('getSubmitErrorReasonToToast', () => {
  it('returns null when disabled, even with a structured reason (opt-in default off)', () => {
    expect(getSubmitErrorReasonToToast(structuredReasonError, false)).toBeNull()
  })

  it('returns the reason when enabled and the error carries a structured reason', () => {
    expect(getSubmitErrorReasonToToast(structuredReasonError, true)).toEqual({
      title: 'Eitthvað fór úrskeiðis',
      summary: 'Umsókn um BE réttindi synjað',
    })
  })

  it('returns null when enabled but there is no submit error', () => {
    expect(getSubmitErrorReasonToToast(undefined, true)).toBeNull()
  })

  it('returns null when enabled but the reason is not a structured provider reason', () => {
    // No errorReason, or an empty summary → not a provider error reason.
    const noReason = apolloErrorWith({ type: 'x', title: 'oops' })
    const emptySummary = apolloErrorWith({
      type: 'x',
      errorReason: { title: 'T', summary: '' },
    })
    expect(getSubmitErrorReasonToToast(noReason, true)).toBeNull()
    expect(getSubmitErrorReasonToToast(emptySummary, true)).toBeNull()
  })
})
