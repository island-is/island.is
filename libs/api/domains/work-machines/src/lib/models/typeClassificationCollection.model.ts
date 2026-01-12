import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType('WorkMachinesTypeClassifications')
export class TypeClassifications {
  @Field(() => [String])
  typeNames!: Array<string>
}
