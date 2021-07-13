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

  @Field()
  @IsString()
  @IsOptional()
  signature_date?: string

  @Field()
  @IsString()
  @IsOptional()
  effective_date?: string

  @Field()
  @IsString()
  @IsOptional()
  type?: string

  //   "id": "string",
  //   "drafting_status": "string",
  //   "name": "string",
  //   "title": "string",
  //   "text": "string",
  //   "drafting_notes": "string",
  //   "ideal_publish_date": "2021-07-13T09:27:36.485Z",
  //   "ministry_id": "string",
  //   "signature_date": "2021-07-13T09:27:36.485Z",
  //   "effective_date": "2021-07-13T09:27:36.485Z",
  //   "type": "string"
}
