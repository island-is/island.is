import * as z from 'zod'
import { NO } from '../shared'
import { error } from './messages/error'

export const DataProtectionComplaintSchema = z.object({
  delimitation: z.object({
    inCourtProceedings: z.string().refine((p) => p === NO, {
      message: error.inCourtProceedings.defaultMessage,
    }),
    concernsMediaCoverage: z.string().refine((p) => p === NO, {
      message: error.concernsMediaCoverage.defaultMessage,
    }),
    concernsBanMarking: z.string().refine((p) => p === NO, {
      message: error.concernsBanMarking.defaultMessage,
    }),
    concernsLibel: z.string().refine((p) => p === NO, {
      message: error.concernsLibel.defaultMessage,
    }),
    concernsPersonalLettersOrSocialMedia: z.string().refine((p) => p === NO, {
      message: error.concernsPersonalLettersOrSocialMedia.defaultMessage,
    }),
  }),
})
