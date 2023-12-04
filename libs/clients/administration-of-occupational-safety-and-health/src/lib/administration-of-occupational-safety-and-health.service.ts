import { Injectable } from '@nestjs/common'
import { NamskeidApi } from '../../gen/fetch'

@Injectable()
export class AdministrationOfOccupationalSafetyAndHealthClientService {
  constructor(private readonly courseApi: NamskeidApi) {}

  async getCourses() {
    const courses = await this.courseApi.apiNamskeidGet()
    return courses.map((course) => ({
      id: course.namskeidID,
      name: course.nafn,
      dateFrom: course.dagsFra,
      dateTo: course.dagsTil,
      time: course.timi,
      location: course.stadsetning,
      price: course.verd,
      registrationUrl: course.skraningarslod,
      status: course.stada,
      category: course.flokkur,
      subCategory: course.undirflokkur,
      description: course.lysingAVef,
      alwaysOpen: course.alltafOpid,
    }))
  }
}
