import { render, screen } from '@testing-library/react'

import MarkdownWrapper from './MarkdownWrapper'

describe('MarkdownWrapper', () => {
  test('preserves the semantic heading level of each markdown heading', () => {
    render(
      <MarkdownWrapper markdown={'# First\n\n## Second\n\n### Third'} />,
    )

    // Headings keep their level instead of all collapsing to the same element.
    expect(
      screen.getByRole('heading', { level: 1, name: 'First' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: 'Second' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 3, name: 'Third' }),
    ).toBeInTheDocument()
  })
})
