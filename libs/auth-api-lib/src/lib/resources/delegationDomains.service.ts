import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Domain } from './models/domain.model'

@Injectable()
export class DelegationDomainsService {
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
}
