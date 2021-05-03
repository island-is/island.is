import * as z from 'zod'

export const FundingGovernmentProjectsSchema = z.object({
  field: z.string(),
  project: z.object({
    title: z.string().nonempty(),
    description: z.string().nonempty(),
    cost: z.string().nonempty(),
  }),
})

export type FundingGovernmentProjects = z.TypeOf<
  typeof FundingGovernmentProjectsSchema
>
