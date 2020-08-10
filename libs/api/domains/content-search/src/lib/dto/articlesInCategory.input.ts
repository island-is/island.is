import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ContentLanguage } from '../enums/contentLanguage.enum';

@InputType()
export class ArticlesInCategoryInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  slug?: string

  @Field(type => ContentLanguage, { nullable: true })
  @IsEnum(ContentLanguage)
  @IsOptional()
  language?: ContentLanguage
}
