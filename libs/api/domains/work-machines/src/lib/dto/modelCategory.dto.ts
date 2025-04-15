import { Category } from '../models/category.model'
import { SubCategory } from '../models/subCategory.model'
import { ResolverPassDown } from '../workMachines.types'

export type ModelSubCategory = SubCategory & ResolverPassDown
export type ModelCategory = Category & ResolverPassDown
