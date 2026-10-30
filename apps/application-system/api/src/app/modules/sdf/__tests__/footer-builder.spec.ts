import type {
  Application,
  CallToAction,
  SubmitField,
} from '@island.is/application/types'

import { buildFooterButtons } from '../footer-builder'
import { FormTextResolver } from '../i18n-resolver.service'

// Minimal resolver backed by a fake `formatMessage`: descriptors resolve through
// the provided translation map (falling back to defaultMessage), plain strings
// are returned verbatim by FormTextResolver before they ever reach formatMessage.
const makeResolver = (translations: Record<string, string> = {}) => {
  const formatMessage = ((descriptor: unknown) => {
    if (
      descriptor &&
      typeof descriptor === 'object' &&
      'id' in (descriptor as Record<string, unknown>)
    ) {
      const d = descriptor as { id: string; defaultMessage?: string }
      return translations[d.id] ?? d.defaultMessage ?? ''
    }
    return typeof descriptor === 'string' ? descriptor : ''
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any
  return new FormTextResolver({} as Application, formatMessage, 'en')
}

const answers = {}
const externalData = {}

const roleActions: CallToAction[] = [
  { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' } as CallToAction,
]

describe('buildFooterButtons', () => {
  it('uses the submitField action label (translatable) over a role-action literal, keyed by event', () => {
    const submitField = {
      actions: [
        {
          event: 'SUBMIT',
          name: {
            id: 'application.system:button.next',
            defaultMessage: 'Halda áfram',
          },
          type: 'primary',
        },
      ],
    } as unknown as SubmitField

    const resolver = makeResolver({
      'application.system:button.next': 'Continue',
    })

    const [button] = buildFooterButtons(
      roleActions,
      answers,
      externalData,
      null,
      resolver,
      submitField,
    )

    expect(button.text).toBe('Continue')
    // The dispatched event/id still comes from the role action.
    expect(button.id).toBe('SUBMIT')
    expect(button.actionType).toBe('SUBMIT')
  })

  it('falls back to the role-action name when no submitField action matches the event', () => {
    const submitField = {
      actions: [
        {
          event: 'APPROVE',
          name: { id: 'x', defaultMessage: 'Approve' },
          type: 'primary',
        },
      ],
    } as unknown as SubmitField

    const [button] = buildFooterButtons(
      roleActions,
      answers,
      externalData,
      null,
      makeResolver(),
      submitField,
    )

    expect(button.text).toBe('Staðfesta')
  })

  it('falls back to the role-action name when no submitField is provided', () => {
    const [button] = buildFooterButtons(
      roleActions,
      answers,
      externalData,
      null,
      makeResolver(),
    )

    expect(button.text).toBe('Staðfesta')
  })
})
