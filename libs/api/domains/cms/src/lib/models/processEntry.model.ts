import { Field, ID, ObjectType } from '@nestjs/graphql'

import { IProcessEntry } from '../generated/contentfulTypes'

@ObjectType()
export class ProcessEntry {
  constructor(initializer: ProcessEntry) {
    Object.assign(this, initializer)
  }

  @Field(() => ID)
  id: string

  @Field()
  type: string

  @Field()
  processTitle: string

  @Field()
  processLink: string

  @Field()
  buttonText: string
}

export const mapProcessEntry = ({ fields, sys }: IProcessEntry): ProcessEntry =>
  new ProcessEntry({
    id: sys.id,
    type: fields.type,
    processTitle: fields.processTitle,
    processLink: fields.processLink,
    buttonText: fields.buttonText ?? '',
  })
