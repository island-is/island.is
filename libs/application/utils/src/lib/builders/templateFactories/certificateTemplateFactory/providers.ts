import {
  InstitutionNationalIds,
  NationalRegistryUserApi,
  PaymentCatalogApi,
  UserProfileApi,
} from '@island.is/application/types'

const dataProviders = [
  {
    provider: NationalRegistryUserApi,
    title: 'Persónuupplýsingar úr Þjóðskrá',
    subTitle:
      'Til þess að auðvelda fyrir sækjum við persónuupplýsingar úr Þjóðskrá til þess að fylla út umsóknina',
  },
  {
    provider: UserProfileApi,
    title: 'Netfang og símanúmer úr þínum stillingum',
    subTitle:
      'Til þess að auðvelda umsóknarferlið er gott að hafa fyllt út netfang og símanúmer á mínum síðum',
  },
]

export default dataProviders
