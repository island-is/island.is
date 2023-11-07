import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Course } from './model/course'
import { University } from '../university'
import { ProgramCourse, ProgramMinor, ProgramTable } from '../program'
import { ReykjavikUniversityApplicationClient } from '@island.is/clients/university-application/reykjavik-university'
import { UniversityOfIcelandApplicationClient } from '@island.is/clients/university-application/university-of-iceland'
import { ICourse, UniversityNationalIds } from '@island.is/university-gateway'
import { logger } from '@island.is/logging'
import { Op } from 'sequelize'

@Injectable()
export class InternalCourseService {
  constructor(
    private readonly reykjavikUniversityClient: ReykjavikUniversityApplicationClient,

    private readonly universityOfIcelandClient: UniversityOfIcelandApplicationClient,

    @InjectModel(University)
    private universityModel: typeof University,

    @InjectModel(Course)
    private courseModel: typeof Course,

    @InjectModel(ProgramTable)
    private programModel: typeof ProgramTable,

    @InjectModel(ProgramCourse)
    private programCourseModel: typeof ProgramCourse,

    @InjectModel(ProgramMinor)
    private programMinorModel: typeof ProgramMinor,
  ) {}

  async updateCourses(): Promise<void> {
    Promise.allSettled([
      await this.doUpdateCoursesForUniversity(
        UniversityNationalIds.REYKJAVIK_UNIVERSITY,
        (externalId: string) =>
          this.reykjavikUniversityClient.getCourses(externalId),
      ),
      await this.doUpdateCoursesForUniversity(
        UniversityNationalIds.UNIVERSITY_OF_ICELAND,
        (externalId: string) =>
          this.universityOfIcelandClient.getCourses(externalId),
      ),
    ]).catch((e) => {
      logger.error('Failed to update courses, reason:', e)
    })
  }

  private async doUpdateCoursesForUniversity(
    universityNationalId: string,
    getCourses: (externalId: string) => Promise<ICourse[]>,
  ): Promise<void> {
    const universityId = (
      await this.universityModel.findOne({
        attributes: ['id'],
        where: { nationalId: universityNationalId },
      })
    )?.id

    if (!universityId) {
      throw new Error(
        `University with national id ${universityNationalId} not found in DB`,
      )
    }

    logger.info(
      `Started updating courses for university ${universityNationalId}`,
    )

    // Keep list of courses that are active
    const activeCourseIdList: string[] = []

    const programList = await this.programModel.findAll({
      attributes: ['id', 'externalId'],
      where: { universityId },
    })
    for (let i = 0; i < programList.length; i++) {
      const program = programList[i]
      const programId = program.id

      try {
        // 1. Mark all program courses for this program as "temporarily inactive",
        // so we know in the end which courses (and program courses) should actually be deleted
        // This is done to make sure not all courses for the university are deleted
        // while we are updating the list of courses
        await this.programCourseModel.update(
          {
            tmpActive: false,
          },
          {
            where: { programId },
          },
        )

        const courseList = await getCourses(program.externalId)

        for (let j = 0; j < courseList.length; j++) {
          const course = courseList[j]

          let programMinor: ProgramMinor | null = null
          if (course.minorExternalId) {
            programMinor = await this.programMinorModel.findOne({
              where: { externalId: course.minorExternalId },
            })
          }

          try {
            // Map to courseModel object
            const courseObj = {
              universityId,
              externalId: course.externalId,
              nameIs: course.nameIs,
              nameEn: course.nameEn,
              credits: course.credits,
              descriptionIs: course.descriptionIs,
              descriptionEn: course.descriptionEn,
              externalUrlIs: course.externalUrlIs,
              externalUrlEn: course.externalUrlEn,
            }

            // 2. CREATE or UPDATE course
            let courseId: string | undefined
            const oldCourseObj = await this.courseModel.findOne({
              attributes: ['id'],
              where: { externalId: courseObj.externalId },
            })
            if (oldCourseObj) {
              courseId = oldCourseObj.id
              await this.courseModel.update(courseObj, {
                where: { id: courseId },
              })
            } else {
              courseId = (await this.courseModel.create(courseObj)).id
            }

            // Map to programCourseModel object
            const programCourseObj = {
              tmpActive: true,
              programId,
              programMinorId: programMinor?.id,
              courseId,
              requirement: course.requirement,
              semesterYear: course.semesterYear,
              semesterSeason: course.semesterSeason,
            }

            // 3. CREATE or UPDATE program course (make sure tmpActive becomes true)
            const oldProgramCourseObj = await this.programCourseModel.findOne({
              attributes: ['id'],
              where: {
                programId,
                courseId,
              },
            })
            if (oldProgramCourseObj) {
              await this.programCourseModel.update(programCourseObj, {
                where: { id: oldProgramCourseObj.id },
              })
            } else {
              await this.programCourseModel.create(programCourseObj)
            }

            activeCourseIdList.push(courseId)
          } catch (e) {
            logger.error(
              `Failed to update course with externalId ${course.externalId} for program with externalId ${program.externalId}, reason:`,
              e,
            )
          }
        }
      } catch (e) {
        logger.error(
          `Failed to update courses for program with externalId ${program.externalId}, reason:`,
          e,
        )
      }
      // 4. DELETE all program courses for this program that are "temporarily inactive"
      await this.programCourseModel.destroy({
        where: { programId, tmpActive: false },
      })
    }

    // 5. DELETE all courses for this university that are not being used
    await this.courseModel.destroy({
      where: {
        universityId,
        id: { [Op.notIn]: activeCourseIdList },
      },
    })

    logger.info(
      `Finished updating courses for university ${universityNationalId}`,
    )
  }
}
