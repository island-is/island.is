import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { ContentLanguage } from '../enums/contentLanguage.enum';

@InputType()
export class CategoriesInput {
  @Field(type => ContentLanguage, { nullable: true })
  @IsEnum(ContentLanguage)
  @IsOptional()
  language?: ContentLanguage
}
