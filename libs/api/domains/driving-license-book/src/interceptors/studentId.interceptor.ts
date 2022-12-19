import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { DrivingLicenseBookStudentForTeacher } from '../models/studentsTeacherNationalId.response'

@Injectable()
export class StudentIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const prefix = context.getHandler().name
    const prefixId = (id: string): string => `${prefix}-${id}`
    return next.handle().pipe(
      map(
        (
          res:
            | DrivingLicenseBookStudentForTeacher
            | Array<DrivingLicenseBookStudentForTeacher>,
        ) => {
          const isArray = Array.isArray(res)
          if (isArray) {
            return res?.map((student) => {
              student.id = prefixId(student.id)

              return student
            })
          }
          res.id = prefixId(res.id)
          return res
        },
      ),
    )
  }
}
