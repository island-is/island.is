import { ApiProperty } from '@nestjs/swagger'
import { FieldTypeDto } from '../../../fields/models/dto/fieldType.dto'
import { ListTypeDto } from '../../../lists/models/dto/listType.dto'
import { TestimonyTypeDto } from '../../../testimonies/models/dto/testimonyType.dto'
import { FormDto } from './form.dto'

export class FormResponse {
  @ApiProperty({ type: FormDto })
  form!: FormDto

  @ApiProperty({ type: [FieldTypeDto] })
  fieldTypes!: FieldTypeDto[]

  @ApiProperty({ type: [TestimonyTypeDto] })
  testimonyTypes!: TestimonyTypeDto[]

  @ApiProperty({ type: [ListTypeDto] })
  listTypes!: ListTypeDto[]
}
