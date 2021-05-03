import * as z from 'zod'

export const FundingGovernmentProjectsSchema = z.object({
  field: z.string(),
})

export type FundingGovernmentProjects = z.TypeOf<
  typeof FundingGovernmentProjectsSchema
>
