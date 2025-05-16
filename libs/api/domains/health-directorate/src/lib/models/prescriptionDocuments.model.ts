import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('HealthDirectoratePrescriptionDocument')
export class Document {
  @Field({ nullable: true })
  id?: string

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  url?: string
}

@ObjectType('HealthDirectoratePrescriptionDocuments')
export class PrescriptionDocuments {
  @Field(() => [Document])
  documents!: Document[]

  @Field()
  id!: string
}
