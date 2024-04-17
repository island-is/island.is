import { Field, InputType, Int, PartialType } from '@nestjs/graphql'
import { IsBoolean, IsNumber, IsString } from 'class-validator'

@InputType()
export class DocumentProviderCategoriesAndTypesPostInput {
  @Field(() => String, { nullable: true })
  @IsString()
  name?: string

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  active?: boolean
}

@InputType()
export class DocumentProviderCategoriesAndTypesPutInput extends PartialType(
  DocumentProviderCategoriesAndTypesPostInput,
) {
  @Field(() => Int)
  @IsNumber()
  id!: number
}
