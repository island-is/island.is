import { Directive, Field, ObjectType } from '@nestjs/graphql'

@Directive('@deprecated(reason: "Up for removal")')
@ObjectType('WorkMachinesCollectionDocument')
export class Document {
  @Field(() => String, { nullable: true })
  downloadUrl?: string | null
}
