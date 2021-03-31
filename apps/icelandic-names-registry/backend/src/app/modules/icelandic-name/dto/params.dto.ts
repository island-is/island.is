import { IsString, Length } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class GetIcelandicNamesByInitialLetterParams {
  @IsString()
  @Length(1, 1)
  @ApiProperty()
  readonly initialLetter!: string
}
