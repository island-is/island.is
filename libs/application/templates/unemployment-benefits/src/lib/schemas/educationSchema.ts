import { YES, YesOrNoEnum } from '@island.is/application/core'
import { z } from 'zod'
import { EducationType } from '../../shared'

export const educationSchema = z
  .object({
    lastTwelveMonths: z
      .nativeEnum(YesOrNoEnum)
      .refine((v) => Object.values(YesOrNoEnum).includes(v)),
    typeOfEducation: z.array(z.string()).optional(),
    appliedForNextSemester: z.preprocess(
      (val) => (val === '' ? undefined : val),
      z.nativeEnum(YesOrNoEnum).optional(),
    ),
  })
  .refine(
    ({ lastTwelveMonths, typeOfEducation }) => {
      if (lastTwelveMonths === YES) {
        return typeOfEducation && typeOfEducation.length > 0
      }
      return true
    },
    {
      path: ['typeOfEducation'],
    },
  )
  .refine(
    ({ typeOfEducation, appliedForNextSemester }) => {
      if (
        typeOfEducation?.includes(
          EducationType.LAST_SEMESTER ||
            typeOfEducation?.includes(EducationType.CURRENT),
        )
      ) {
        return appliedForNextSemester !== undefined
      }
      return true
    },
    {
      path: ['appliedForNextSemester'],
    },
  )
