import { parseCliFlags, runWorker } from '../../../../utils'
import { LyfjastofnunInstructionsImportModule } from './instructions.module'
import { LyfjastofnunInstructionsImportService } from './instructions.service'

export const lyfjastofnunInstructionsImportWorker = () => {
  const { publish, limit } = parseCliFlags()
  return runWorker(
    'Lyfjastofnun instructions import',
    LyfjastofnunInstructionsImportModule,
    (app) =>
      app.get(LyfjastofnunInstructionsImportService).run({ publish, limit }),
  )
}
