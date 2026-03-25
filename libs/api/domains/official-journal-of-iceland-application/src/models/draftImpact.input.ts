import { Field, InputType } from '@nestjs/graphql'
import { IsOptional } from 'class-validator'
import { OJOIAAppendixInput } from './appendix.input'

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

  @Field(() => [OJOIAAppendixInput], { nullable: true })
  @IsOptional()
  appendixes?: OJOIAAppendixInput[]

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

  @Field(() => [OJOIAAppendixInput], { nullable: true })
  @IsOptional()
  appendixes?: OJOIAAppendixInput[]

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
