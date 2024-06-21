import { Injectable } from '@nestjs/common'
import { InputDto } from './dto/input.dto'
import { Input } from './input.model'
import { UpdateInputDto } from './dto/updateInput.dto'
import {
  InputSettingsDto,
  TextboxInputSettingsDto,
} from '../../inputSettings/models/dto/inputSettings.dto'

@Injectable()
export class InputMapper {
  mapInputToInputDto(
    input: Input,
    inputSettingsDto: InputSettingsDto,
  ): InputDto {
    const inputDto: InputDto = {
      id: input.id,
      groupId: input.groupId,
      name: input.name,
      displayOrder: input.displayOrder,
      description: input.description,
      isPartOfMultiset: input.isPartOfMultiset,
      inputType: input.inputType,
      inputSettings: inputSettingsDto,
    }

    return inputDto
  }

  mapUpdateInputDtoToInput(input: Input, updateInputDto: UpdateInputDto): void {
    input.name = updateInputDto.name
    input.description = updateInputDto.description
    input.isPartOfMultiset = updateInputDto.isPartOfMultiset
    input.inputType = updateInputDto.inputType
    input.modified = new Date()
  }
}
