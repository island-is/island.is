import { Field, ID, ObjectType } from '@nestjs/graphql'
import { IProcessEntry } from '../generated/contentfulTypes'
import { SystemMetadata } from '@island.is/shared/types'

@ObjectType()
export class ProcessEntry {
  @Field(() => ID)
  id!: string

  @Field()
  type!: string

  @Field()
  processTitle!: string

  @Field()
  processLink!: string

  @Field({ nullable: true })
  openLinkInModal?: boolean

  @Field()
  buttonText!: string
}

export const mapProcessEntry = ({
  fields,
  sys,
}: IProcessEntry): SystemMetadata<ProcessEntry> => ({
  typename: 'ProcessEntry',
  id: sys.id,
  type: fields.type ?? '',
  processTitle: fields.processTitle ?? '',
  processLink: fields.processLink ?? '',
  openLinkInModal: Boolean(fields.openLinkInModal),
  buttonText: fields.buttonText ?? '',
})
