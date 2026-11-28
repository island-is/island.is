import { NO, YES } from '@island.is/application/core'
import { z } from 'zod'
import { errorMessages } from './messages'

const waitingListSchema = z
  .object({
    consent: z.enum([YES, NO]),
    declineReason: z.string().nullish(),
  })
  .refine(({ consent, declineReason }) => consent === YES || !!declineReason, {
    path: ['declineReason'],
  })

const otherInformationSchema = z
  .object({
    languages: z
      .array(z.object({ language: z.string().nullish() }))
      .refine((languages) => languages.some(({ language }) => !!language), {
        params: errorMessages.languageRequired,
        path: [0, 'language'],
      }),
    locations: z
      .array(z.object({ location: z.string().nullish() }))
      .refine((locations) => locations.some(({ location }) => !!location), {
        params: errorMessages.locationRequired,
        path: [0, 'location'],
      }),
    chosenSpeechPathologist: z.string().nullish(),
    speechTherapistConfirmation: z.array(z.string()).nullish(),
  })
  .refine(
    ({ chosenSpeechPathologist, speechTherapistConfirmation }) =>
      !chosenSpeechPathologist || !!speechTherapistConfirmation?.includes(YES),
    {
      params: errorMessages.speechTherapistConfirmationRequired,
      path: ['speechTherapistConfirmation'],
    },
  )

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  childNationalId: z.string().min(1),
  waitingList: waitingListSchema,
  otherInformation: otherInformationSchema,
  confirmCorrectInfo: z.array(z.enum([YES])).length(1),
})

export type ApplicationAnswers = z.TypeOf<typeof dataSchema>
