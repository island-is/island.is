import { render, screen } from '@testing-library/react'

import { MarkdownText } from './MarkdownText'

const text = 'Sjá [skilmála](https://island.is/skilmalar) nánar'

describe('MarkdownText', () => {
  it('leaves the links in the same tab by default', () => {
    render(<MarkdownText>{text}</MarkdownText>)

    const link = screen.getByRole('link', { name: /skilmála/ })
    expect(link.getAttribute('href')).toBe('https://island.is/skilmalar')
    expect(link.getAttribute('target')).toBeNull()
  })

  it('opens the links in a new tab when asked to', () => {
    render(
      <MarkdownText openLinksInNewTab={true} newTabLabel="Opnast í nýjum flipa">
        {text}
      </MarkdownText>,
    )

    // `Text` hands its links to the renderer on the link context, so this
    // catches a plain link being put back in place of the marked up one
    const link = screen.getByRole('link', { name: /skilmála/ })
    expect(link.getAttribute('href')).toBe('https://island.is/skilmalar')
    expect(link.getAttribute('target')).toBe('_blank')
    expect(link.getAttribute('rel')).toBe('noopener noreferrer')
    expect(link.textContent).toContain('Opnast í nýjum flipa')
  })
})
