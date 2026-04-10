import { CacheField } from '@island.is/nest/graphql'
import { Field, Int, ObjectType } from '@nestjs/graphql'
import { SupremeCourtAppealsInput } from './supremeCourtAppeals.input'

@ObjectType('WebSupremeCourtAppealsItem')
class Item {
  @Field(() => String)
  id!: string

  @Field(() => String)
  title!: string

  @Field(() => String)
  caseNumber!: string

  @Field(() => Date, { nullable: true })
  appealPolicyDate?: Date | null

  @Field(() => Date, { nullable: true })
  registrationDate?: Date | null

  @Field(() => Date, { nullable: true })
  verdictDate?: Date | null
}

@ObjectType('WebSupremeCourtAppealsResponse')
export class SupremeCourtAppealsResponse {
  @CacheField(() => [Item])
  items!: Item[]

  @Field(() => Int)
  total!: number

  @CacheField(() => SupremeCourtAppealsInput)
  input!: SupremeCourtAppealsInput
}
