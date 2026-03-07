import { Field, InputType } from '@nestjs/graphql'
import { IsOptional } from 'class-validator'
import graphqlTypeJson from 'graphql-type-json'

@InputType()
export class OJOIAUpdateDraftRegulationInput {
  @Field()
  draftId!: string

  @Field({ nullable: true })
  @IsOptional()
  title?: string

  @Field({ nullable: true })
  @IsOptional()
  text?: string

  @Field(() => graphqlTypeJson, { nullable: true })
  @IsOptional()
  appendixes?: Array<{ title: string; text: string }>

  @Field({ nullable: true })
  @IsOptional()
  draftingNotes?: string

  @Field({ nullable: true })
  @IsOptional()
  idealPublishDate?: string

  @Field({ nullable: true })
  @IsOptional()
  effectiveDate?: string

  @Field({ nullable: true })
  @IsOptional()
  ministry?: string

  @Field({ nullable: true })
  @IsOptional()
  signatureDate?: string

  @Field({ nullable: true })
  @IsOptional()
  signatureText?: string

  @Field(() => [String], { nullable: true })
  @IsOptional()
  lawChapters?: string[]

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  fastTrack?: boolean

  @Field({ nullable: true })
  @IsOptional()
  type?: string

  @Field({ nullable: true })
  @IsOptional()
  signedDocumentUrl?: string
}
