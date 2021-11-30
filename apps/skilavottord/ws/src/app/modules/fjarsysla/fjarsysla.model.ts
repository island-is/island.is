import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Fjarsysla {
  constructor(status: boolean) {
    this.status = status
  }

  @Field()
  status: boolean
}
