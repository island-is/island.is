import { Field, InputType } from '@nestjs/graphql'

@InputType()
class CategoryChange {
  // kvotategund (Auðkenni fisktegundar)
  @Field()
  id!: number

  // aflabreyting
  @Field()
  catchChange!: number

  // aflamarksbreyting
  @Field()
  allowedCatchChange!: number
}

@InputType()
class CategoryChanges {
  @Field(() => [CategoryChange])
  categoryChanges!: CategoryChange[]
}

@InputType()
export class GetUpdatedShipStatusInformationInput {
  @Field()
  shipNumber!: number

  @Field()
  timePeriod!: string

  @Field(() => CategoryChanges)
  changes!: CategoryChanges
}
