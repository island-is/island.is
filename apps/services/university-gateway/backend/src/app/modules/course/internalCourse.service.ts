import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Course } from './model'
import { University } from '../university/model'
import { Program, ProgramCourse } from '../program/model'
import { UniversityGatewayReykjavikUniversityClient } from '@island.is/clients/university-gateway/reykjavik-university'
import { UniversityGatewayUniversityOfIcelandClient } from '@island.is/clients/university-gateway/university-of-iceland'
import {
  Course as ICourse,
  Requirement,
  UniversityNationalIds,
} from '@island.is/university-gateway-types'

@Injectable()
export class InternalCourseService {
  constructor(
    private readonly reykjavikUniversityClient: UniversityGatewayReykjavikUniversityClient,

    private readonly universityOfIcelandClient: UniversityGatewayUniversityOfIcelandClient,

    @InjectModel(University)
    private universityModel: typeof University,

    @InjectModel(Course)
    private courseModel: typeof Course,

    @InjectModel(Program)
    private programModel: typeof Program,

    @InjectModel(ProgramCourse)
    private programCourseModel: typeof ProgramCourse,
  ) {}

  async updateCourses(): Promise<void> {
    await this.doUpdateCoursesForUniversity(
      UniversityNationalIds.REYKJAVIK_UNIVERSITY,
      (externalId: string) =>
        this.reykjavikUniversityClient.getCourses(externalId),
    )

    await this.doUpdateCoursesForUniversity(
      UniversityNationalIds.UNIVERSITY_OF_ICELAND,
      (externalId: string) =>
        this.universityOfIcelandClient.getCourses(externalId),
    )
  }

  private async doUpdateCoursesForUniversity(
    universityNationalId: string,
    getCourses: (externalId: string) => Promise<ICourse[]>,
  ): Promise<void> {
    const universityId = (
      await this.universityModel.findOne({
        where: { nationalId: universityNationalId },
      })
    )?.id

    if (!universityId) {
      throw new Error('University not found in DB')
    }

    // DELETE all programCourses for this university
    // Need to loop through courses first to select by universityId
    const oldCourseList = await this.courseModel.findAll({
      where: { universityId: universityId },
    })
    for (let i = 0; i < oldCourseList.length; i++) {
      await this.programCourseModel.destroy({
        where: { courseId: oldCourseList[i].id },
      })
    }

    // DELETE all courses for this university
    await this.courseModel.destroy({ where: { universityId: universityId } })

    const programList = await this.programModel.findAll({
      where: { universityId },
    })
    for (let i = 0; i < programList.length; i++) {
      const programId = programList[i].id
      const programExternalId = programList[i].externalId

      // DELETE program course
      await this.programCourseModel.destroy({
        where: { programId: programId },
      })

      const courseList = await getCourses(programExternalId)

      // CREATE/UPDATE course
      // CREATE program course
      for (let j = 0; j < courseList.length; j++) {
        const course = courseList[j]

        // Map to courseModel object
        const courseObj = {
          externalId: course.externalId,
          nameIs: course.nameIs,
          nameEn: course.nameEn,
          universityId: universityId,
          credits: course.credits,
          semesterYear: course.semesterYear,
          semesterSeason: course.semesterSeason,
          descriptionIs: course.descriptionIs,
          descriptionEn: course.descriptionEn,
          externalUrlIs: course.externalUrlIs,
          externalUrlEn: course.externalUrlEn,
        }

        const oldCourseObj = await this.courseModel.findOne({
          where: { externalId: courseObj.externalId },
        })

        let courseId: string | undefined
        if (oldCourseObj) {
          courseId = oldCourseObj.id
          await this.courseModel.update(courseObj, {
            where: { id: courseId },
          })
        } else {
          courseId = (await this.courseModel.create(courseObj)).id
        }

        // program course
        await this.programCourseModel.create({
          programId: programId,
          courseId: courseId,
          requirement: course.requirement,
        })
      }
    }
  }
}
