import { Field, ID, ObjectType } from '@nestjs/graphql'

import { NationalRegistryUser } from './nationalRegistryPerson.model'
import { EinstaklingurDTOLoghTengsl } from '@island.is/clients/national-registry-v3'
import { ExcludesFalse } from '../utils'

@ObjectType()
export class NationalRegistryDomicilePopulace {
  @Field(() => ID)
  legalDomicileId!: string

  @Field(() => [NationalRegistryUser], {
    nullable: true,
  })
  populace?: Array<NationalRegistryUser>
}

export function formatDomicilePopulace(
  domicileRelations: EinstaklingurDTOLoghTengsl | null | undefined,
): NationalRegistryDomicilePopulace | null {
  if (!domicileRelations?.logheimilistengsl) {
    return null
  }

  return {
    legalDomicileId: domicileRelations.logheimilistengsl,
    populace: domicileRelations.logheimilismedlimir
      ?.map((l) => {
        if (!l.kennitala) {
          return null
        }
        return {
          nationalId: l.kennitala,
          fullName: l.nafn,
        }
      })
      .filter((Boolean as unknown) as ExcludesFalse),
  }
}
