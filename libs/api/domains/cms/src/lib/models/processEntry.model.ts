import { Field, ID, ObjectType } from '@nestjs/graphql'

import { IProcessEntry } from '../generated/contentfulTypes'

@ObjectType()
export class ProcessEntry {
  @Field()
  typename: string

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

export const mapProcessEntry = ({
  fields,
  sys,
}: IProcessEntry): ProcessEntry => ({
  typename: 'ProcessEntry',
  id: sys.id,
  type: fields?.type ?? '',
  processTitle: fields?.processTitle ?? '',
  processLink: fields?.processLink ?? '',
  buttonText: fields?.buttonText ?? '',
})
