import { IsEnum, IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { IsNationalId } from '@island.is/nest/validators'

export enum MessageTypes {
  NewPostholfMessage = 'newPostholfMessage',
}

export class TypeValidator {
  @IsEnum(MessageTypes)
  @ApiProperty({ enum: MessageTypes })
  type!: MessageTypes
}

export class NewPostholfMessage {
  @ApiProperty({ enum: [MessageTypes.NewPostholfMessage] })
  type!: MessageTypes.NewPostholfMessage

  @IsString()
  from!: string

  @IsNationalId()
  @ApiProperty()
  recipient!: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  postholfMessageId!: string
}

export type Message = NewPostholfMessage

export const ValidatorTypeMap = {
  newPostholfMessage: NewPostholfMessage,
}
