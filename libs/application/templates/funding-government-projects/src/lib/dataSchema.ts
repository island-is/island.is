import * as z from 'zod'

const FileSchema = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string().optional(),
})

export const FundingGovernmentProjectsSchema = z.object({
  field: z.string(),
  project: z.object({
    title: z.string().nonempty(),
    description: z.string().nonempty(),
    cost: z.string().nonempty(),
    refundableYears: z.number(),
    // TODO: Attachments are required
    attachments: z.array(FileSchema),
  }),
})

export type FundingGovernmentProjects = z.TypeOf<
  typeof FundingGovernmentProjectsSchema
>
