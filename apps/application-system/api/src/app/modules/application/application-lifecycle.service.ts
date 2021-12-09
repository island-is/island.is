import { Injectable, OnApplicationShutdown } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Application } from './application.model'
import { ApplicationService } from './application.service'

@Injectable()
export class ApplicationLifeCycleService implements OnApplicationShutdown {
  //TODO better name
  constructor(private applicationService: ApplicationService) {
    console.log('constructor...')
    console.log(applicationService.stuff)
  }

  onApplicationShutdown(signal?: string) {
    console.log('shutdown...', signal)
  }

  onModuleDestroy() {
    console.log('destroyed...')
  }

  /**
   * Step 1:
   * - get all applications from the database to be pruned
   * Step 2:
   * - prune the applications answers
   * Step 3:
   * - collect attachment keys to be pruned
   * Step 4:
   * - delete/remove said attachemnts from S3
   * Step 4:
   * - prune the attachments from the applications
   * Step 5:
   * - validate that should be pruned is pruned.
   * Step 6:
   * - report results
   */
  async run() {
    console.log('running...')
    const stuff = await this.applicationService.findAllDueToBePruned()

    console.log(stuff[0])

    this.printApplications(stuff)
  }

  pruneAnswers(applications: Application[]) {
    console.log('pruneAnswers...')
    applications.forEach((application) => {
      application.answers = []
      application.save()
    })
  }

  printApplications(applications: Application[]) {
    console.log('printApplications...')
    applications.forEach((application) => {
      const small = {
        id: application.id,
        isListed: application.isListed,
        pruneAt: application.pruneAt,
        createdAt: application.createdAt,
        answers: application.answers,
        attachments: application.attachments,
      }
      console.log(small)
    })
  }
}
