import { YesOrNoEnum } from '@island.is/application/core'
import { z } from 'zod'
import { serviceErrors } from '../messages'

export const jobWishesSchema = z
  .object({
    jobList: z.array(z.string()).refine((v) => v.length >= 2, {
      params: serviceErrors.minimumJobCount,
    }),
    outsideYourLocation: z
      .nativeEnum(YesOrNoEnum)
      .refine((v) => Object.values(YesOrNoEnum).includes(v)),
    location: z.array(z.string()).optional(),
    wantedJobPercentage: z.string().min(1),
    jobTimelineStartDate: z.string().min(1),
  })
  .refine(
    ({ outsideYourLocation, location }) => {
      if (outsideYourLocation === YesOrNoEnum.YES) {
        return location && location.length > 0
      }
      return true
    },
    {
      path: ['location'],
    },
  )
