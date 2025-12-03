import { Field, InputType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

@InputType('FormSystemFormStatusInput')
export class UpdateFormStatusDto {
  @IsString()
  @ApiProperty()
  @Field(() => String, { nullable: false })
  newStatus!: string
}

@InputType('FormSystemUpdateFormStatusInput')
export class UpdateFormStatusInput {
  @Field(() => String, { nullable: false })
  id!: string

  @Field(() => UpdateFormStatusDto, { nullable: false })
  updateFormStatusDto!: UpdateFormStatusDto
}
