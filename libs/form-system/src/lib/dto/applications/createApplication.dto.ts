import { Field, InputType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNotEmpty } from 'class-validator'

@InputType('FormSystemCreateApplicationInput')
export class CreateApplicationDto {
  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty()
  @Field(() => Boolean)
  isTest!: boolean
}
