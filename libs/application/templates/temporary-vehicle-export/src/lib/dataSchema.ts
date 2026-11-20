import { z } from 'zod'
import { NO, YES } from '@island.is/application/core'
import { m } from './messages'
import {
  isNotBeforeDaysAgo,
  isTodayOrEarlier,
  parseMileage,
  toDate,
  usesLatestMileage,
  usesLatestMileageDate,
} from '../utils/helpers'
import { MAX_DAYS_BACK, PROOF_OF_TRAVEL_MAX_FILES } from '../utils/constants'

const fileSchema = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string().optional(),
})

const pastOrPresentDate = z
  .string()
  .refine(isTodayOrEarlier, { params: m.errors.dateInFuture })

const arrivalDate = pastOrPresentDate.refine(
  (value) => isNotBeforeDaysAgo(value, MAX_DAYS_BACK),
  { params: m.errors.arrivalDateTooEarly },
)

const mileage = z.string().refine((value) => (parseMileage(value) ?? 0) > 0, {
  params: m.errors.mileageInvalid,
})

const departureSchema = z
  .object({
    // Not asked when the latest reading, and so its date, is used. Checked
    // below only when it is used, since a date saved before the applicant
    // chose the latest reading stays in the answers.
    date: z.string().optional(),
    // Only asked when the vehicle has a registered mileage
    useLatestMileage: z.enum([YES, NO]).optional(),
    mileage: z.string().optional(),
    // Latest reading at Samgöngustofa, filled in from external data
    latestMileage: z.string().optional(),
    latestMileageReadDate: z.string().optional(),
  })
  .superRefine((departure, ctx) => {
    const { date, mileage, latestMileage } = departure
    if (!usesLatestMileageDate({ departure })) {
      const dateError = !date
        ? m.errors.departureDateRequired
        : !isTodayOrEarlier(date)
        ? m.errors.dateInFuture
        : !isNotBeforeDaysAgo(date, MAX_DAYS_BACK)
        ? m.errors.departureDateTooEarly
        : undefined
      if (dateError) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          params: dateError,
          path: ['date'],
        })
      }
    }

    // The latest reading is then the departure mileage
    if (usesLatestMileage({ departure })) {
      return
    }

    const latest = parseMileage(latestMileage)

    const current = parseMileage(mileage)
    if (!current) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        params: m.errors.mileageInvalid,
        path: ['mileage'],
      })
      return
    }
    if (latest !== undefined && current < latest) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        params: m.errors.mileageLowerThanLatest,
        path: ['mileage'],
      })
    }
  })

const arrivalSchema = z
  .object({
    date: arrivalDate,
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
  proofOfTravel: z.array(fileSchema).min(1).max(PROOF_OF_TRAVEL_MAX_FILES),
})

export type ApplicationAnswers = z.TypeOf<typeof dataSchema>
