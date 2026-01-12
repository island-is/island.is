import { ApiPropertyOptional } from '@nestjs/swagger'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('FormSystemUpdateFormError')
export class UpdateFormError {
  @ApiPropertyOptional()
  @Field(() => String, { nullable: true })
  field?: string

  @ApiPropertyOptional()
  @Field(() => String, { nullable: true })
  message?: string
}

@ObjectType('FormSystemUpdateFormResponse')
export class UpdateFormResponse {
  @ApiPropertyOptional()
  @Field(() => Boolean, { nullable: true })
  updateSuccess?: boolean

  @ApiPropertyOptional({ type: [UpdateFormError] })
  @Field(() => [UpdateFormError], { nullable: 'itemsAndList' })
  errors?: UpdateFormError[]
}
