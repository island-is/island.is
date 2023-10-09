import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Course, CourseDetailsResponse, CourseResponse } from './model'
import { PaginateInput } from '../program/types'
import { paginate } from '@island.is/nest/pagination'
import { ProgramCourse } from '../program/model'
import { Op } from 'sequelize'
import { logger } from '@island.is/logging'

export
@Injectable()
class CourseService {
  constructor(
    @InjectModel(Course)
    private courseModel: typeof Course,

    @InjectModel(ProgramCourse)
    private programCourseModel: typeof ProgramCourse,
  ) {}

  async getCourses(
    { after, before, limit }: PaginateInput,
    programId: string,
    programMinorId: string,
    universityId: string,
  ): Promise<CourseResponse> {
    const where: {
      id?: { [Op.in]: string[] }
      universityId?: string
    } = {}
    if (programId && !programMinorId) {
      const courseList = await this.programCourseModel.findAll({
        attributes: ['courseId'],
        where: { programId },
      })
      where.id = { [Op.in]: courseList.map((c) => c.courseId) }
    }
    if (programId && programMinorId) {
      const courseList = await this.programCourseModel.findAll({
        attributes: ['courseId'],
        where: { programId, programMinorId },
      })
      where.id = { [Op.in]: courseList.map((c) => c.courseId) }
    }
    if (universityId) where.universityId = universityId

    return await paginate({
      Model: this.courseModel,
      limit: limit,
      after: after,
      before: before,
      primaryKeyField: 'id',
      orderOption: [['id', 'ASC']],
      where: where,
    })
  }

  async getCourseDetails(id: string): Promise<CourseDetailsResponse> {
    const course = await this.courseModel.findOne({ where: { id: id } })

    if (!course) {
      const errorMsg = `Course with id ${id} found`
      logger.error(`Failed to get application, reason:`, errorMsg)
      throw new Error(errorMsg)
    }

    return { data: course }
  }
}
