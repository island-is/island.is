import { Injectable, NotFoundException } from '@nestjs/common'

import { InstitutionType } from '@island.is/judicial-system/types'

import { Institution, InstitutionRepositoryService } from '../repository'

@Injectable()
export class InstitutionService {
  constructor(
    private readonly institutionRepositoryService: InstitutionRepositoryService,
  ) {}

  async getById(id: string): Promise<Institution> {
    const institution = await this.institutionRepositoryService.findById(id)

    if (!institution) {
      throw new NotFoundException(`Institution ${id} not found`)
    }

    return institution
  }

  async getAll(types?: InstitutionType[]): Promise<Institution[]> {
    return this.institutionRepositoryService.findAllActive(types)
  }
}
