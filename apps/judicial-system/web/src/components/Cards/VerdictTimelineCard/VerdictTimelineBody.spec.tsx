import { render, screen } from '@testing-library/react'

import VerdictTimelineBody from './VerdictTimelineBody'

/**
 * Which items enter is decided in VerdictTimelineBody.logic.spec.ts. What is
 * left for the rendered body is that an entering item really starts from its
 * hidden state, and that a settled one does not.
 */
describe('VerdictTimelineBody', () => {
  const item = (text: string) => ({ text })
  const bullet = (text: string) =>
    screen.getByText(`• ${text}`).parentElement as HTMLElement

  it('should render every item settled on the first render', () => {
    render(
      <VerdictTimelineBody
        eyebrow="Jón"
        items={[item('served'), item('stance')]}
      />,
    )

    expect(bullet('served')).not.toHaveStyle({ opacity: 0 })
    expect(bullet('stance')).not.toHaveStyle({ opacity: 0 })
  })

  it('should let an item replacing another enter from hidden', () => {
    const { rerender } = render(
      <VerdictTimelineBody
        eyebrow="Jón"
        items={[item('served'), item('stance')]}
      />,
    )

    rerender(
      <VerdictTimelineBody
        eyebrow="Jón"
        items={[item('served'), item('appealed')]}
      />,
    )

    expect(bullet('served')).not.toHaveStyle({ opacity: 0 })
    expect(bullet('appealed')).toHaveStyle({ opacity: 0 })
  })

  it('should let an appended item enter from hidden', () => {
    const { rerender } = render(
      <VerdictTimelineBody eyebrow="Jón" items={[item('requirement')]} />,
    )

    rerender(
      <VerdictTimelineBody
        eyebrow="Jón"
        items={[item('requirement'), item('served')]}
      />,
    )

    expect(bullet('requirement')).not.toHaveStyle({ opacity: 0 })
    expect(bullet('served')).toHaveStyle({ opacity: 0 })
  })
})
