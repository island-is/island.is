import request from 'request'
import { Injectable, Logger } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name)

  //See: https://docs.nestjs.com/techniques/task-scheduling for more info
  //and: standard cron patterns here: http://crontab.org/

  // '*/10 * * * *' ,  //ten minutes between runs, and runs on the zero second.
  // '*/2 * * * *'  ,  //two minutes between runs, and runs on the zero second.
  // '10 10 * * * *',  // run on the tenth minute and tenth second, every hour
  // '10 * * * * *' ,  // run on tenth second every minute
  @Cron(
    '30 0 * * * *',  // run on the thirtieth second and on the zero minute, every hour
    {
      name: 'TaskXRoadCollector',
    },
  )
  TaskXRoadCollector() {
    this.logger.debug('Running job TaskXRoadCollector')

    const options = {
      url: 'http://localhost:3333/api/collector/index/rest',
      timeout: 10000,
    }
    const debugLogger = this.logger
    request(options, function(error) {
      if (error?.code === 'ESOCKETTIMEDOUT') {
        debugLogger.debug('TaskXRoadCollector called, but no response api collector.')
      }
    })
  }
}
