import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { IsString, IsOptional } from 'class-validator'

@InputType()
export class EditDraftBody {
  @Field()
  @IsString()
  drafting_status!: string

  @Field()
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
  ministryId?: string

  @Field()
  @IsString()
  @IsOptional()
  ideal_publish_date?: string

  @Field()
  @IsOptional()
  signature_date?: string

  @Field()
  @IsOptional()
  effective_date?: string

  @Field()
  @IsString()
  @IsOptional()
  type?: string
}

@InputType()
export class EditDraftRegulationInput {
  @Field()
  @IsString()
  id!: string

  @Field()
  body!: EditDraftBody
}
