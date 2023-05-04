import { z } from 'zod'

export const checkboxSchema = z
  .object({
    applyForPlastic: z.array(z.string()).optional(),
    addForPDF: z.array(z.string()).optional(),
  })
  .refine((v) => v.applyForPlastic?.length || v.addForPDF?.length)

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  delimitations: checkboxSchema,
})

// import { z } from 'zod'

// export const contactSchema = z.object({
//   name: z.string().min(1),
// })

// export const dataSchema = z.object({
//   approveExternalData: z.boolean().refine((v) => v),
//   applyForPlastic: z.array(z.string()).refine((v) => v.length > 0, {}),
//   contact: contactSchema,
// })
