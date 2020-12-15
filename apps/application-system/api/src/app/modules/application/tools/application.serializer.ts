import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { classToPlain, plainToClass } from 'class-transformer'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Application } from '../application.model'
import {
  Application as BaseApplication,
  ApplicationTemplateHelper,
  ApplicationTypes,
} from '@island.is/application/core'
import { getApplicationTemplateByTypeId } from '@island.is/application/template-loader'
import { ApplicationResponseDto } from '../dto/application.response.dto'
import { getNationalIdFromToken } from '../utils/tokenUtils'

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
        const nationalId = getNationalIdFromToken(context)
        return isArray
          ? Promise.all(
              (res as Application[]).map((item) =>
                this.serialize(item, nationalId),
              ),
            )
          : this.serialize(res as Application, nationalId)
      }),
    )
  }

  async serialize(model: Application, nationalId = '') {
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
