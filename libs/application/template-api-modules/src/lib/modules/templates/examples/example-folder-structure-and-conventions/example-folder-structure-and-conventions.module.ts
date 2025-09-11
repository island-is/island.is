import { Module } from '@nestjs/common'

import { SharedTemplateAPIModule } from '../../../shared'

import { ExampleFolderStructureAndConventionsService } from './example-folder-structure-and-conventions.service'
import { ApplicationsNotificationsModule } from '../../../../notification/notifications.module'
@Module({
  imports: [SharedTemplateAPIModule, ApplicationsNotificationsModule],
  providers: [ExampleFolderStructureAndConventionsService],
  exports: [ExampleFolderStructureAndConventionsService],
})
export class ExampleFolderStructureAndConventionsModule {}
