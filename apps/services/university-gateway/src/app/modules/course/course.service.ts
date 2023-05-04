import { Injectable } from '@nestjs/common'
import { Course } from './course.model'
import { uuid } from 'uuidv4'

//TODOx connect with new university DB
@Injectable()
export class CourseService {
  async getCourses(majorId: string, universityId: string): Promise<Course[]> {
    return [
      {
        id: uuid(),
        name: 'Tölvunarfræði I',
        credits: 8,
        majorId: majorId,
        majorName: 'Tölvunarfræði',
        universityId: universityId,
        universityName: 'Háskóli Íslands',
      },
      {
        id: uuid(),
        name: 'Línulega Algebra',
        credits: 6,
        majorId: majorId,
        majorName: 'Hugbúnaðarverkfræði',
        universityId: universityId,
        universityName: 'Háskóli Íslands',
      },
    ]
  }

  async getCourse(id: string): Promise<Course> {
    return {
      id: id,
      name: 'Tölvunarfræði I',
      credits: 8,
      majorId: uuid(),
      majorName: 'Tölvunarfræði',
      universityId: uuid(),
      universityName: 'Háskóli Íslands',
    }
  }
}
