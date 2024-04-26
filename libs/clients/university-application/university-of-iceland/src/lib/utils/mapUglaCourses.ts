import {
  CourseSeason,
  ICourse,
  Requirement,
  mapStringToEnum,
} from '@island.is/university-gateway'
import { InlineResponse2003 } from '../../../gen/fetch'

export const mapUglaCourses = (
  res: InlineResponse2003,
  logError: (courseExternalId: string, error: Error) => void,
): ICourse[] => {
  const mappedRes = []
  const courseList = res.data || []
  for (let i = 0; i < courseList.length; i++) {
    const course = courseList[i]
    try {
      let requirement: Requirement | undefined = undefined
      switch (course.required) {
        case 'MANDATORY':
          requirement = Requirement.MANDATORY
          break
        case 'ELECTIVE':
          requirement = Requirement.FREE_ELECTIVE
          break
        case 'RESTRICTED_ELECTIVE':
          requirement = Requirement.RESTRICTED_ELECTIVE
          break
      }
      if (requirement === undefined) {
        throw new Error(`Not able to map requirement: ${course.required}`)
      }

      const semesterSeason = mapStringToEnum(
        course.semesterSeason?.toString(),
        CourseSeason,
      )
      if (!semesterSeason) {
        throw new Error(
          `Not able to map semester season: ${course.semesterSeason?.toString()}`,
        )
      }

      // Note: these fields are all array since we get "bundin skylda" as
      // as array of courses. We will display them on out side are separate
      // disconnected courses
      const externalIdList = course.externalId || []
      const nameIsList = course.nameIs || []
      const nameEnList = course.nameEn || []
      const descriptionIsList = course.descriptionIs || []
      const descriptionEnList = course.descriptionEn || []
      const externalUrlIsList = course.externalUrlIs || []
      const externalUrlEnList = course.externalUrlEn || []

      // If more than one item in the array, then this is a "bundin skylda".
      // We need to set the requirement as RESTRICTED_ELECTIVE ("bundið val"),
      // since there is not a requirement type for RESTRICTED_MANDATORY
      if (externalIdList.length > 1) {
        requirement = Requirement.RESTRICTED_ELECTIVE
      }

      for (let i = 0; i < externalIdList.length; i++) {
        mappedRes.push({
          externalId: externalIdList[i],
          nameIs: nameIsList[i],
          nameEn: nameEnList[i],
          credits: Number(course.credits?.replace(',', '.')) || 0,
          descriptionIs: descriptionIsList[i],
          descriptionEn: descriptionEnList[i],
          externalUrlIs: externalUrlIsList[i],
          externalUrlEn: externalUrlEnList[i],
          requirement: requirement,
          semesterYear: Number(course.semesterYear),
          semesterSeason: semesterSeason,
        })
      }
    } catch (e) {
      logError(course.externalId?.toString() || '', e)
    }
  }

  return mappedRes
}
