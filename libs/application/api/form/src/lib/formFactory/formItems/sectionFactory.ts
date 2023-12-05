import {
  FormChildren,
  SectionChildren,
  FormItemTypes,
} from '@island.is/application/types'
import { FormItemDto } from '../../dto/form.dto'
import { IFormItemFactory } from './IFormItemFactory'
import { SubSectionFactory } from './subSectionFactory'
import { MultiFieldFactory } from './multifieldFactory'
import { ExternalDataProviderFactory } from './externalDataProviderFactory'
import { Injectable } from '@nestjs/common'

import { ContextService } from '@island.is/application/api/core'

@Injectable()
export class SectionFactory implements IFormItemFactory {
  constructor(
    private subSectionFactory: SubSectionFactory,
    private multiFieldFactory: MultiFieldFactory,
    private externalDataProviderFactory: ExternalDataProviderFactory,
    private contextService: ContextService,
  ) {}

  create(item: FormChildren): FormItemDto {
    const context = this.contextService.getContext()

    const sectionDto: FormItemDto = {
      id: item.id ?? '',
      title: item.title?.toString() ?? '',
      type: FormItemTypes.SECTION,
      children: [],
      //condition
      //draftPageNumber
    }

    if (!item.children) {
      return sectionDto
    }

    item.children.forEach((child: SectionChildren) => {
      switch (child.type) {
        case FormItemTypes.SUB_SECTION:
          sectionDto.children.push(this.subSectionFactory.create(child))
          break
        case FormItemTypes.MULTI_FIELD:
          sectionDto.children.push(this.multiFieldFactory.create(child))
          break
        case FormItemTypes.EXTERNAL_DATA_PROVIDER:
          sectionDto.children.push(
            this.externalDataProviderFactory.create(child),
          )
          break
        // Add other cases if needed
      }
    })

    return sectionDto
  }
}
