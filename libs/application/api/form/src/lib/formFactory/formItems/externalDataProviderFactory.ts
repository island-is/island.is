import {
  ExternalDataProvider,
  FormItemTypes,
} from '@island.is/application/types'
import { FormItemDto } from '../../dto/form.dto'
import { IFormItemFactory } from './IFormItemFactory'
import { Injectable } from '@nestjs/common'
import { ContextService } from '@island.is/application/api/core'

@Injectable()
export class ExternalDataProviderFactory implements IFormItemFactory {
  constructor(private contextService: ContextService) {}
  create(item: ExternalDataProvider): FormItemDto {
    const externalDataDto: FormItemDto = {
      id: item.id ?? '',
      title: this.contextService.formatText(item.title),
      type: FormItemTypes.EXTERNAL_DATA_PROVIDER,
      children: [],
      dataProviders: item.dataProviders.map((dp) => ({
        id: dp.id,
        title: this.contextService.formatText(dp.title),
        subTitle: dp.subTitle
          ? this.contextService.formatText(dp.subTitle)
          : undefined,
        action: dp.action,
        order: dp.order,
        source: dp.source,
      })),
    }

    return externalDataDto
  }
}
