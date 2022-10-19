import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { NoContentException } from '@island.is/nest/problem'

import { Domain } from './models/domain.model'
import { ResourceTranslationService } from './resource-translation.service'

@Injectable()
export class DelegationDomainsService {
  constructor(
    @InjectModel(Domain)
    private domainModel: typeof Domain,
    private resourceTranslationService: ResourceTranslationService,
  ) {}

  async findAll(language?: string): Promise<Domain[]> {
    const domains = await this.domainModel.findAll()

    if (language) {
      return this.resourceTranslationService.translateDomains(domains, language)
    }

    return domains
  }

  async findOne(domainName: string, language?: string): Promise<Domain> {
    const domain = await this.domainModel.findByPk(domainName)

    if (!domain) {
      throw new NoContentException()
    }

    if (language) {
      return this.resourceTranslationService.translateDomain(domain, language)
    }

    return domain
  }
}
