import { Field, InputType, Int } from '@nestjs/graphql'
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator'
import { CertificateTypeEnum } from '../models/enums'

@InputType('HealthDirectorateCreateCertificateRequestInput')
export class CreateCertificateRequestInput {
  @Field({
    description: 'Node ID of the recipient. Obtained from the recipient list.',
  })
  @IsString()
  @IsNotEmpty()
  nodeId!: string

  @Field(() => Int, {
    description:
      'Group ID of the recipient provider. Obtained from the recipient list.',
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

  @Field({
    description:
      'Date-only string (YYYY-MM-DD). A calendar date, not a timestamp — sending a datetime could shift the date across timezones.',
  })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'startDate must be a date-only string in YYYY-MM-DD format',
  })
  @IsDateString()
  startDate!: string

  @Field({
    description:
      'Date-only string (YYYY-MM-DD). Must be on or after startDate.',
  })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'endDate must be a date-only string in YYYY-MM-DD format',
  })
  @IsDateString()
  endDate!: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  note?: string
}
