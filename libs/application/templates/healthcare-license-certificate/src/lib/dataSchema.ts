import { z } from 'zod'

const UserInformationSchema = z.object({
  email: z.string().min(1),
  phone: z.string().min(1),
})

const SelectLicenseSchema = z.object({
  professionIds: z.array(z.string().min(1)).nonempty(),
})

export const HealthcareLicenseCertificateSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  userInformation: UserInformationSchema,
  selectLicence: SelectLicenseSchema,
})

export type HealthcareLicenseCertificate = z.TypeOf<
  typeof HealthcareLicenseCertificateSchema
>
