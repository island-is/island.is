import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class VehicleRestInformation {
  constructor(
    permno: string,
    type: string,
    color: string,
    vinNumber: string,
    firstRegDate: string,
    isRecyclable: boolean,
    hasCoOwner: boolean,
    status: string,
  ) {
    this.permno = permno
    this.type = type
    this.color = color
    this.vinNumber = vinNumber
    this.firstRegDate = firstRegDate
    this.isRecyclable = isRecyclable
    this.hasCoOwner = hasCoOwner
    this.status = status
  }

  @Field()
  permno: string

  @Field()
  type: string

  @Field()
  color: string

  @Field()
  vinNumber: string

  @Field()
  firstRegDate: string

  @Field()
  isRecyclable: boolean

  @Field()
  hasCoOwner: boolean

  @Field()
  status: string
}
