import { ApiProperty } from '@nestjs/swagger'
import { FormsListFormDto } from './formsListForm.dto'

export class FormsListDto {
  @ApiProperty({ type: [FormsListFormDto] })
  forms!: FormsListFormDto[]
}
