import { render } from '@testing-library/react'

import { OJOIAdvertDisplay } from './OJOIAdvertDisplay'

const DATE_LINE = 'C deild — Útgáfudagur: 15. september 2026'

const advertText =
  '<p>Þetta er hér með gert almenningi kunnugt.</p>' +
  `<p align="center" style="margin-top: 1.5em;"><strong>${DATE_LINE}</strong></p>`

const props = {
  advertNumber: '23/2026',
  signatureDate: '14. september 2026',
  advertType: 'AUGLÝSING',
  advertSubject: 'um innleiðingu',
  advertText,
  isLegacy: false,
}

const additions = [
  { id: 'a1', title: 'Fylgiskjal 1.', html: '<p>Viðauki</p>', order: 0 },
  { id: 'a2', title: 'Fylgiskjal 2.', html: '<p>Viðauki</p>', order: 1 },
]

const countDateLines = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('p')).filter((p) =>
    p.textContent?.includes(DATE_LINE),
  ).length

describe('OJOIAdvertDisplay', () => {
  it('renders the department date once when the advert has appendixes', () => {
    const { container } = render(
      <OJOIAdvertDisplay {...props} additions={additions} />,
    )

    expect(countDateLines(container)).toBe(1)
  })

  it('moves the department date below the appendix accordion', () => {
    const { container } = render(
      <OJOIAdvertDisplay {...props} additions={additions} />,
    )

    const body = container.querySelector('.ojoi-advert-display-wrapper')
    expect(body?.textContent).not.toContain(DATE_LINE)

    const dateLine = Array.from(container.querySelectorAll('p')).find((p) =>
      p.textContent?.includes(DATE_LINE),
    )
    const accordion = container.querySelector('[aria-expanded]')
    expect(dateLine).toBeDefined()
    expect(accordion).not.toBeNull()
    // 4 === DOCUMENT_POSITION_FOLLOWING, ie. the date line comes after the accordion
    expect(accordion?.compareDocumentPosition(dateLine as Node)).toBe(4)
  })

  it('leaves the department date in the body when there are no appendixes', () => {
    const { container } = render(
      <OJOIAdvertDisplay {...props} additions={[]} />,
    )

    expect(countDateLines(container)).toBe(1)
    expect(
      container.querySelector('.ojoi-advert-display-wrapper')?.textContent,
    ).toContain(DATE_LINE)
  })
})
