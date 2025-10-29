import { YesOrNoEnum } from '@island.is/application/core'
import { z } from 'zod'

export const jobWishesSchema = z
  .object({
    jobList: z.array(z.string()).min(2),
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
