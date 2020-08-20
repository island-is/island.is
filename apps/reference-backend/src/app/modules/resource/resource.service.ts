import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Resource } from './resource.model'
import { ResourceDto } from './dto/resource.dto'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { Counter } from 'prom-client'

@Injectable()
export class ResourceService {
  applicationsRegistered = new Counter({
    name: 'apps_registered',
    labelNames: ['resource'],
    help: 'Number of applications',
  })

  constructor(
    @InjectModel(Resource)
    private resourceModel: typeof Resource,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  async findByNationalId(nationalId: string): Promise<Resource> {
    this.logger.debug(`Finding resource for nationalId - "${nationalId}"`)
    return this.resourceModel.findOne({
      where: { nationalId },
    })
  }

  async create(resource: ResourceDto): Promise<Resource> {
    this.logger.debug(
      `Creating resource with nationalId - ${resource.nationalId}`,
    )
    this.applicationsRegistered.labels('res1').inc()
    return this.resourceModel.create(resource)
  }
}
