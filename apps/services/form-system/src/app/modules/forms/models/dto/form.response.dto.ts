import { ApiProperty } from '@nestjs/swagger'
import { InputTypeDto } from '../../../inputs/models/dto/inputType.dto'
import { ListTypeDto } from '../../../lists/models/dto/listType.dto'
import { TestimonyTypeDto } from '../../../testimonies/models/dto/testimonyType.dto'
import { FormDto } from './form.dto'

export class FormResponse {
  @ApiProperty({ type: FormDto })
  form!: FormDto

  @ApiProperty({ type: [InputTypeDto] })
  inputTypes!: InputTypeDto[]

  @ApiProperty({ type: [TestimonyTypeDto] })
  testimonyTypes!: TestimonyTypeDto[]

  @ApiProperty({ type: [ListTypeDto] })
  listTypes!: ListTypeDto[]
}
