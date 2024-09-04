import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class VehicleInformation {
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

@ObjectType()
export class VehicleInformationMini {
  constructor(
    permno: string,
    ownerSocialSecurityNumber: string,
    vehicleStatus: string,
  ) {
    this.permno = permno
    this.ownerSocialSecurityNumber = ownerSocialSecurityNumber
    this.vehicleStatus = vehicleStatus
  }

  @Field()
  permno: string

  @Field()
  ownerSocialSecurityNumber: string

  @Field()
  vehicleStatus: string
}

@ObjectType()
export class Traffic {
  constructor(
    permno: string,
    outInStatus: string,
    useStatus: string,
    useStatusName: string,
    useDate: string,
  ) {
    this.permno = permno
    this.outInStatus = outInStatus
    this.useStatus = useStatus
    this.useStatusName = useStatusName
    this.useDate = useDate
  }

  @Field()
  permno: string

  @Field()
  outInStatus: string

  @Field()
  useStatus: string

  @Field()
  useStatusName: string

  @Field()
  useDate: string
}
