import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { ItemType } from '../enums/itemType.enum';
import { ContentLanguage } from '../enums/contentLanguage.enum';

@InputType()
export class ItemInput {
  @Field(type => ID, { nullable: true })
  @IsString()
  @IsOptional()
  id?: string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  slug?: string

  @Field(type => ItemType, { nullable: true })
  @IsEnum(ItemType)
  @IsOptional()
  type?: ItemType

  @Field(type => ContentLanguage, { nullable: true })
  @IsEnum(ContentLanguage)
  @IsOptional()
  language?: ContentLanguage
}
