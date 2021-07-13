import { Field, ObjectType } from '@nestjs/graphql'
import { IsString, IsDate, IsOptional } from 'class-validator'

@ObjectType()
export class CreateDraftRegulationModel {
  @Field()
  @IsString()
  id!: string

  @Field()
  @IsString()
  drafting_status!: string

  @Field()
  @IsString()
  @IsOptional()
  name?: string

  @Field()
  @IsString()
  @IsOptional()
  title?: string

  @Field()
  @IsString()
  @IsOptional()
  text?: string

  @Field()
  @IsString()
  @IsOptional()
  drafting_notes?: string

  @Field()
  @IsString()
  @IsOptional()
  ministry_id?: string

  @Field()
  @IsString()
  @IsOptional()
  ideal_publish_date?: string

  @Field()
  @IsDate()
  @IsOptional()
  signature_date?: string

  @Field()
  @IsDate()
  @IsOptional()
  effective_date?: string

  @Field()
  @IsString()
  @IsOptional()
  type?: string
}
