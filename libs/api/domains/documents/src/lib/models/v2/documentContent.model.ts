import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'

export enum FileType {
  PDF = 'pdf',
  HTML = 'html',
  URL = 'url',
  UNKNOWN = 'unknown',
}

registerEnumType(FileType, { name: 'DocumentsV2FileType' })

@ObjectType('DocumentV2Content')
export class DocumentContent {
  @Field(() => FileType)
  type!: FileType

  @Field({
    description: 'Either pdf base64 string, html markup string, or an url',
  })
  value!: string
}
