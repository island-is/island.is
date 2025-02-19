import { Field, InputType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

@InputType('FormSystemListItemDisplayOrderInput')
export class ListItemDisplayOrderDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @Field(() => String)
  id!: string
}
