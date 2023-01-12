import { HTMLText } from '@island.is/regulations'
import { findSignatureInText } from './guessers'

const find = (html: string) => findSignatureInText(html as HTMLText)

const emptyResult = {
  ministryName: undefined,
  signatureDate: undefined,
}

const blahBlah = `<p>Ég er tilgangslaus texti.</p>`

describe('findSignatureInText', () => {
  it('accepts and ignores empty (or uninteresting) signature HTML', () => {
    expect(find(``)).toEqual(emptyResult)
    expect(find(blahBlah)).toEqual(emptyResult)
  })

  it('detects ministry and signature date', () => {
    expect(
      find(
        `<p class="Dags" align="center"><em>Félagsmálaráðuneytinu, 1. janúar 2020.</em><p>`,
      ),
    ).toEqual({
      ministryName: 'Félagsmálaráðuneyti',
      signatureDate: '2020-01-01',
    })
    expect(
      find(
        blahBlah +
          `<p>Forsætisráðuneytinu, 2. febrúar 2022.<p>` +
          blahBlah +
          blahBlah,
      ),
    ).toEqual({
      ministryName: 'Forsætisráðuneyti',
      signatureDate: '2022-02-02',
    })
    expect(
      find(
        blahBlah +
          `<p>Félags- og barnamálaráðuneytinu, 1. desember 2021.<p>` +
          blahBlah,
      ),
    ).toEqual({
      ministryName: 'Félags- og barnamálaráðuneyti',
      signatureDate: '2021-12-01',
    })
    // Ignores nonsensical/unkown ministry names
    // (any such validation is handled elsewhere)
    expect(
      find(blahBlah + `<p>Blablablaráðuneytinu, 1. mars 2023.<p>` + blahBlah),
    ).toEqual({
      ministryName: 'Blablablaráðuneyti',
      signatureDate: '2023-03-01',
    })
  })

  it('picks the first match out of multiple candidates', () => {
    expect(
      find(
        `
        <p>Forsætisráðuneytinu, 2. febrúar 2022.<p>
        <p class="Dags" align="center"><em>Félagsmálaráðuneytinu, 1. janúar 2020.</em><p>
        <p>Félags- og barnamálaráðuneytinu, 1. desember 2021.<p>
        `,
      ),
    ).toEqual({
      ministryName: 'Forsætisráðuneyti',
      signatureDate: '2022-02-02',
    })
  })

  it('tolerates lack of definite article and alternative declensions of the word Ráðuneyti and optional trailing comma', () => {
    // enginn greinir
    expect(find(`<p>Félagsmálaráðuneyti, \n 2. janúar 2020.<p>`)).toEqual({
      ministryName: 'Félagsmálaráðuneyti',
      signatureDate: '2020-01-02',
    })
    // nefnifall/þolfall
    expect(find(`<p>Félagsmálaráðuneytið, 1. janúar 2020.<p>`)).toEqual({
      ministryName: 'Félagsmálaráðuneyti',
      signatureDate: '2020-01-01',
    })
    // engin komma á eftir
    expect(find(`<p>Félagsmálaráðuneytið \n 2. janúar 2020.<p>`)).toEqual({
      ministryName: 'Félagsmálaráðuneyti',
      signatureDate: '2020-01-02',
    })
  })

  it('allows the signature sentence to start with "Í " but everything else is interpreted as ráðuneyti', () => {
    expect(
      find(`<p>Í Félags- og barnamálaráðuneytinu, 1. desember 2021.<p>`),
    ).toEqual({
      ministryName: 'Félags- og barnamálaráðuneyti',
      signatureDate: '2021-12-01',
    })
    expect(
      find(
        `<p>Í góðum hópi fólks í Félags- og barnamálaráðuneytinu, 1. desember 2021.<p>`,
      ),
    ).toEqual({
      ministryName: 'góðum hópi fólks í Félags- og barnamálaráðuneyti',
      signatureDate: '2021-12-01',
    })
  })

  it('allows the date to be preceeded with "þann"', () => {
    expect(
      find(`<p>Í Félags- og barnamálaráðuneytinu þann 1. desember 2021.<p>`),
    ).toEqual({
      ministryName: 'Félags- og barnamálaráðuneyti',
      signatureDate: '2021-12-01',
    })
    expect(find(`<p>Jólamálaráðuneytinu, þann\t 2. desember 2021.<p>`)).toEqual(
      {
        ministryName: 'Jólamálaráðuneyti',
        signatureDate: '2021-12-02',
      },
    )
  })

  it('requires the paragraph to end with the date, and the date to directly follow the ministry name', () => {
    expect(
      find(
        `<p>Félags- og barnamálaráðuneytinu, 1. desember 2021, á þeim fallega degi.<p>`,
      ),
    ).toEqual(emptyResult)
    expect(
      find(
        `<p>Félags- og barnamálaráðuneytinu, í góðra vina hópi, þann 1. desember 2021.<p>`,
      ),
    ).toEqual(emptyResult)
  })

  it('tolerates zero-padded dates, missing ordinal periods, wrong casing, and abbreviated month names', () => {
    expect(find(`<p>Jólamálaráðuneytinu, 01. desember 2021.<p>`)).toEqual({
      ministryName: 'Jólamálaráðuneyti',
      signatureDate: '2021-12-01',
    })
    expect(find(`<p>Jólamálaráðuneytinu, 01 desember 2021.<p>`)).toEqual({
      ministryName: 'Jólamálaráðuneyti',
      signatureDate: '2021-12-01',
    })
    // inorrect casing in month name
    expect(find(`<p>Jólamálaráðuneytinu, 21 Desember 2021.<p>`)).toEqual({
      ministryName: 'Jólamálaráðuneyti',
      signatureDate: '2021-12-21',
    })
    expect(find(`<p>Jólamálaráðuneytinu, 11 des 2021.<p>`)).toEqual({
      ministryName: 'Jólamálaráðuneyti',
      signatureDate: '2021-12-11',
    })
    expect(find(`<p>Jólamálaráðuneytinu, 13. des. 2021.<p>`)).toEqual({
      ministryName: 'Jólamálaráðuneyti',
      signatureDate: '2021-12-13',
    })
    expect(find(`<p>Jólamálaráðuneytinu, 13. sep. 2021.<p>`)).toEqual({
      ministryName: 'Jólamálaráðuneyti',
      signatureDate: '2021-09-13',
    })
    // allow four lettera abbreviation of "september"
    expect(find(`<p>Jólamálaráðuneytinu, 13. sept. 2021.<p>`)).toEqual({
      ministryName: 'Jólamálaráðuneyti',
      signatureDate: '2021-09-13',
    })
    // month name in ALLCAPS + missing trailing period
    expect(find(`<p>Jólamálaráðuneytinu, 31. MAR. 2021<p>`)).toEqual({
      ministryName: 'Jólamálaráðuneyti',
      signatureDate: '2021-03-31',
    })
  })

  it('does not like periods or stuff after un-abbreviated month name', () => {
    expect(find(`<p>Jólamálaráðuneytinu, 01. desember. 2021.<p>`)).toEqual(
      emptyResult,
    )
    expect(find(`<p>Jólamálaráðuneytinu, 01. desember árið 2021.<p>`)).toEqual(
      emptyResult,
    )
    // However, it makes an exception for the three-letter month "maí"
    expect(find(`<p>Jólamálaráðuneytinu, 31. maí. 2021.<p>`)).toEqual({
      ministryName: 'Jólamálaráðuneyti',
      signatureDate: '2021-05-31',
    })
  })

  it('rejects invalid/outdated/far-future dates', () => {
    const onlyMinistry = {
      ministryName: 'Jólamálaráðuneyti',
      signatureDate: undefined,
    }

    // year 202 is too low/short
    expect(find(`<p>Jólamálaráðuneytinu, 1. febrúar 202.<p>`)).toEqual(
      emptyResult,
    )
    // crazy back-dating
    expect(find(`<p>Jólamálaráðuneytinu, 1. febrúar 1999.<p>`)).toEqual(
      emptyResult,
    )
    // too much back-dating (before 2020)
    expect(find(`<p>Jólamálaráðuneytinu, 1. febrúar 2019.<p>`)).toEqual(
      emptyResult,
    )
    // Well beyond the best-before-date of this system
    expect(find(`<p>Jólamálaráðuneytinu, 01. febrúar árið 2100.<p>`)).toEqual(
      emptyResult,
    )

    // negative day of month
    expect(find(`<p>Jólamálaráðuneytinu, -1. febrúar 2021.<p>`)).toEqual(
      emptyResult,
    )
    // crazy big day of month
    expect(find(`<p>Jólamálaráðuneytinu, 101. febrúar 2021.<p>`)).toEqual(
      emptyResult,
    )

    // february doesn't have that many days
    expect(find(`<p>Jólamálaráðuneytinu, 30. febrúar 2022.<p>`)).toEqual(
      onlyMinistry,
    )
    // 2022 is not a leap-year
    expect(find(`<p>Jólamálaráðuneytinu, 29. febrúar 2022.<p>`)).toEqual(
      onlyMinistry,
    )
    // However, 2020 was a leap-year
    expect(find(`<p>Jólamálaráðuneytinu, 29. febrúar 2020.<p>`)).toEqual({
      ministryName: 'Jólamálaráðuneyti',
      signatureDate: '2020-02-29',
    })
  })
})
