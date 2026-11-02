import { z } from 'zod'
import { m } from './messages'
import { isTodayOrEarlier, parseMileage, toDate } from '../utils/helpers'

const fileSchema = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string().optional(),
})

const pastOrPresentDate = z
  .string()
  .refine(isTodayOrEarlier, { params: m.errors.dateInFuture })

const mileage = z.string().refine((value) => (parseMileage(value) ?? 0) > 0, {
  params: m.errors.mileageInvalid,
})

const departureSchema = z
  .object({
    date: pastOrPresentDate,
    mileage,
    // Latest reading at Samgöngustofa, filled in from external data
    latestMileage: z.string().optional(),
  })
  .superRefine(({ mileage, latestMileage }, ctx) => {
    const latest = parseMileage(latestMileage)
    const current = parseMileage(mileage)
    if (latest !== undefined && current !== undefined && current < latest) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        params: m.errors.mileageLowerThanLatest,
        path: ['mileage'],
      })
    }
  })

const arrivalSchema = z
  .object({
    date: pastOrPresentDate,
    mileage,
    // Copied from the departure answers so they can be compared here
    departureDate: z.string().optional(),
    departureMileage: z.string().optional(),
  })
  .superRefine(({ date, mileage, departureDate, departureMileage }, ctx) => {
    const arrival = toDate(date)
    const departure = toDate(departureDate)
    if (arrival && departure && arrival < departure) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        params: m.errors.arrivalBeforeDeparture,
        path: ['date'],
      })
    }

    const arrivalKm = parseMileage(mileage)
    const departureKm = parseMileage(departureMileage)
    if (
      arrivalKm !== undefined &&
      departureKm !== undefined &&
      arrivalKm < departureKm
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        params: m.errors.mileageLowerThanDeparture,
        path: ['mileage'],
      })
    }
  })

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  vehicle: z.object({
    permno: z.string().min(1),
  }),
  departure: departureSchema,
  arrival: arrivalSchema,
  proofOfTravel: z.array(fileSchema).min(1),
})

export type ApplicationAnswers = z.TypeOf<typeof dataSchema>
