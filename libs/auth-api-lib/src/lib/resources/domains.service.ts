import { InjectModel } from '@nestjs/sequelize'
import { Domain } from './models/domain.model'

export class DomainsService {
  constructor(
    @InjectModel(Domain)
    private domainModel: typeof Domain,
  ) {}

  async findAll(): Promise<Domain[]> {
    return this.domainModel.findAll()
  }

  async findOne(id: string): Promise<Domain | null> {
    return this.domainModel.findByPk(id)
  }

  async findScopeTree(): Promise<Domain[]> {
    return []
  }
}
