import {
  ExternalDataProvider,
  FormItemTypes,
} from '@island.is/application/types'
import { FormItemDto } from '../../dto/form.dto'
import { IFormItemFactory } from './IFormItemFactory'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ExternalDataProviderFactory implements IFormItemFactory {
  create(item: ExternalDataProvider): FormItemDto {
    const externalDataDto: FormItemDto = {
      id: item.id ?? '',
      title: item.title?.toString() ?? '',
      type: FormItemTypes.EXTERNAL_DATA_PROVIDER,
      children: [],
      dataProviders: item.dataProviders.map((dp) => ({
        id: dp.id,
        title: dp.title.toString(),
        subTitle: dp.subTitle?.toString(),
        action: dp.action,
        order: dp.order,
        source: dp.source,
      })),
    }

    return externalDataDto
  }
}
