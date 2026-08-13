import { Injectable } from '@nestjs/common'
import { buildings } from './data.json'
import { BuildingDto } from './dto/building.dto'

@Injectable()
export class FSREBuildingsRepository {
  async getBuildings(limit?: number): Promise<Array<BuildingDto> | null> {
    const buildingsSlice = limit ? buildings.slice(0, limit) : buildings

    return buildingsSlice.map((building) => {
      return {
        ...building,
        id: building.idNumber,
        region: building.tagArea,
        propertyManagement: building.accountManagement?.map(
          (account) => account.name,
        ),
        accountManagement: building.accountManagement?.map(
          (account) => account.name,
        ),
      }
    })
  }
}
