import {
  FieldTypes,
  MultiField,
  SectionChildren,
} from '@island.is/application/types'
import { MultiField as MultifieldDto, SubSection } from '../dto/form.dto'
import { IFormItemFactory } from './IFormItemFactory'
import { Field } from '@nestjs/graphql'
import { DescriptionFieldFactory } from './descriptionFieldFactory'
import { TextFieldFactory } from './textFieldFactory'

export class MultiFieldFactory implements IFormItemFactory<MultifieldDto> {
  create(item: MultiField): MultifieldDto {
    const multiFieldDto = new MultifieldDto()

    item.children.forEach((child) => {
      if (child.type === FieldTypes.DESCRIPTION) {
        const descriptionFieldFactory = new DescriptionFieldFactory()
        multiFieldDto.children.push(descriptionFieldFactory.createField(child))
      }
      if (child.type === FieldTypes.TEXT) {
        const textFieldFactory = new TextFieldFactory()
        multiFieldDto.children.push(textFieldFactory.createField(child))
      }
    })

    return multiFieldDto
  }
}
