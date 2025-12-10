import { ResolverPassDown } from '../workMachines.types'

export type CategoryDto = ResolverPassDown & {
  //localized
  name: string
  nameEn?: string
  //localized
  subCategoryName: string
  subCategoryNameEn?: string
  registrationNumberPrefix?: string
}
