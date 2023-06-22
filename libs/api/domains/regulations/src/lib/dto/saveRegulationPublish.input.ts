import {
  HTMLText,
  ISODate,
  PlainText,
  RegName,
  RegulationEffect,
  RegulationType,
} from '@island.is/regulations'
import { Field, ID, InputType, ObjectType } from '@nestjs/graphql'
import { IsOptional } from 'class-validator'

@ObjectType('IRegulationAppendixObject')
@InputType('IRegulationAppendixInput')
class AppendixInput {
  @Field(() => String, { nullable: true })
  title!: PlainText

  @Field(() => String, { nullable: true })
  text!: HTMLText
}

@ObjectType('IRegulationPublishObject')
@InputType('IRegulationPublishInput')
export class IRegulationPublishInput {
  @Field(() => Number, { nullable: true })
  id?: number | undefined

  @Field(() => String)
  title!: PlainText

  @Field(() => String)
  name!: RegName

  @Field(() => String)
  type!: RegulationType

  @Field(() => String)
  signatureDate!: ISODate

  @Field(() => String)
  effectiveDate!: ISODate

  @Field(() => String)
  publishedDate!: ISODate

  @Field(() => String)
  status!: 'shipped'

  @Field(() => String)
  text!: string

  @Field(() => Number, { nullable: true })
  ministryId?: number | null

  @Field(() => String, { nullable: true })
  externalLink?: string | null

  @Field(() => Boolean, { nullable: true })
  repealedBeacuseReasons!: boolean
}

@InputType()
export class UiRegulationPublishInput extends IRegulationPublishInput {
  @Field(() => [ImpactRegulationPublishInput], { nullable: true })
  impacts?: Array<ImpactRegulationPublishInput>

  @Field(() => [String], { nullable: true })
  lawChapters?: string[]

  @Field(() => String, { nullable: true })
  ministryName?: string
}

@InputType()
export class ImpactRegulationPublishInput {
  @Field(() => String, { nullable: true })
  date?: ISODate

  @Field(() => String, { nullable: true })
  title?: PlainText

  @Field(() => String, { nullable: true })
  text?: string

  @Field(() => [AppendixInput], { nullable: true })
  appendixes?: AppendixInput[]

  @Field(() => String, { nullable: true })
  comments?: string

  @Field(() => String, { nullable: true })
  name?: RegName

  @Field(() => String, { nullable: true })
  type?: RegulationEffect['effect']
}
