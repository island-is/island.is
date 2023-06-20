import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('WorkMachinesWorkMachineCollectionDocument')
export class Document {
  @Field(() => String, { nullable: true })
  downloadUrl?: string | null
}
