import { Field, InputType, Int, PartialType } from '@nestjs/graphql'
import { IsBoolean, IsNumber, IsString } from 'class-validator'

@InputType()
export class CategoriesAndTypesSharedInput {
  @Field(() => String, { nullable: true })
  @IsString()
  name?: string

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  active?: boolean
}

@InputType()
export class DocumentProvidedTypeInput extends PartialType(
  CategoriesAndTypesSharedInput,
) {
  @Field(() => Int)
  @IsNumber()
  messageTypeId!: number
}

@InputType()
export class DocumentProvidedCategoryInput extends PartialType(
  CategoriesAndTypesSharedInput,
) {
  @Field(() => Int)
  @IsNumber()
  categoryId!: number
}
