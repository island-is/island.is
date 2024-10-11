import { Field, InputType } from '@nestjs/graphql'

@InputType('OfficialJournalOfIcelandAdvertSingleParams')
export class AdvertSingleParams {
  @Field(() => String)
  id!: string
}
