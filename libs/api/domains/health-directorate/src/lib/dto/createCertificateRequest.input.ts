import { Field, InputType, Int } from '@nestjs/graphql'
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator'
import { CertificateTypeEnum } from '../models/enums'

@InputType()
export class HealthDirectorateCreateCertificateRequestInput {
  @Field({
    description:
      'Hekla node ID of the recipient. Obtained from the recipient list.',
  })
  @IsString()
  @IsNotEmpty()
  nodeId!: string

  @Field(() => Int, {
    description:
      'Hekla group ID of the recipient provider. Obtained from the recipient list.',
  })
  @IsInt()
  groupId!: number

  @Field(() => CertificateTypeEnum)
  @IsEnum(CertificateTypeEnum)
  certificateType!: CertificateTypeEnum

  @Field({
    description:
      'Name the certificate is addressed to. Employer for a work certificate, school for a school certificate.',
  })
  @IsString()
  @IsNotEmpty()
  recipientName!: string

  @Field()
  @IsDate()
  startDate!: Date

  @Field()
  @IsDate()
  endDate!: Date

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  note?: string
}
