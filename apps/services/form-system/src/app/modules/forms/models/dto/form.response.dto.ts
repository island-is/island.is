import { ApiProperty } from '@nestjs/swagger'
import { FormDto } from './form.dto'
import { InputType } from '../../../inputs/models/inputType.model'
import { InputTypeDto } from '../../../inputs/models/dto/inputType.dto'

export class FormResponse {
  @ApiProperty({ type: FormDto })
  form!: FormDto

  @ApiProperty({ type: [InputTypeDto] })
  inputTypes!: InputTypeDto[]
}
