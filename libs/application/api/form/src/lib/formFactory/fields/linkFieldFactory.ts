import { LinkField } from '@island.is/application/types'
import { FieldDto } from '../../dto/form.dto'
import { IFieldFactory } from './IFormFieldFactory'
import { Injectable } from '@nestjs/common'
import { ContextService } from '@island.is/application/api/core'

@Injectable()
export class LinkFieldFactory implements IFieldFactory {
  constructor(private contextService: ContextService) {}
  createField(field: LinkField): FieldDto {
    const result: FieldDto = {
      id: field.id,
      title: field.title?.toString() ?? '',
      type: field.type,
      component: field.component,
      specifics: {
        s3key: field.s3key
          ? this.contextService.formatText(field.s3key)
          : undefined,
        link: field.link?.toString(),
        iconType: field.iconProps?.type?.toString(),
        icon: field.iconProps?.icon?.toString(),
      },
    }
    return result
  }
}
