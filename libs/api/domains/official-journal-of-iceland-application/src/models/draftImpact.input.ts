import { Field, InputType } from '@nestjs/graphql'
import { IsOptional } from 'class-validator'
import graphqlTypeJson from 'graphql-type-json'

@InputType()
export class OJOIACreateDraftImpactInput {
  @Field()
  draftId!: string

  @Field()
  type!: string // 'amend' | 'repeal'

  @Field()
  regulation!: string // RegName of target regulation

  @Field()
  date!: string

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
  comments?: string

  @Field({ nullable: true })
  @IsOptional()
  diff?: string
}

@InputType()
export class OJOIAUpdateDraftImpactInput {
  @Field()
  impactId!: string

  @Field()
  type!: string // 'amend' | 'repeal'

  @Field({ nullable: true })
  @IsOptional()
  date?: string

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
  comments?: string

  @Field({ nullable: true })
  @IsOptional()
  diff?: string
}

@InputType()
export class OJOIADeleteDraftImpactInput {
  @Field()
  impactId!: string

  @Field()
  type!: string // 'amend' | 'repeal'
}
