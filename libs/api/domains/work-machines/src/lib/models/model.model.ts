import { ObjectType, Field } from '@nestjs/graphql'
import { Category } from './category.model'

@ObjectType('WorkMachinesModel')
export class Model {
  @Field()
  name!: string

  @Field(() => [Category], {
    nullable: true,
  })
  categories?: Array<Category>
}
