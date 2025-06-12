import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('HealthDirectoratePrescriptionDocument')
export class Document {
  @Field()
  id!: string

  @Field()
  name!: string

  @Field()
  url!: string
}

@ObjectType('HealthDirectoratePrescriptionDocuments')
export class PrescriptionDocuments {
  @Field(() => [Document])
  documents!: Document[]

  @Field()
  id!: string
}
