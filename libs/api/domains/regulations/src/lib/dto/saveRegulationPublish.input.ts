import {
  HTMLText,
  ISODate,
  LawChapterSlug,
  PlainText,
  RegName,
  RegulationType,
  URLString,
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
  @Field(() => String)
  comments!: string

  @Field(() => String, { nullable: true })
  repealedDate!: ISODate

  @Field(() => [AppendixInput])
  appendixes!: AppendixInput[]
}
