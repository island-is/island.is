import { ObjectType, Field, registerEnumType } from '@nestjs/graphql'
import { BaseLink } from './baseLink.model'
import { FileType } from '../workMachines.types'

registerEnumType(FileType, { name: 'WorkMachinesDownloadFileType' })

@ObjectType('WorkMachinesDownloadLink', {
  implements: () => BaseLink,
})
export class DownloadLink implements BaseLink {
  @Field()
  href!: string

  @Field(() => FileType, { nullable: true })
  type!: FileType

  @Field({ nullable: true })
  displayTitle?: string
}
