import { FormItemTypes, SectionChildren } from '@island.is/application/types'

import { IFormItemFactory } from './IFormItemFactory'
import { MultiFieldFactory } from './multifieldFactory'
import { FormItemDto } from '../../dto/form.dto'
import { Injectable } from '@nestjs/common'

@Injectable()
export class SubSectionFactory implements IFormItemFactory {
  constructor(private multiFieldFactory: MultiFieldFactory) {}
  create(item: SectionChildren): FormItemDto {
    const subSectionDto: FormItemDto = {
      id: item.id ?? '',
      title: item.title?.toString() ?? '',
      type: FormItemTypes.SUB_SECTION,
      children: [],
      //condition
    }
    if (!item.children) {
      return subSectionDto
    }

    item.children.forEach((child: SectionChildren) => {
      if (child.type === FormItemTypes.MULTI_FIELD) {
        subSectionDto.children.push(this.multiFieldFactory.create(child))
      }
    })

    return subSectionDto
  }
}
