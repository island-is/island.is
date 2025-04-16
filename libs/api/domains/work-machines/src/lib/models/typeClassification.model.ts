import { ObjectType, Field } from '@nestjs/graphql'
import { Model } from './model.model'

@ObjectType('WorkMachinesTypeClassification')
export class TypeClassification {
  @Field()
  name!: string

  @Field(() => [Model], {
    nullable: true,
  })
  models?: Array<Model>
}
