import { StringOption as Option } from '@island.is/island-ui/core'

export const baseUrl = '/s/stjornartidindi'
export const searchUrl = baseUrl + '/leit'
export const categoriesUrl = baseUrl + '/malaflokkar'
export const stjornartidindiAdvertUrl = baseUrl + '/nr'

export type AdvertType = {
  id: string
  heiti: string
  utgafa: string
  deild: string
  numer: string
  stofnun: string
  flokkar: Array<string>
}

export const splitArrayIntoGroups = <T>(array: Array<T>, groupSize: number) => {
  const groups = []
  for (let i = 0; i < array.length; i += groupSize) {
    groups.push(array.slice(i, i + groupSize))
  }
  return groups
}

export const removeEmptyFromObject = (obj: Record<string, string>) => {
  return Object.entries(obj)
    .filter(([_, v]) => !!v)
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {})
}

export const emptyOption = (label?: string): Option => ({
  label: label ? `– ${label} –` : '—',
  value: '',
})

export const findValueOption = (
  options: ReadonlyArray<Option>,
  value?: string,
) => {
  // NOTE: The returned option MUST NOT be a copy (with trimmed value,
  // even if it would look nicer) because react-select seems to do an
  // internal `===` comparison against the options list, and thus copies
  // will fail to appear selected in the dropdown list.
  return (value && options.find((opt) => opt.value === value)) || null
}

export const deildOptions: Array<Option> = [
  { label: 'A deild', value: 'a-deild' },
  { label: 'B deild', value: 'b-deild' },
]

type MalaflokkurOption = Option & {
  yfirflokkur?: string
  deild?: string
}

export const malaflokkurOptions: Array<MalaflokkurOption> = [
  {
    label: 'Almannavarnir',
    value: 'almannavarnir',
    yfirflokkur: 'domstolar',
    deild: 'a-deild',
  },
  {
    label: 'Sakamál',
    value: 'sakamal',
    yfirflokkur: 'domstolar',
    deild: 'a-deild',
  },
  {
    label: 'Auðlindir',
    value: 'audlindir',
    yfirflokkur: 'sjavarutvegur',
    deild: 'b-deild',
  },
  {
    label: 'Dýravernd',
    value: 'dyravernd',
    yfirflokkur: 'landbunadur',
    deild: 'b-deild',
  },
  {
    label: 'Erfðamál',
    value: 'erfdamal',
    yfirflokkur: 'malefni-barna',
    deild: 'a-deild',
  },
  {
    label: 'Atvinnumál',
    value: 'atvinnumal',
    yfirflokkur: 'landbunadur',
    deild: 'b-deild',
  },
]

type YfirflokkurOption = Option & {
  cardDescription: string
}

export const yfirflokkurOptions: Array<YfirflokkurOption> = [
  {
    label: 'Dómstólar og réttarfar',
    value: 'domstolar',
    cardDescription:
      'Hæstiréttur, lögmenn, lögreglumál, lögfræði, kjaradómur, refsilög, hegningarög, dómsmál og landsdómur.',
  },
  {
    label: 'Sjávarútvegur, fiskveiðar og fiskirækt',
    value: 'sjavarutvegur',
    cardDescription: 'Sjávarútvegur, Veiði - friðun, fiskeldi og hafnarmál.',
  },
  {
    label: 'Landbúnaður',
    value: 'landbunadur',
    cardDescription: 'Fóður, hross, hundar, dýravernd og landbúnaður.',
  },
  {
    label: 'Umhverfismál',
    value: 'umhverfismal',
    cardDescription:
      'Þjóðgarðar, þjóðlendur, umhverfismál, þingvellir, náttúrurannsóknir og náttúrurvernd.',
  },
  {
    label: 'Málefni barna',
    value: 'malefni-barna',
    cardDescription: 'Barnavernd.',
  },
  {
    label: 'Hugverka- og einkaréttindi',
    value: 'hugverkarettindi',
    cardDescription: 'Höfundarréttur, vörumerki, persónuvernd og einkaleyfi.',
  },
]

export const mockAdverts: Array<AdvertType> = [
  {
    id: '1383-2023',
    stofnun: 'Skipulagsstofnun',
    numer: '1383/2023',
    deild: 'A-deild',
    utgafa: '12.07.2023',
    heiti:
      'LÖG um breytingu á lögum um almennar íbúðir og lögum um húsnæðismál (almennar íbúðir vegna náttúruhamfara í Grindavíkurbæ).',
    flokkar: ['Skipulagsmál', 'Sveitarfélag Hornafjarðar'],
  },
  {
    id: '1383-2022',
    stofnun: 'Skipulagsstofnun',
    numer: '1383/2023',
    deild: 'A-deild',
    utgafa: '12.07.2023',
    heiti:
      'LÖG um breytingu á lögum um almennar íbúðir og lögum um húsnæðismál (almennar íbúðir vegna náttúruhamfara í Grindavíkurbæ).',
    flokkar: ['Skipulagsmál', 'Sveitarfélag Hornafjarðar'],
  },
]
