import { render, screen } from '@testing-library/react'

import ExplanationText from './ExplanationText'

describe('ExplanationText', () => {
  test('shows each line of the explanation on its own line', () => {
    const { container } = render(
      <ExplanationText explanation={'First<br/><br/>Second\n\nThird'} />,
    )

    expect(container.textContent).toBe('First\n\nSecond\n\nThird')
    expect(container.querySelector('br')).toBeNull()
    // The newlines only show as line breaks when white space is kept
    expect(container.firstElementChild?.className).toMatch(/preLine/)
  })

  test('shows markup and markdown in the explanation as written', () => {
    const explanation =
      'See <a href="https://example.com">this</a> and [that](https://example.com) <input name="reason" />'

    const { container } = render(<ExplanationText explanation={explanation} />)

    expect(screen.getByText(explanation)).toBeInTheDocument()
    expect(container.querySelector('a')).toBeNull()
    expect(container.querySelector('input')).toBeNull()
  })
})
