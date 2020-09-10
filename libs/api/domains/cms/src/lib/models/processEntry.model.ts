import { Field, ID, ObjectType } from '@nestjs/graphql'

import { IProcessEntry } from '../generated/contentfulTypes'

import { Html, mapHtml } from './html.model'

@ObjectType()
export class ProcessEntry {
  constructor(initializer: ProcessEntry) {
    Object.assign(this, initializer)
  }

  @Field(() => ID)
  id: string

  @Field()
  title: string

  @Field({ nullable: true })
  subtitle?: string

  @Field(() => Html, { nullable: true })
  details?: Html

  @Field()
  type: string

  @Field()
  processTitle: string

  @Field({ nullable: true })
  processDescription?: string

  @Field(() => Html, { nullable: true })
  processInfo?: Html

  @Field()
  processLink: string

  @Field()
  buttonText: string
}

export const mapProcessEntry = ({ fields, sys }: IProcessEntry): ProcessEntry =>
  new ProcessEntry({
    id: sys.id,
    title: fields.title,
    subtitle: fields.subtitle,
    details: fields.details && mapHtml(fields.details),
    type: fields.type,
    processTitle: fields.processTitle,
    processDescription: fields.processDescription,
    processInfo: fields.processInfo && mapHtml(fields.processInfo),
    processLink: fields.processLink,
    buttonText: fields.buttonText ?? '',
  })
