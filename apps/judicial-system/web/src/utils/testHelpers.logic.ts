import { createIntl } from 'react-intl'

export const createFormatMessage = () =>
  createIntl({
    locale: 'is',
    onError: jest.fn,
  }).formatMessage
