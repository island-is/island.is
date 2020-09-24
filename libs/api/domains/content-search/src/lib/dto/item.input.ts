import { ContentLanguage, ItemType } from '@island.is/api/content-search'
import { Field, ID, InputType } from '@nestjs/graphql'
import { IsEnum, IsOptional, IsString } from 'class-validator'

@InputType()
export class ItemInput {
  @Field(() => ID, { nullable: true })
  @IsString()
  @IsOptional()
  id?: string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  slug?: string

  @Field(() => ItemType, { nullable: true })
  @IsEnum(ItemType)
  @IsOptional()
  type?: ItemType

  @Field(() => ContentLanguage, { nullable: true })
  @IsEnum(ContentLanguage)
  @IsOptional()
  language?: ContentLanguage
}
