import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class MedicinePrescriptionDocumentsInput {
  @Field()
  id!: string
}
