import {
  MinistryOfJusticeAdvertEntity,
  MinistryOfJusticeAdvertType,
} from '@island.is/api/schema'
import { StringOption as Option } from '@island.is/island-ui/core'
import { sortAlpha } from '@island.is/shared/utils'

export const baseUrl = '/s/stjornartidindi'
export const searchUrl = baseUrl + '/leit'
export const categoriesUrl = baseUrl + '/malaflokkar'
export const advertUrl = baseUrl + '/nr'

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

type EntityOption = Option & {
  mainCategory?: string
  department?: string
}

export const mapEntityToOptions = (
  entities: Array<MinistryOfJusticeAdvertEntity | MinistryOfJusticeAdvertType>,
): Array<Option> => {
  return entities.map((e) => {
    return {
      label: e.title,
      value: e.slug,
    }
  })
}

export const sortCategories = (cats: typeof malaflokkurOptions) => {
  return cats.sort((a, b) => {
    return sortAlpha('label')(a, b)
  })
}

export const malaflokkurOptions: Array<EntityOption> = [
  {
    label: 'Almannavarnir',
    value: 'almannavarnir',
    mainCategory: 'domstolar',
    department: 'a-deild',
  },
  {
    label: 'Sakamál',
    value: 'sakamal',
    mainCategory: 'domstolar',
    department: 'a-deild',
  },
  {
    label: 'Auðlindir',
    value: 'audlindir',
    mainCategory: 'sjavarutvegur',
    department: 'b-deild',
  },
  {
    label: 'Dýravernd',
    value: 'dyravernd',
    mainCategory: 'landbunadur',
    department: 'b-deild',
  },
  {
    label: 'Erfðamál',
    value: 'erfdamal',
    mainCategory: 'malefni-barna',
    department: 'a-deild',
  },
  {
    label: 'Atvinnumál',
    value: 'atvinnumal',
    mainCategory: 'landbunadur',
    department: 'b-deild',
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
