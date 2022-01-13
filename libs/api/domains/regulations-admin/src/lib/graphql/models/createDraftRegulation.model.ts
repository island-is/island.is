import { Field, ObjectType } from '@nestjs/graphql'
import { IsString, IsDate, IsOptional } from 'class-validator'

@ObjectType()
export class CreateDraftRegulationModel {
  @Field()
  @IsString()
  id!: string

  @Field()
  @IsString()
  draftingStatus!: string

  @Field()
  @IsString()
  @IsOptional()
  name?: string

  @Field({ defaultValue: '' })
  @IsString()
  title!: string

  @Field({ defaultValue: '' })
  @IsString()
  text!: string

  @Field()
  @IsString()
  @IsOptional()
  draftingNotes?: string

  @Field()
  @IsString()
  @IsOptional()
  ministryId?: string

  @Field()
  @IsString()
  @IsOptional()
  idealPublishDate?: string

  @Field()
  @IsDate()
  @IsOptional()
  signatureDate?: string

  @Field()
  @IsDate()
  @IsOptional()
  effectiveDate?: string

  @Field()
  @IsString()
  @IsOptional()
  type?: string
}
