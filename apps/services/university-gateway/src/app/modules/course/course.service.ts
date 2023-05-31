import { Injectable } from '@nestjs/common'
import { CourseDetails, CourseDetailsResponse, CourseResponse } from './model'
import { uuid } from 'uuidv4'
import { PaginateInput, Season } from '../major/types'
import { CreateCourseDto, UpdateCourseDto } from './dto'

//TODOx connect with new university DB

@Injectable()
export class CourseService {
  async getCourses(
    { after, before, limit }: PaginateInput,
    majorId: string,
    universityId: string,
  ): Promise<CourseResponse> {
    return {
      data: [
        {
          id: uuid(),
          externalId: 'AB123',
          nameIs: 'Tölvunarfræði I',
          nameEn: 'Computer science I',
          universityId: universityId,
          majorId: majorId,
          credits: 8,
          semesterYear: 2024,
          semesterSeason: Season.FALL,
        },
      ],
      pageInfo: {
        hasPreviousPage: false,
        hasNextPage: true,
        startCursor: '',
        endCursor: '',
      },
      totalCount: 100,
    }
  }

  async getCourse(id: string): Promise<CourseDetailsResponse> {
    return {
      data: {
        id: uuid(),
        externalId: 'AB123',
        nameIs: 'Tölvunarfræði I',
        nameEn: 'Computer science I',
        universityId: uuid(),
        majorId: uuid(),
        credits: 8,
        semesterYear: 2024,
        semesterSeason: Season.FALL,
      },
    }
  }

  async createCourse(courseDto: CreateCourseDto): Promise<CourseDetails> {
    const updatedCourse = {
      id: uuid(),
      externalId: 'AB123',
      nameIs: 'Tölvunarfræði I',
      nameEn: 'Computer science I',
      universityId: uuid(),
      majorId: uuid(),
      credits: 8,
      semesterYear: 2024,
      semesterSeason: Season.FALL,
    }

    return updatedCourse
  }

  async updateCourse(
    id: string,
    courseDto: UpdateCourseDto,
  ): Promise<CourseDetails> {
    const updatedCourse = {
      id: id,
      externalId: 'AB123',
      nameIs: 'Tölvunarfræði I',
      nameEn: 'Computer science I',
      universityId: uuid(),
      majorId: uuid(),
      credits: 8,
      semesterYear: 2024,
      semesterSeason: Season.FALL,
    }

    return updatedCourse
  }

  async deleteCourse(id: string): Promise<number> {
    return 1
  }
}
