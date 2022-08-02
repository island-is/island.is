import { Field, ID, ObjectType } from '@nestjs/graphql'
import { IProcessEntry } from '../generated/contentfulTypes'
import { SystemMetadata } from '@island.is/shared/types'

@ObjectType()
export class ProcessEntry {
  @Field(() => ID)
  id!: string

  @Field()
  processTitle!: string

  @Field()
  processLink?: string

  @Field({ nullable: true })
  openLinkInModal?: boolean

  @Field()
  buttonText!: string
}

export const mapProcessEntry = ({
  fields,
  sys,
}: IProcessEntry): SystemMetadata<ProcessEntry> => {
  let processLink = ''

  if (fields.processLink?.length > 0) {
    processLink = fields.processLink
  } else if (fields.processAsset?.fields?.file?.url) {
    let prefix = ''
    if (fields.processAsset.fields.file.url.startsWith('//')) {
      prefix = 'https:'
    }
    processLink = prefix + fields.processAsset.fields.file.url
  }

  return {
    typename: 'ProcessEntry',
    id: sys.id,
    processTitle: fields.processTitle ?? '',
    processLink,
    openLinkInModal: Boolean(fields.openLinkInModal),
    buttonText: fields.buttonText ?? '',
  }
}
