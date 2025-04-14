import { Field, ObjectType } from '@nestjs/graphql'
import { Model } from './model.model'

@ObjectType('WorkMachinesModelCollection')
export class ModelCollection {
  @Field(() => [Model])
  models!: Array<Model>
}
