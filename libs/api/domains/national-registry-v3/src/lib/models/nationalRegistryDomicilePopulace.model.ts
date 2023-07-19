import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Person } from './nationalRegistryPerson.model'
import { EinstaklingurDTOLoghTengsl } from '@island.is/clients/national-registry-v3'
import { ExcludesFalse } from '../utils'

@ObjectType('NationalRegistryV3DomicilePopulace')
export class DomicilePopulace {
  @Field(() => ID)
  legalDomicileId!: string

  @Field(() => [Person], {
    nullable: true,
  })
  populace?: Array<Person>
}

export function formatDomicilePopulace(
  domicileRelations: EinstaklingurDTOLoghTengsl | null | undefined,
): DomicilePopulace | null {
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
