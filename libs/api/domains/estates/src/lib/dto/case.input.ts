import { Field, InputType } from '@nestjs/graphql'
import { LocaleEnum } from '@island.is/nest/graphql'

@InputType('EstatesCaseInput')
export class CaseInput {
  @Field()
  caseId!: string

  @Field(() => LocaleEnum, { nullable: true, defaultValue: LocaleEnum.Is })
  locale?: LocaleEnum
}
