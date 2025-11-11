import { InputType, Field, ObjectType } from '@nestjs/graphql'

@InputType('LegalGazetteGetCategoriesInput')
export class LegalGazetteCategoriesInput {
  @Field(() => String)
  typeId!: string
}

@ObjectType('LegalGazetteCategory')
export class LegalGazetteCategory {
  @Field(() => String)
  id!: string

  @Field(() => String)
  title!: string

  @Field(() => String)
  slug!: string
}

@ObjectType('LegalGazetteCategoriesResponse')
export class LegalGazetteCategoriesResponse {
  @Field(() => [LegalGazetteCategory])
  categories!: LegalGazetteCategory[]
}
