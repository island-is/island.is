import { Field, InputType, registerEnumType } from '@nestjs/graphql'
import { IsArray, IsEnum } from 'class-validator'

export enum MailAction {
  BOOKMARK = 'bookmark',
  ARCHIVE = 'archive',
  READ = 'read',
  UNBOOKMARK = 'unbookmark',
  UNARCHIVE = 'unarchive',
}

registerEnumType(MailAction, { name: 'DocumentsV2MailAction' })

@InputType('DocumentsV2MailActionInput')
export class MailActionInput {
  @Field(() => [String])
  @IsArray()
  documentIds!: Array<string>

  @Field()
  @IsEnum(MailAction)
  action!: MailAction
}
