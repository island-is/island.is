import { ApiProperty } from '@nestjs/swagger'
import { FormDto } from './form.dto'
import { InputType } from '../../../inputs/models/inputType.model'
import { InputTypeDto } from '../../../inputs/models/dto/inputType.dto'
import { TestimonyType } from '../../../testimonies/models/testimonyType.model'
import { TestimonyTypeDto } from '../../../testimonies/dto/testimonyType.dto'
import { ListTypeDto } from '../../../lists/models/dto/listType.dto'

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
