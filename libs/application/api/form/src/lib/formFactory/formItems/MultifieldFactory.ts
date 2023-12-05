import { FieldTypes, MultiField } from '@island.is/application/types'
import { FormItemDto } from '../../dto/form.dto'
import { IFormItemFactory } from './IFormItemFactory'
import { DescriptionFieldFactory } from '../fields/descriptionFieldFactory'
import { TextFieldFactory } from '../fields/textFieldFactory'
import { Injectable } from '@nestjs/common'
import { SubmitFieldFactory } from '../fields/submitFieldFactory'

@Injectable()
export class MultiFieldFactory implements IFormItemFactory {
  constructor(
    private descriptionFieldFactory: DescriptionFieldFactory,
    private textFieldFactory: TextFieldFactory,
    private submitFieldFactory: SubmitFieldFactory,
  ) {}
  create(item: MultiField): FormItemDto {
    const multiFieldDto: FormItemDto = {
      id: item.id ?? '',
      title: item.title?.toString() ?? '',
      isPartOfRepeater: false,
      children: [],
      fields: [],
      type: item.type,
    }

    item.children.forEach((child) => {
      if (child.type === FieldTypes.DESCRIPTION) {
        multiFieldDto.fields = multiFieldDto.fields || []
        multiFieldDto.fields.push(
          this.descriptionFieldFactory.createField(child),
        )
      }
      if (child.type === FieldTypes.TEXT) {
        multiFieldDto.fields = multiFieldDto.fields || []
        multiFieldDto.fields.push(this.textFieldFactory.createField(child))
      }

      if (child.type === FieldTypes.SUBMIT) {
        multiFieldDto.fields = multiFieldDto.fields || []
        multiFieldDto.fields.push(this.submitFieldFactory.createField(child))
      }
    })

    return multiFieldDto
  }
}
