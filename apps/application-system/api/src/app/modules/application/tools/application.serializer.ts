import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { classToPlain, plainToClass } from 'class-transformer'
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs'
import { Application } from '../application.model'
import {
  Application as BaseApplication,
  ApplicationTemplateHelper,
  ApplicationTypes,
} from '@island.is/application/core'
import { getApplicationTemplateByTypeId } from '@island.is/application/template-loader'
import { ApplicationResponseDto } from '../dto/application.response.dto'
import { getCurrentUser } from '@island.is/auth-nest-tools'

@Injectable()
export class ApplicationSerializer
  implements NestInterceptor<Application, Promise<unknown>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Promise<unknown>> {
    const user = getCurrentUser(context)

    return next.handle().pipe(
      map(async (res: Application | Array<Application>) => {
        const isArray = Array.isArray(res)

        if (isArray) {
          return Promise.all(
            (res as Application[]).map((item) =>
              this.serialize(item, user.nationalId),
            ),
          )
        }

        return this.serialize(res as Application, user.nationalId)
      }),
    )
  }

  async serialize(model: Application, nationalId: string) {
    const application = model.toJSON() as BaseApplication
    const template = await getApplicationTemplateByTypeId(
      application.typeId as ApplicationTypes,
    )
    const helper = new ApplicationTemplateHelper(application, template)

    const dto = plainToClass(ApplicationResponseDto, {
      ...application,
      ...helper.getReadableAnswersAndExternalData(
        template.mapUserToRole(nationalId, application) ?? '',
      ),
      name: template.name,
      progress: helper.getApplicationProgress(),
    })

    return classToPlain(dto)
  }
}
