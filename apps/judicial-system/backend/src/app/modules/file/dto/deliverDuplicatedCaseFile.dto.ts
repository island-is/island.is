import { IsNotEmpty, IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

// The message that copies the object behind a duplicated case file carries the
// key of the original's object; the copy's own key is on its row.
export class DeliverDuplicatedCaseFileDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String })
  readonly sourceKey!: string
}
