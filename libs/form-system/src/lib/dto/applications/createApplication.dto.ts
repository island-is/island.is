import { Field, InputType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNotEmpty } from 'class-validator'

@InputType('FormSystemCreateApplication')
export class CreateApplicationDto {
  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty()
  @Field(() => Boolean)
  isTest!: boolean
}

@InputType('FormSystemCreateApplicationInput')
export class CreateApplicationInput {
  @Field(() => String)
  slug!: string
}
