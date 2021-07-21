import { Field, InputType } from '@nestjs/graphql'
import { IsString, IsOptional } from 'class-validator'

@InputType()
export class CreateDraftRegulationInput {
  @Field()
  @IsString()
  id!: string

  @Field()
  @IsString()
  drafting_status!: string

  @Field({ nullable: true })
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
  text!: string

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

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  signature_date?: string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  effective_date?: string

  @Field()
  @IsString()
  @IsOptional()
  type?: string
}
