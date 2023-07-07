import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('IntellectualPropertyDesignCollectionEntry')
export class DesignCollectionEntry {
  @Field(() => Date, { nullable: true })
  applicationNumber?: Date

  @Field(() => String, { nullable: true })
  hId?: string | null

  @Field(() => String, { nullable: true })
  status?: string | null

  @Field(() => String, { nullable: true })
  specification?: string | null
}
