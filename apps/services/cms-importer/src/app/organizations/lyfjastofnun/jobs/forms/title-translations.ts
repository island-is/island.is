// English titles for the Lyfjastofnun forms list.
//
// These are NOT hand translations — every value below is the title as actually
// published on https://www.ima.is/published_material/forms/, matched to its
// Icelandic counterpart by hand. Automatic cross-matching only resolves 8 of
// the 50 items, because ima.is republishes most documents under its own file
// names, so `matchKeyFor` has nothing to key on. The titles themselves are all
// public, just not machine-linkable.
//
// Deliberately incomplete: where the mapping is not unambiguously 1:1, the item
// is left out and stays Icelandic-only rather than being given a guessed title.
// `mapLocalizedValue(isValue, undefined)` emits `is-IS` only, so an absent entry
// needs no special handling. Skipped on purpose:
//   - the two "hámarksheildsöluverð - leyfisskyld lyf" variants and
//     "- undanþágulyf": three IS items against one EN candidate
//   - "Umsókn um birtingu lyfja í lyfjaverðskrá og sérlyfjaskrá": three
//     plausible EN candidates across different EN groups
//   - "Skráningarform dreifingaraðila": EN offers "registration form" and
//     "...for producers"; the Icelandic says distributors
//   - "Eyðublað um breytt heiti dýralyfja": closest EN is not veterinary
//   - "Birgðaskrá eftirritunarskyldra lyfja...": EN says "Usage report", the
//     Icelandic is an inventory list
//   - the three ávana-/fíkniefni items against one EN "controlled substances"
//
// Keyed by the RAW scraped Icelandic title, matching `resolveTitleEn`.
export const TITLE_TRANSLATIONS_EN: Record<string, string> = {
  'Umsókn um hámarksheildsöluverð - almenn lyf':
    'Application for wholesale price',
  'Umsókn um greiðsluþátttöku - almenn lyf':
    'Application for general reimbursement',
  'Umsókn um greiðsluþátttöku í ábendingu á leyfisskyldu lyfi':
    'Application for Reimbursement for Specialty Care Highcost medicine (SCHCM) – New indication',
  'Umsókn um greiðsluþátttöku í ábendingu á leyfisskyldu lyfi - nýtt lyfjaform eða nýr styrkleiki':
    'Application for Reimbursement for Specialty Care High-cost Medicine (SCHCM) – New Pharmaceutical Form or New Strength',
  'Umsókn um greiðsluþátttöku í ábendingu á leyfisskyldu lyfi - líftæknihliðstæða eða samheitalyf':
    'Application for Reimbursement for Specialty care high-cost medicine (SCHCM) – Biosimilar or Generic drugs',
  'Umsókn um endurbirtingu upplýsinga í lyfjaverðskrá':
    'Request for re-publication in the Price Catalogue',
  'Heimild til innflutnings smáskammtalyfs':
    'Application for importation, distribution and sale of homeopathic medicine',
  'Umsókn um lækkun árgjalds': 'Application for reduction of annual fees',
  'Umsókn um niðurfellingu markaðsleyfis eða brottfalls úr lyfjaskrám':
    'Application for withdrawal of MA or removal of information from the drug catalogue',
  'Umsókn um lyfsöluleyfi vegna nýs apóteks':
    'Application for pharmacy license, to start a new pharmacy',
  'Umsókn um lyfsöluleyfi vegna apóteks í rekstri':
    'Application for pharmacy license, to take over a operating pharmacy',
  'Umsókn um rekstrarleyfi nýs apóteks':
    'Application for operating license for pharmacy',
  'Umsókn um leyfi til að gegna störfum aðstoðarlyfjafræðings tímabundið':
    'Application to temporarily work as an assistant pharmacist',
  'Umsókn um leyfi til innflutnings og/eða heildsöludreifingar lyfja':
    'Application for license to import and distribute medicinal products',
  'Tilkynning um atvik vegna lækningatækis':
    'Notification for owner/user of incident',
  'Umsóknareyðublað um mat á öryggisupplýsingum':
    'Form for assessment of safety advice tools',
  'Tilkynning um lyfjaskort': 'Reporting medicine shortage',
  // Identity entry. This item's title is already English on the Icelandic page
  // — it is a genuinely English-language form, published alongside its separate
  // Icelandic counterpart ("Umboð til prentunar vegna afhendingar lyfja í
  // apóteki..."), which is a different PDF. Since `resolveTitleEn` is keyed by
  // the raw scraped title, without this entry the item would end up with no
  // English title at all. The Icelandic side is left as published rather than
  // inventing a translation Lyfjastofnun never wrote.
  'Limited power of attorney for third persons collecting medicines at a pharmacy':
    'Limited power of attorney for third persons collecting medicines at a pharmacy',
}
