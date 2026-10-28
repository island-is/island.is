import {
  getAdvertCitationTitle,
  getAdvertMetaDescription,
  splitDepartmentDateFromBody,
} from './OJOIUtils'

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

  it('does not swallow the body when an earlier paragraph is left unclosed', () => {
    const { bodyHtml, departmentDateHtml } = splitDepartmentDateFromBody(
      '<p>intro' + dateLine('C deild — Útgáfudagur: 15. september 2026'),
    )

    expect(bodyHtml).toBe('<p>intro')
    expect(departmentDateHtml).toBe(
      '<strong>C deild — Útgáfudagur: 15. september 2026</strong>',
    )
  })

  it('matches the uppercase tags used by legacy adverts', () => {
    const { bodyHtml, departmentDateHtml } = splitDepartmentDateFromBody(
      '<p>body</p><P ALIGN="CENTER"><STRONG>C deild — Útgáfudagur: 1. maí 2026</STRONG></P>',
    )

    expect(bodyHtml).toBe('<p>body</p>')
    expect(departmentDateHtml).toBe(
      '<STRONG>C deild — Útgáfudagur: 1. maí 2026</STRONG>',
    )
  })

  it('ignores a trailing paragraph holding only a non-breaking space', () => {
    const { bodyHtml, departmentDateHtml } = splitDepartmentDateFromBody(
      '<p>body</p>' +
        dateLine('C deild — Útgáfudagur: 1. maí 2026') +
        '<p>&nbsp;</p>',
    )

    expect(bodyHtml).toBe('<p>body</p><p>&nbsp;</p>')
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

describe('getAdvertCitationTitle', () => {
  it('cites the publication number with its type', () => {
    expect(
      getAdvertCitationTitle({
        type: 'REGLUGERÐ',
        publicationNumber: '760/2026',
        subject:
          'um endurgreiðslu kostnaðar vegna veikinda eða slysa erlendis.',
      }),
    ).toBe(
      'REGLUGERÐ nr. 760/2026 um endurgreiðslu kostnaðar vegna veikinda eða slysa erlendis.',
    )
  })

  it('leaves out missing parts', () => {
    expect(
      getAdvertCitationTitle({ type: 'AUGLÝSING', publicationNumber: '' }),
    ).toBe('AUGLÝSING')
    expect(getAdvertCitationTitle({})).toBe('')
  })
})

describe('getAdvertMetaDescription', () => {
  it('summarises the advert', () => {
    expect(
      getAdvertMetaDescription({
        citationTitle: 'REGLUGERÐ nr. 760/2026 um endurgreiðslu.',
        department: 'B deild',
        involvedParty: 'Heilbrigðisráðuneytið',
        publicationDateLabel: 'Útgáfudagur',
        publicationDate: '2026-07-06T12:00:00.000Z',
      }),
    ).toBe(
      'REGLUGERÐ nr. 760/2026 um endurgreiðslu. B deild, Heilbrigðisráðuneytið. Útgáfudagur: 6. júlí 2026.',
    )
  })

  it('does not double up periods or leave gaps for missing parts', () => {
    expect(
      getAdvertMetaDescription({
        citationTitle: 'GJALDSKRÁ nr. 12/2026 fyrir Stjórnartíðindi',
        involvedParty: 'Dómsmálaráðuneytið',
        publicationDateLabel: 'Útgáfudagur',
      }),
    ).toBe('GJALDSKRÁ nr. 12/2026 fyrir Stjórnartíðindi. Dómsmálaráðuneytið.')
  })
})
