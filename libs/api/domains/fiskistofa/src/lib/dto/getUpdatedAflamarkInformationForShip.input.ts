import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CategoryChange {
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
export class GetUpdatedAflamarkInformationForShipInput {
  @Field()
  shipNumber!: number

  @Field()
  timePeriod!: string

  @Field(() => [CategoryChange])
  changes!: CategoryChange[]
}
