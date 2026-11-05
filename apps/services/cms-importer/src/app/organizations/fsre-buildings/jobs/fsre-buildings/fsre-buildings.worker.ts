import { runWorker } from '../../../../utils'
import { FSREBuildingsImportModule } from './fsre-buildings.module'
import { FSREBuildingsImportService } from './fsre-buildings.service'

export const fsreBuildingsWorker = () =>
  runWorker('Cms FSRE buildings import', FSREBuildingsImportModule, (app) =>
    app.get(FSREBuildingsImportService).run(),
  )
