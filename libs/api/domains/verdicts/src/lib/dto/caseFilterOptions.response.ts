import { CacheField } from '@island.is/nest/graphql'
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'
import { CaseFilterOptionType } from '@island.is/clients/verdicts'

registerEnumType(CaseFilterOptionType, {
  name: 'WebVerdictCaseFilterOptionType',
})

@ObjectType('WebVerdictCaseFilterOption')
class CaseFilterOption {
  @Field()
  label!: string

  @CacheField(() => CaseFilterOptionType)
  typeOfOption!: CaseFilterOptionType
}

@ObjectType('WebVerdictCaseFilterOptionsPerCourt')
class CaseFilterOptionsPerCourt {
  @CacheField(() => [CaseFilterOption])
  options!: CaseFilterOption[]
}

@ObjectType('WebVerdictCaseFilterOptionsResponse')
export class CaseFilterOptionsResponse {
  @CacheField(() => CaseFilterOptionsPerCourt)
  courtOfAppeal!: CaseFilterOptionsPerCourt

  @CacheField(() => CaseFilterOptionsPerCourt)
  supremeCourt!: CaseFilterOptionsPerCourt

  @CacheField(() => CaseFilterOptionsPerCourt)
  districtCourt!: CaseFilterOptionsPerCourt

  @CacheField(() => CaseFilterOptionsPerCourt)
  all!: CaseFilterOptionsPerCourt
}
