import { Field, ObjectType, ID } from '@nestjs/graphql'
import { Asset } from 'contentful'

@ObjectType()
export class File {
  constructor(initializer: File) {
    Object.assign(this, initializer)
  }

  @Field(() => ID)
  id: string

  @Field()
  url: string

  @Field()
  title: string

  @Field()
  contentType: string
}

export const mapFile = ({ fields, sys }: Asset): File =>
  new File({
    id: sys.id,
    url: fields.file.url,
    title: fields.title,
    contentType: fields.file.contentType,
  })
