export const GENERIC_LIST_ID = '59heCt9N8d5xH7LSiKqRyN'

// Keyed by the exact `relatedfiles__item__category` label rendered on the page.
// These are the 12 genericTag entries in the "Umsóknir og eyðublöð
// Lyfjastofnunar" tag group (5PLZlJGECqXqk2v0W016rH), all of which are already
// wired into the target list's `filterTags`.
//
// Note there is deliberately no "other" bucket here, unlike the instructions
// and lists jobs — an unrecognised label is a signal that the page changed, not
// something to silently absorb. See forms.mapper.ts.
export const CATEGORY_TAG_IDS: Record<string, string | undefined> = {
  'Verð og greiðsluþátttaka': '1aIO7Y9lZqLDczQvL3w20p',
  'Leyfisveiting lyfja': '5z07FHL9XUqjGcnUdv6Gfv',
  Apótek: '1Ahto33LLFlf9vSPXPlZGO',
  'Innflutningur, framleiðsla og heildsöludreifing lyfja':
    '6zxzoCwj5GhbYEMQWAP9cb',
  Dýralæknar: 'QIvW6u46JGya5OOdtub4f',
  Lækningatæki: '6yUUqxA03RDsuhcI5kNXlb',
  Öryggisupplýsingar: '4Ii3dDl4jubyBNPy21Tp2k',
  Lyfjaskortur: '5IN668GuCa0xJ822a1q32q',
  Undanþágulyf: '6jqXN1DgVBrShqCrX665o9',
  'Aðgangur að upplýsingum': '6qFPqYgZ7EcnUFXG5kc88S',
  'Innflutningur og útflutningur': '1wxLc4H3PpjYU0Z5sDxREF',
  'Undanþága fyrir almennar verslanir': '4vAUcxGShjQLYFR2IRfLpX',
}

export const LINK_URL_CONTENT_TYPE = 'linkUrl' as const

export const FILE_CONTENT_TYPE_MAP: Record<string, string> = {
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  xls: 'application/vnd.ms-excel',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  doc: 'application/msword',
  pdf: 'application/pdf',
  csv: 'text/csv',
}

// The lists job keeps separate `FILE_TYPE_LABELS_IS`/`_EN` maps because it
// renders wordy labels ("Excel skrá" / "Excel file"). The forms list instead
// shows the bare uppercased extension in both locales — matching the entries
// already authored under this list — so no lookup map is needed.
export const EXTERNAL_LINK_LABEL_IS = 'Vefumsókn'
export const EXTERNAL_LINK_LABEL_EN = 'Web application'
