import { Injectable } from '@nestjs/common'
import { CourseDetails, CourseDetailsResponse, CourseResponse } from './model'
import { PaginateInput } from '../major/types'
import { CreateCourseDto, UpdateCourseDto } from './dto'

//TODOx connect with new university DB

@Injectable()
export class CourseService {
  async getCourses(
    { after, before, limit }: PaginateInput,
    majorId: string,
    universityId: string,
  ): Promise<CourseResponse> {
    throw Error('Not ready')
  }

  async getCourseDetails(id: string): Promise<CourseDetailsResponse> {
    throw Error('Not ready')
  }

  async createCourse(courseDto: CreateCourseDto): Promise<CourseDetails> {
    throw Error('Not ready')
  }

  async updateCourse(
    id: string,
    courseDto: UpdateCourseDto,
  ): Promise<CourseDetails> {
    throw Error('Not ready')
  }

  async deleteCourse(id: string): Promise<number> {
    throw Error('Not ready')
  }
}
