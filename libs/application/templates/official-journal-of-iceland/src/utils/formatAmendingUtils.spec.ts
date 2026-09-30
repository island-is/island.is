import {
  allSameDay,
  escapeHtml,
  extractArticleTitleDisplay,
  extractAuthority,
  formatDate,
  hasSubtitle,
  updateAppendixWording,
} from './formatAmendingUtils'

describe('extractAuthority', () => {
  it.each([
    [
      'Reglugerð þessi er sett með heimild í lögum nr. 93/1995 um matvæli.',
      'með heimild í lögum nr. 93/1995 um matvæli',
    ],
    [
      'Reglugerð þessi er sett með heimild í lögum nr. 1/2000 og öðlast þegar gildi.',
      'með heimild í lögum nr. 1/2000',
    ],
    [
      'Reglugerð þessi er sett samkvæmt heimild í 193. gr. tollalaga, nr. 88/2005, með síðari breytingum, og öðlast gildi þegar í stað.',
      'samkvæmt heimild í 193. gr. tollalaga, nr. 88/2005, með síðari breytingum',
    ],
    [
      'Reglugerð þessi er sett samkvæmt heimild í 31. gr. a laga nr. 93/1995 um matvæli, með síðari breytingum. Reglugerð þessi öðlast þegar gildi.',
      'samkvæmt heimild í 31. gr. a laga nr. 93/1995 um matvæli, með síðari breytingum',
    ],
    [
      'Reglugerð þessi, sem sett er með stoð í 1. mgr. 43. gr. laga nr. 50/1988, um virðisaukaskatt, með síðari breytingum, öðlast gildi 1. maí 2023.',
      'með stoð í 1. mgr. 43. gr. laga nr. 50/1988, um virðisaukaskatt, með síðari breytingum',
    ],
    [
      'Reglugerð þessi, sem er sett samkvæmt heimild í lögum nr. 100/1992 um vog, mál og faggildingu, öðlast þegar gildi.',
      'samkvæmt heimild í lögum nr. 100/1992 um vog, mál og faggildingu',
    ],
    [
      'Reglugerð þessi sem sett er samkvæmt heimild í 10. gr. skaðabótalaga nr. 50/1993 öðlast gildi 1. mars 2008.',
      'samkvæmt heimild í 10. gr. skaðabótalaga nr. 50/1993',
    ],
    [
      'Reglugerð þessi er sett samkvæmt ákvæðum 5. gr. laga nr. 7/1998 um hollustuhætti og mengunarvarnir.',
      'samkvæmt ákvæðum 5. gr. laga nr. 7/1998 um hollustuhætti og mengunarvarnir',
    ],
    [
      'Reglugerð þessi er sett skv. 14. gr. laga nr. 64/1994, um vernd, friðun og veiðar á villtum fuglum og villtum spendýrum.',
      'skv. 14. gr. laga nr. 64/1994, um vernd, friðun og veiðar á villtum fuglum og villtum spendýrum',
    ],
    [
      'Reglugerð þessi er sett sbr. heimild í 9. gr. laga nr. 77/1979 um Háskóla Íslands, sbr. háskólareglugerð nr. 78/1979, 66. gr. , og öðlast þegar gildi.',
      'sbr. heimild í 9. gr. laga nr. 77/1979 um Háskóla Íslands, sbr. háskólareglugerð nr. 78/1979, 66. gr.',
    ],
    [
      'Reglugerðin er sett á grundvelli 3. mgr. 74. gr. laga um fjarskipti nr. 70/2022.',
      'á grundvelli 3. mgr. 74. gr. laga um fjarskipti nr. 70/2022',
    ],
    [
      'Reglugerð þessi, sem sett er með stoð í 28. gr. laga nr. 29/1993, um vörugjald af ökutækjum, eldsneyti o.fl., öðlast gildi þegar í stað.',
      'með stoð í 28. gr. laga nr. 29/1993, um vörugjald af ökutækjum, eldsneyti o.fl.',
    ],
    [
      'Reglugerð þessi, sem sett er samkvæmt 4. gr. hafnalaga nr. 61/2003, staðfestist hér með til að öðlast þegar gildi.',
      'samkvæmt 4. gr. hafnalaga nr. 61/2003',
    ],
    [
      'Reglugerð þessi er sett samkvæmt ákvæðum laga nr. 116/2006, um stjórn fiskveiða, til þess að öðlast þegar gildi.',
      'samkvæmt ákvæðum laga nr. 116/2006, um stjórn fiskveiða',
    ],
    [
      'Reglugerð þessi er sett með heimild í 145. gr. sbr. IX. kafla laga um loftferðir nr. 60/1998.',
      'með heimild í 145. gr. sbr. IX. kafla laga um loftferðir nr. 60/1998',
    ],
    // What the base regulation implements doesn't carry over
    [
      'Reglugerð þessi er sett á grundvelli 10. gr. laga nr. 134/1995, um öryggi vöru, með áorðnum breytingum og innleiðir ákvarðanir Evrópusambandsins nr. 2006/502/EB.',
      'á grundvelli 10. gr. laga nr. 134/1995, um öryggi vöru, með áorðnum breytingum',
    ],
    [
      'Reglugerð þessi er sett samkvæmt ákvæðum 5. gr. laga nr. 7/1998 og með hliðsjón af 26. tölul. XX. viðauka EES-samningsins.',
      'samkvæmt ákvæðum 5. gr. laga nr. 7/1998',
    ],
  ])('"%s"', (text, authority) => {
    expect(extractAuthority(text)).toBe(authority)
  })

  it.each([
    'Reglugerðin öðlast þegar gildi.',
    'Reglugerðin er sett til innleiðingar á eftirfarandi EES-gerðum:',
    'Reglugerð þessi er sett með hliðsjón af ákvörðun sameiginlegu EES-nefndarinnar.',
    'Reglugerð þessi er sett með fyrirvara um gildandi gæðakröfur.',
    'Brot gegn ákvæðum þessarar reglugerðar og reglum og fyrirmælum sem sett eru með stoð í henni, varða sektum.',
    'Ákvæði samningsins um Evrópska efnahagssvæðið sem vísað er til í I. kafla I. viðauka skulu öðlast gildi með breytingum og viðbótum sem leiðir af I. viðauka.',
    'Jafnframt fellur úr gildi reglugerð nr. 244/2008 með síðari breytingum.',
    '',
  ])('finds no authority in "%s"', (text) => {
    expect(extractAuthority(text)).toBeUndefined()
  })
})

