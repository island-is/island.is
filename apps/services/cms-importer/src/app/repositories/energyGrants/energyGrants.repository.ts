import { Injectable } from '@nestjs/common'
import DATA from './data.json'
import { EnergyGrantCollectionDto } from './dto/energyGrantCollection.dto'
import { EnergyGrantDto } from './dto/energyGrant.dto'

@Injectable()
export class EnergyGrantsRepository {
  async getEnergyGrants(
    limit?: number,
  ): Promise<EnergyGrantCollectionDto | null> {
    const finalIndex = DATA.length - 1
    const grantsArray = DATA.slice(0, limit ?? finalIndex)
    const total = DATA[finalIndex]

    const grants: Array<EnergyGrantDto> = grantsArray.map((grant) => {
      const projectName = grant['Heiti verkefnis']
      return {
        tagOne: grant['Tag 1'],
        tagTwo: grant['Tag 2'] ?? undefined,
        tagThree: grant['Tag 3'] ?? undefined,
        caseId: grant['Mál'],
        year: grant['Ártal'],
        recipient: grant['Styrkhafi'],
        initiativeName: grant['Átaksheiti'],
        projectName:
          typeof projectName === 'number'
            ? projectName.toString()
            : projectName,
        amount: grant['Styrkupphæð (kr.)'] ?? 0,
      }
    })

    return {
      grants,
      totalAmount: total['Styrkupphæð (kr.)'] ?? 0,
    }
  }
}
