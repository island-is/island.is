import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Application } from '../application.model'
import {
  Application as BaseApplication,
  ApplicationTemplateHelper,
  ApplicationTypes,
  getApplicationTemplateByTypeId,
} from '@island.is/application/template'

@Injectable()
export class ApplicationSerializer
  implements NestInterceptor<Application, Promise<BaseApplication>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Promise<BaseApplication>> {
    // code here will be executed before the controller executes
    return next.handle().pipe(
      map(async (applicationModel: Application) => {
        const application = applicationModel.toJSON() as BaseApplication
        const template = await getApplicationTemplateByTypeId(
          application.typeId as ApplicationTypes,
        )

        return {
          ...application,
          ...new ApplicationTemplateHelper(
            application,
            template,
          ).getPermittedAnswersAndExternalData(
            application.state === 'inReview' ? 'reviewer' : 'applicant',
          ), // TODO how do we know the role
        }
      }),
    )
  }
}
