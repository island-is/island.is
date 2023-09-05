import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Course } from './model'
import { Season } from '../program/types'
import { University } from '../university/model'
import { Program, ProgramCourse } from '../program/model'
import { Requirement } from './types'

@Injectable()
export class InternalCourseService {
  constructor(
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
    const universityNationalId = '6001692039' //TODO
    const universityId = (
      await this.universityModel.findOne({
        where: { nationalId: universityNationalId },
      })
    )?.id

    // DELETE all courses for this university
    await this.courseModel.destroy({ where: { universityId: universityId } })

    const programList = await this.programModel.findAll({
      where: { universityId: universityId },
    })
    for (let i = 0; i < programList.length; i++) {
      const programId = programList[i].id

      //TODO
      const courseList = [
        {
          externalId: 'AB123',
          nameIs: 'Test',
          nameEn: 'Test',
          credits: 8,
          semesterYear: 2023,
          semesterSeason: Season.FALL,
          descriptionIs: '',
          descriptionEn: '',
          externalUrlIs: '',
          externalUrlEn: '',
        },
      ]

      // DELETE program course
      await this.programCourseModel.destroy({
        where: { programId: programId },
      })

      // CREATE/UPDATE course
      // CREATE program course
      for (let j = 0; j < courseList.length; j++) {
        // course
        const courseObj = {
          externalId: courseList[j].externalId,
          nameIs: courseList[j].nameIs,
          nameEn: courseList[j].nameEn,
          universityId: universityId,
          credits: courseList[j].credits,
          semesterYear: courseList[j].semesterYear,
          semesterSeason: courseList[j].semesterSeason,
          descriptionIs: courseList[j].descriptionIs,
          descriptionEn: courseList[j].descriptionEn,
          externalUrlIs: courseList[j].externalUrlIs,
          externalUrlEn: courseList[j].externalUrlEn,
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
          requirement: Requirement.MANDATORY, //TODO
        })
      }
    }
  }
}
