import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class MedicineDispensationsATCInput {
  @Field()
  atcCode!: string
}
