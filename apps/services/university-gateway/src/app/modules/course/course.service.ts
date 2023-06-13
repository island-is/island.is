import { Injectable } from '@nestjs/common'
import { CourseDetailsResponse, CourseResponse } from './model'
import { PaginateInput } from '../major/types'

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
}
