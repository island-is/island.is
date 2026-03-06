import { z } from 'zod'
import * as kennitala from 'kennitala'

const applicantInformationSchema = z.object({
  nationalId: z
    .string()
    .refine(
      (nationalId) =>
        nationalId && nationalId.length !== 0 && kennitala.isValid(nationalId),
    ),
  name: z.string(),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  email: z.string(),
  phoneNumber: z.string(),
})

export const MachineAnswersSchema = z.object({
  machine: z
    .object({
      id: z.string().optional(),
      date: z.string().optional(),
      type: z.string().optional(),
      plate: z.string().optional(),
      subType: z.string().optional(),
      category: z.string().optional(),
      regNumber: z.string().optional(),
      ownerNumber: z.string().optional(),
      findVehicle: z.boolean().optional(),
      isValid: z.boolean().optional(),
    })
    .refine(({ isValid, findVehicle }) => {
      return (findVehicle && isValid) || !findVehicle
    }),
  approveExternalData: z.boolean().refine((v) => v),
  location: z.object({
    address: z.string().min(1),
    city: z.string().min(1),
    postalCode: z
      .string()
      .min(1)
      .refine(
        (data): data is string =>
          typeof data === 'string' &&
          !isNaN(Number(data)) &&
          (data.length === 3 || data.length === 0),
      ),
    comment: z.string().min(1),
  }),
  contactInformation: z.object({
    name: z.string().min(1),
    phoneNumber: z.string().min(1),
    email: z.string().min(1),
  }),
  applicant: applicantInformationSchema,
})

export type MachineAnswers = z.TypeOf<typeof MachineAnswersSchema>
