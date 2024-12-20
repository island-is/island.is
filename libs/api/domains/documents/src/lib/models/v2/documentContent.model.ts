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

  @Field(() => String, {
    description: 'Either pdf base64 string, html markup string, or an url',
    nullable: true,
  })
  value?: string | null
}
