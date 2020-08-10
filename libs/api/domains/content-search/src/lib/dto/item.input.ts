import { Field, ID, InputType } from '@nestjs/graphql'
import { IsEnum, IsOptional, IsString } from 'class-validator'
import { ItemType } from '../enums/itemType.enum'
import { ContentLanguage } from '../enums/contentLanguage.enum'

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
