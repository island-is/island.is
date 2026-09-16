import { splitDepartmentDateFromBody } from './OJOIUtils'

const dateLine = (inner: string) =>
  `<p align="center" style="margin-top: 1.5em;"><strong>${inner}</strong></p>`

describe('splitDepartmentDateFromBody', () => {
  it('splits off the closing department date line', () => {
    const body = '<p>Þetta er hér með gert almenningi kunnugt.</p>'
    const date = 'C deild — Útgáfudagur: 15. september 2026'

    expect(splitDepartmentDateFromBody(body + dateLine(date))).toEqual({
      bodyHtml: body,
      departmentDateHtml: `<strong>${date}</strong>`,
    })
  })

  it('supports the abbreviated Útgáfud.: wording', () => {
    const { departmentDateHtml } = splitDepartmentDateFromBody(
      '<p>body</p>' + dateLine('A deild — Útgáfud.: 1. maí 2026'),
    )

    expect(departmentDateHtml).toBe(
      '<strong>A deild — Útgáfud.: 1. maí 2026</strong>',
    )
  })

  it('ignores whitespace and empty markup trailing the date line', () => {
    const { departmentDateHtml } = splitDepartmentDateFromBody(
      '<p>body</p>' +
        dateLine('C deild — Útgáfudagur: 1. maí 2026') +
        '\n<br/><p> </p>',
    )

    expect(departmentDateHtml).toBe(
      '<strong>C deild — Útgáfudagur: 1. maí 2026</strong>',
    )
  })

  it('takes the last date line when the body mentions one earlier', () => {
    const { bodyHtml, departmentDateHtml } = splitDepartmentDateFromBody(
      '<p>Útgáfudagur: eldri auglýsingar</p>' +
        dateLine('C deild — Útgáfudagur: 1. maí 2026'),
    )

    expect(bodyHtml).toBe('<p>Útgáfudagur: eldri auglýsingar</p>')
    expect(departmentDateHtml).toBe(
      '<strong>C deild — Útgáfudagur: 1. maí 2026</strong>',
    )
  })

  it('leaves the body untouched when the date line is not the closing line', () => {
    const html =
      dateLine('C deild — Útgáfudagur: 1. maí 2026') + '<p>eftirmáli</p>'

    expect(splitDepartmentDateFromBody(html)).toEqual({
      bodyHtml: html,
      departmentDateHtml: null,
    })
  })

  it('leaves the body untouched when there is no date line', () => {
    const html = '<p>body</p><div class="signature"><p>Ráðuneytinu</p></div>'

    expect(splitDepartmentDateFromBody(html)).toEqual({
      bodyHtml: html,
      departmentDateHtml: null,
    })
  })
})
