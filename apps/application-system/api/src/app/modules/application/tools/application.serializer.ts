import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common'
import { classToPlain, plainToClass } from 'class-transformer'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Application } from '../application.model'
import {
  Application as BaseApplication,
  ApplicationTemplateHelper,
  ApplicationTypes,
  ApplicationStateMeta,
} from '@island.is/application/core'
import { getApplicationTemplateByTypeId } from '@island.is/application/template-loader'
import { ApplicationResponseDto } from '../dto/application.response.dto'

const role = 'applicant' // TODO get real role

@Injectable()
export class ApplicationSerializer
  implements NestInterceptor<Application, Promise<any>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Promise<any>> {
    // code here will be executed before the controller executes
    return next.handle().pipe(
      map(async (res: Application | Array<Application>) => {
        const isArray = Array.isArray(res)

        return isArray
          ? Promise.all(
              (res as Application[]).map((item) => this.serialize(item)),
            )
          : this.serialize(res as Application)
      }),
    )
  }

  async serialize(model: Application) {
    const application = model.toJSON() as BaseApplication
    const template = await getApplicationTemplateByTypeId(
      application.typeId as ApplicationTypes,
    )
    const helper = new ApplicationTemplateHelper(application, template)

    const dto = plainToClass(ApplicationResponseDto, {
      ...application,
      ...helper.getPermittedAnswersAndExternalData(role),
      name: template.name,
      progress: helper.getApplicationProgress(),
    })

    return classToPlain(dto)
  }
}