describe('escapeHtml', () => {
  it('escapes markup characters', () => {
    expect(escapeHtml('Gjald skal vera < 5 & > 2.')).toBe(
      'Gjald skal vera &lt; 5 &amp; &gt; 2.',
    )
  })
})

describe('extractArticleTitleDisplay and hasSubtitle', () => {
  it.each([
    ['3. gr.', '3. gr.', false],
    ['3. gr. Gildistaka.', '3. gr.', true],
    ['3. gr. a. Undanþágur', '3. gr. a.', true],
    ['II. Kafli', 'II. Kafli', false],
  ])('"%s"', (title, display, subtitle) => {
    expect(extractArticleTitleDisplay(title)).toBe(display)
    expect(hasSubtitle(title)).toBe(subtitle)
  })
})

describe('updateAppendixWording', () => {
  it('declines viðauki and fylgiskjal and keeps the case', () => {
    expect(updateAppendixWording('Viðauki I')).toBe('Viðauka I')
    expect(updateAppendixWording('fylgiskjal 2')).toBe('fylgiskjali 2')
  })
})

describe('formatDate', () => {
  it('formats in Icelandic without a leading zero', () => {
    expect(formatDate(new Date(2026, 11, 1))).toBe('1. desember 2026')
  })

  it('returns an empty string for an invalid date', () => {
    expect(formatDate(new Date('nope'))).toBe('')
  })
})

describe('allSameDay', () => {
  it('ignores missing dates', () => {
    expect(allSameDay([{ date: new Date(2026, 0, 1) }, {}])).toBe(true)
    expect(allSameDay([])).toBe(true)
  })

  it('is false for different days', () => {
    expect(
      allSameDay([
        { date: new Date(2026, 0, 1) },
        { date: new Date(2026, 0, 2) },
      ]),
    ).toBe(false)
  })
})
