import { NO, YES, YesOrNoEnum } from '@island.is/application/core'
import { z } from 'zod'
import { EducationType } from '../../shared'
import { FileSchema } from './fileSchema'

export const educationSchema = z
  .object({
    lastTwelveMonths: z
      .nativeEnum(YesOrNoEnum)
      .refine((v) => Object.values(YesOrNoEnum).includes(v)),
    typeOfEducation: z.nativeEnum(EducationType).optional(),
    didFinishLastSemester: z.nativeEnum(YesOrNoEnum).optional(),
    appliedForNextSemester: z.nativeEnum(YesOrNoEnum).optional(),
    currentEducation: z
      .object({
        levelOfStudy: z
          .preprocess((val) => {
            if (!val) {
              return ''
            }
            return val
          }, z.string())
          .optional(),
        programUnits: z.string().optional(),
        programDegree: z.string().optional(),
        programEnd: z.string().optional(),
        courseOfStudy: z.string().optional(),
        degreeFile: z.array(FileSchema).optional(),
      })
      .optional(),
    notAppliedForNextSemesterExplanation: z.string().optional(),
  })
  .refine(
    ({ lastTwelveMonths, typeOfEducation }) => {
      if (lastTwelveMonths === YES) {
        return typeOfEducation !== undefined
      }
      return true
    },
    {
      path: ['typeOfEducation'],
    },
  )
  .refine(
    ({ didFinishLastSemester, typeOfEducation }) => {
      if (typeOfEducation === EducationType.LAST_SEMESTER) {
        return didFinishLastSemester !== undefined
      }
      return true
    },
    {
      path: ['didFinishLastSemester'],
    },
  )
  .refine(
    ({ didFinishLastSemester, appliedForNextSemester }) => {
      if (didFinishLastSemester === YesOrNoEnum.NO) {
        return appliedForNextSemester !== undefined
      }
      return true
    },
    {
      path: ['appliedForNextSemester'],
    },
  )
  .refine(
    ({
      lastTwelveMonths,
      typeOfEducation,
      didFinishLastSemester,
      appliedForNextSemester,
      currentEducation,
    }) => {
      if (
        lastTwelveMonths === YES &&
        (typeOfEducation === EducationType.CURRENT ||
          (typeOfEducation === EducationType.LAST_SEMESTER &&
            (didFinishLastSemester === YES ||
              (didFinishLastSemester === NO &&
                appliedForNextSemester !== NO))) ||
          typeOfEducation === EducationType.LAST_YEAR)
      ) {
        return currentEducation && currentEducation.levelOfStudy
      }
      return true
    },
    {
      path: ['currentEducation', 'levelOfStudy'],
    },
  )
  .refine(
    ({
      lastTwelveMonths,
      typeOfEducation,
      didFinishLastSemester,
      appliedForNextSemester,
      currentEducation,
    }) => {
      if (
        lastTwelveMonths === YES &&
        (typeOfEducation === EducationType.CURRENT ||
          (typeOfEducation === EducationType.LAST_SEMESTER &&
            (didFinishLastSemester === YES ||
              (didFinishLastSemester === NO &&
                appliedForNextSemester !== NO))) ||
          typeOfEducation === EducationType.LAST_YEAR)
      ) {
        return currentEducation && currentEducation.courseOfStudy
      }
      return true
    },
    {
      path: ['currentEducation', 'courseOfStudy'],
    },
  )
  .refine(
    ({
      lastTwelveMonths,
      typeOfEducation,
      didFinishLastSemester,
      appliedForNextSemester,
      currentEducation,
    }) => {
      if (
        lastTwelveMonths === YES &&
        (typeOfEducation === EducationType.CURRENT ||
          (typeOfEducation === EducationType.LAST_SEMESTER &&
            (didFinishLastSemester === YES ||
              (didFinishLastSemester === NO &&
                appliedForNextSemester !== NO))) ||
          typeOfEducation === EducationType.LAST_YEAR)
      ) {
        return currentEducation && currentEducation.programUnits
      }
      return true
    },
    {
      path: ['currentEducation', 'programUnits'],
    },
  )
  .refine(
    ({
      lastTwelveMonths,
      typeOfEducation,
      didFinishLastSemester,
      appliedForNextSemester,
      currentEducation,
    }) => {
      if (
        lastTwelveMonths === YES &&
        (typeOfEducation === EducationType.CURRENT ||
          (typeOfEducation === EducationType.LAST_SEMESTER &&
            (didFinishLastSemester === YES ||
              (didFinishLastSemester === NO &&
                appliedForNextSemester !== NO))) ||
          typeOfEducation === EducationType.LAST_YEAR)
      ) {
        return currentEducation && currentEducation.programDegree
      }
      return true
    },
    {
      path: ['currentEducation', 'programDegree'],
    },
  )
  .refine(
    ({
      lastTwelveMonths,
      typeOfEducation,
      didFinishLastSemester,
      appliedForNextSemester,
      currentEducation,
    }) => {
      if (
        lastTwelveMonths === YES &&
        (typeOfEducation === EducationType.CURRENT ||
          (typeOfEducation === EducationType.LAST_SEMESTER &&
            (didFinishLastSemester === YES ||
              (didFinishLastSemester === NO &&
                appliedForNextSemester !== NO))) ||
          typeOfEducation === EducationType.LAST_YEAR)
      ) {
        return currentEducation && currentEducation.programEnd
      }
      return true
    },
    {
      path: ['currentEducation', 'programEnd'],
    },
  )
  .refine(
    ({
      lastTwelveMonths,
      typeOfEducation,
      didFinishLastSemester,
      appliedForNextSemester,
      currentEducation,
    }) => {
      if (
        lastTwelveMonths === YES &&
        (typeOfEducation === EducationType.CURRENT ||
          (typeOfEducation === EducationType.LAST_SEMESTER &&
            (didFinishLastSemester === YES ||
              (didFinishLastSemester === NO &&
                appliedForNextSemester !== NO))) ||
          typeOfEducation === EducationType.LAST_YEAR)
      ) {
        return (
          currentEducation &&
          currentEducation.degreeFile &&
          currentEducation.degreeFile.length > 0
        )
      }
      return true
    },
    {
      path: ['currentEducation', 'degreeFile'],
    },
  )
  .refine(
    ({
      lastTwelveMonths,
      typeOfEducation,
      didFinishLastSemester,
      appliedForNextSemester,
      notAppliedForNextSemesterExplanation,
    }) => {
      if (
        lastTwelveMonths === YES &&
        typeOfEducation === EducationType.LAST_SEMESTER &&
        didFinishLastSemester === NO &&
        appliedForNextSemester === NO
      ) {
        return notAppliedForNextSemesterExplanation
      }
      return true
    },
    {
      path: ['notAppliedForNextSemesterExplanation'],
    },
  )
