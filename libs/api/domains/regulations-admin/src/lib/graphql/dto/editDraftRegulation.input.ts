import { Field, InputType, PartialType } from '@nestjs/graphql'
import { IsString, IsOptional } from 'class-validator'

@InputType()
export class EditDraftBody {
  @Field({ nullable: true })
  @IsString()
  drafting_status!: string

  @IsString()
  @Field({ nullable: true })
  @IsOptional()
  text!: string

  @IsString()
  @Field({ nullable: true })
  @IsOptional()
  name?: string

  @IsString()
  @Field({ nullable: true })
  @IsOptional()
  title?: string

  @IsString()
  @Field({ nullable: true })
  @IsOptional()
  drafting_notes?: string

  @IsString()
  @Field({ nullable: true })
  @IsOptional()
  ministry_id?: string

  @IsString()
  @Field({ nullable: true })
  @IsOptional()
  ideal_publish_date?: string

  @IsString()
  @Field({ nullable: true })
  @IsOptional()
  signature_date?: string

  @IsString()
  @Field({ nullable: true })
  @IsOptional()
  effective_date?: string

  @IsString()
  @Field({ nullable: true })
  @IsOptional()
  type?: string

  @Field(() => [String], { nullable: true })
  @IsOptional()
  law_chapters?: string[]
}

@InputType()
export class EditDraftRegulationInput {
  @Field()
  @IsString()
  id!: string

  @Field()
  body!: EditDraftBody
}
