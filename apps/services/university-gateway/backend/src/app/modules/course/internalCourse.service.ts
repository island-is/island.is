import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Course } from './model'
import { University } from '../university/model'
import { ProgramCourse, ProgramMinor, ProgramTable } from '../program/model'
import { ReykjavikUniversityApplicationClient } from '@island.is/clients/university-application/reykjavik-university'
import { UniversityOfIcelandApplicationClient } from '@island.is/clients/university-application/university-of-iceland'
import {
  ICourse,
  UniversityNationalIds,
} from '@island.is/university-gateway-lib'
import { logger } from '@island.is/logging'
import { Op } from 'sequelize'

export
@Injectable()
class InternalCourseService {
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
    try {
      logger.info('Updating courses for Reykjavik University')
      await this.doUpdateCoursesForUniversity(
        UniversityNationalIds.REYKJAVIK_UNIVERSITY,
        (externalId: string) =>
          this.reykjavikUniversityClient.getCourses(externalId),
      )
    } catch (e) {
      logger.error(
        'Failed to update courses for Reykjavik University, reason:',
        e,
      )
    }

    // TODO need to perform for all Uglu universities
    try {
      logger.info('Updating courses for University of Iceland')
      await this.doUpdateCoursesForUniversity(
        UniversityNationalIds.UNIVERSITY_OF_ICELAND,
        (externalId: string) =>
          this.universityOfIcelandClient.getCourses(externalId),
      )
    } catch (e) {
      logger.error(
        'Failed to update courses for University of Iceland, reason:',
        e,
      )
    }
  }

  private async doUpdateCoursesForUniversity(
    universityNationalId: string,
    getCourses: (externalId: string) => Promise<ICourse[]>,
  ): Promise<void> {
    const universityId = (
      await this.universityModel.findOne({
        attributes: ['id'],
        where: { nationalId: universityNationalId },
        logging: false,
      })
    )?.id

    if (!universityId) {
      throw new Error(
        `University with national id ${universityNationalId} not found in DB`,
      )
    }

    // DELETE all programCourses for this university
    // Need to loop through courses first to select by universityId
    // since universityId is not in programCourse table
    const oldCourseList = await this.courseModel.findAll({
      attributes: ['id'],
      where: { universityId },
      logging: false,
    })
    await this.programCourseModel.destroy({
      where: { courseId: { [Op.in]: oldCourseList.map((c) => c.id) } },
      logging: false,
    })

    // DELETE all courses for this university
    await this.courseModel.destroy({
      where: { universityId },
      logging: false,
    })

    const programList = await this.programModel.findAll({
      attributes: ['id', 'externalId'],
      where: { universityId },
      logging: false,
    })
    for (let i = 0; i < programList.length; i++) {
      const program = programList[i]
      try {
        // DELETE program course
        // Note: should be unecessary since we have already deleted all by course
        await this.programCourseModel.destroy({
          where: { programId: program.id },
          logging: false,
        })

        const courseList = await getCourses(program.externalId)

        // CREATE/UPDATE course
        // CREATE program course
        for (let j = 0; j < courseList.length; j++) {
          const course = courseList[j]

          const programMinor = await this.programMinorModel.findOne({
            where: { externalId: course.minorExternalId },
          })

          try {
            // Map to courseModel object
            const courseObj = {
              externalId: course.externalId,
              nameIs: course.nameIs,
              nameEn: course.nameEn,
              universityId: universityId,
              credits: course.credits,
              descriptionIs: course.descriptionIs,
              descriptionEn: course.descriptionEn,
              externalUrlIs: course.externalUrlIs,
              externalUrlEn: course.externalUrlEn,
            }

            // In case this course has already been registered with another program
            // we should to check if we only need update (instead of inserting duplicate)
            const oldCourseObj = await this.courseModel.findOne({
              attributes: ['id'],
              where: { externalId: courseObj.externalId },
              logging: false,
            })

            // Create/update course, depending on whether course already existed (for other program)
            let courseId: string | undefined
            if (oldCourseObj) {
              courseId = oldCourseObj.id
              await this.courseModel.update(courseObj, {
                where: { id: courseId },
                logging: false,
              })
            } else {
              courseId = (
                await this.courseModel.create(courseObj, { logging: false })
              ).id
            }

            // Create entry in program course
            await this.programCourseModel.create(
              {
                programId: program.id,
                programMinorId: programMinor?.id,
                courseId: courseId,
                requirement: course.requirement,
                semesterYear: course.semesterYear,
                semesterSeason: course.semesterSeason,
              },
              { logging: false },
            )
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
    }
  }
}
