import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Course } from './model/course'
import { ProgramCourse } from '../program'
import { paginate } from '@island.is/nest/pagination'
import { Op } from 'sequelize'
import { NoContentException } from '@island.is/nest/problem'
import { CourseResponse } from './dto/courseResponse'
import { CourseDetailsResponse } from './dto/courseDetailsResponse'

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course)
    private courseModel: typeof Course,

    @InjectModel(ProgramCourse)
    private programCourseModel: typeof ProgramCourse,
  ) {}

  async getCourses(
    limit: number,
    after: string,
    before?: string,
    programId?: string,
    universityId?: string,
  ): Promise<CourseResponse> {
    const where: {
      id?: { [Op.in]: string[] }
      universityId?: string
    } = {}
    if (programId !== undefined) {
      const courseList = await this.programCourseModel.findAll({
        attributes: ['courseId'],
        where: { programId },
      })
      where.id = { [Op.in]: courseList.map((c) => c.courseId) }
    }
    if (universityId !== undefined) where.universityId = universityId

    return paginate({
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
    const course = await this.courseModel.findByPk(id)

    if (!course) {
      throw new NoContentException()
    }

    return { data: course }
  }
}
