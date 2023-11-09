import {
  RemoveableCountrySchema,
  ParentInformationSchema,
  RemoveableStayAbroadSchema,
  SelectedChildSchema,
} from '../lib/dataSchema'
import { z } from 'zod'

export type ParentsToApplicant = z.TypeOf<typeof ParentInformationSchema>
export type ChildrenOfApplicant = z.TypeOf<typeof SelectedChildSchema>
export type CountryOfResidence = z.TypeOf<typeof RemoveableCountrySchema>
export type CountryOfVisit = z.TypeOf<typeof RemoveableStayAbroadSchema>
