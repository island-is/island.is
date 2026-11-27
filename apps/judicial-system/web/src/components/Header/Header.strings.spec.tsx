import { render, screen } from '@testing-library/react'

import { createFormatMessage } from '@island.is/judicial-system-web/src/utils/testHelpers.logic'

import MarkdownWrapper from '../MarkdownWrapper/MarkdownWrapper'
import { header } from './Header.strings'

describe('header.tipDisclaimer', () => {
  test('links to the support email address', () => {
    const formatMessage = createFormatMessage()

    render(
      <MarkdownWrapper
        markdown={formatMessage(
          { id: header.tipDisclaimer, defaultMessage: header.tipDisclaimer },
          { supportEmail: 'help@example.com' },
        )}
      />,
    )

    expect(
      screen.getByRole('link', { name: 'help@example.com' }),
    ).toHaveAttribute('href', 'mailto:help@example.com')
  })
})
