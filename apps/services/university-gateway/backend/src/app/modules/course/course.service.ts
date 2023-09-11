import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Course, CourseDetailsResponse, CourseResponse } from './model'
import { PaginateInput } from '../program/types'
import { paginate } from '@island.is/nest/pagination'

export
@Injectable()
class CourseService {
  constructor(
    @InjectModel(Course)
    private courseModel: typeof Course,
  ) {}

  async getCourses(
    { after, before, limit }: PaginateInput,
    programId: string,
    universityId: string,
  ): Promise<CourseResponse> {
    const where: {
      programId?: string
      universityId?: string
    } = {}
    if (programId !== undefined) where.programId = programId
    if (universityId !== undefined) where.universityId = universityId

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
      throw Error('Not found')
    }

    return { data: course }
  }
}
