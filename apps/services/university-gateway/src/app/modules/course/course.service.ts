import { Injectable } from '@nestjs/common'
import { CourseDetailsResponse, CourseResponse } from './model'
import { PaginateInput } from '../program/types'

//TODOx connect with new university DB

@Injectable()
export class CourseService {
  async getCourses(
    { after, before, limit }: PaginateInput,
    programId: string,
    universityId: string,
  ): Promise<CourseResponse> {
    throw Error('Not ready')
  }

  async getCourseDetails(id: string): Promise<CourseDetailsResponse> {
    throw Error('Not ready')
  }
}
