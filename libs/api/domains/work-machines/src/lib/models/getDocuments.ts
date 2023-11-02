import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('WorkMachinesCollectionDocument')
export class Document {
  @Field(() => String, { nullable: true })
  downloadUrl?: string | null
}
