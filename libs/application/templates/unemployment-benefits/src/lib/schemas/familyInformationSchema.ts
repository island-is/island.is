import { z } from 'zod'
import * as kennitala from 'kennitala'
import { applicant } from '../messages'

export const familyInformationSchema = z.object({
  children: z.array(
    z.object({
      name: z.string().min(1),
      nationalId: z
        .string()
        .refine((nationalId) => nationalId && nationalId.length !== 0),
    }),
  ),
  additionalChildren: z
    .array(
      z.object({
        child: z
          .object({
            name: z.string().optional(),
            nationalId: z
              .string()
              .refine(
                (nationalId) =>
                  nationalId && kennitala.info(nationalId).age < 18,
                {
                  params:
                    applicant.familyInformation.moreThanEighteenErrorMessage,
                },
              )
              .optional(),
          })
          .optional(),
      }),
    )
    .optional(),
})
