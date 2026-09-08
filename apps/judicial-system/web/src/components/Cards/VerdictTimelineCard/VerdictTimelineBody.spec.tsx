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

  // framer-motion writes an item's `initial` state as inline style on mount and
  // never progresses the animation in jsdom, so an item that will animate in is
  // one still sitting at opacity 0, and an item that popped straight into place
  // is one that never was.
  const expectToEnterAnimated = (element: HTMLElement) =>
    expect(element).toHaveStyle({ opacity: 0 })
  const expectToBeSettled = (element: HTMLElement) =>
    expect(element).not.toHaveStyle({ opacity: 0 })

  it('should render every item settled on the first render', () => {
    render(
      <VerdictTimelineBody
        eyebrow="Jón"
        items={[item('served'), item('stance')]}
      />,
    )

    expectToBeSettled(bullet('served'))
    expectToBeSettled(bullet('stance'))
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

    expectToBeSettled(bullet('served'))
    expectToEnterAnimated(bullet('appealed'))
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

    expectToBeSettled(bullet('requirement'))
    expectToEnterAnimated(bullet('served'))
  })
})
