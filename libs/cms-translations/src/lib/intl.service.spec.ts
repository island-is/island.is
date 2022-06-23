import type { IntlShape } from '@formatjs/intl'
import { createTestIntl } from '../test'
import type { FormatMessage } from '../types'

type Fl = Omit<IntlShape<string>, 'formatMessage'>
type TestIntl = Fl & { formatMessage: FormatMessage }

describe('formatMessage', () => {
  let intl: TestIntl
  beforeAll(() => {
    intl = createTestIntl({ locale: 'is-IS', onError: jest.fn() })
  })

  it('should return empty string when descriptor is missing', () => {
    expect(intl.formatMessage('')).toBe('')
  })

  it('should return descriptor if typeof string', () => {
    expect(intl.formatMessage('test')).toBe('test')
  })

  it('should call format message when descriptor is not a string', () => {
    const messages = {
      title: {
        id: 'testIntl.title',
        defaultMessage: 'Testing {test}',
        description: '',
      },
    }
    const result = intl.formatMessage(messages.title, { test: 'test' })

    expect(result).toBe('Testing test')
  })
})
