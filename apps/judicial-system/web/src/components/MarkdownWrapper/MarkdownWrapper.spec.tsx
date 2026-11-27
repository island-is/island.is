import { render, screen } from '@testing-library/react'

import MarkdownWrapper from './MarkdownWrapper'

describe('MarkdownWrapper', () => {
  test('preserves the semantic heading level of each markdown heading', () => {
    render(<MarkdownWrapper markdown={'# First\n\n## Second\n\n### Third'} />)

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

  test('renders markdown emphasis, paragraphs and links', () => {
    const { container } = render(
      <MarkdownWrapper
        markdown={
          '_Office_ has access\n\nWrite to [help@example.com](mailto:help@example.com)'
        }
      />,
    )

    expect(container.querySelector('em')).toHaveTextContent('Office')
    expect(container.querySelectorAll('p')).toHaveLength(2)
    expect(
      screen.getByRole('link', { name: 'help@example.com' }),
    ).toHaveAttribute('href', 'mailto:help@example.com')
  })

  test('shows markup in the input as written instead of rendering it', () => {
    const { container } = render(
      <MarkdownWrapper
        markdown={
          'Before <strong>bold</strong> <input name="reason" /><br/>after'
        }
      />,
    )

    expect(container.querySelector('strong')).toBeNull()
    expect(container.querySelector('input')).toBeNull()
    expect(container.querySelector('br')).toBeNull()
    expect(container).toHaveTextContent(
      'Before <strong>bold</strong> <input name="reason" /><br/>after',
    )
  })
})
