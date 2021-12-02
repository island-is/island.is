import { Injectable, OnApplicationShutdown } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Application } from './application.model'
import { ApplicationService } from './application.service'

@Injectable()
export class LifeCycleService implements OnApplicationShutdown {
  //TODO better name
  constructor(
    @InjectModel(Application)
    private applicationService: ApplicationService,
  ) {}

  onApplicationShutdown(signal?: string) {
    console.log('shutdown...', signal)
  }

  onModuleDestroy() {
    console.log('destroyed...')
  }

  async run() {
    console.log('running...')
    const stuff = await this.applicationService.getAll()
  }
}
