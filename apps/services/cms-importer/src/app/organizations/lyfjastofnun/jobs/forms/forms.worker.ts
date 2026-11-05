import { parseCliFlags, runWorker } from '../../../../utils'
import { LyfjastofnunFormsImportModule } from './forms.module'
import { LyfjastofnunFormsImportService } from './forms.service'

export const lyfjastofnunFormsImportWorker = () => {
  const { publish, limit } = parseCliFlags()
  return runWorker(
    'Lyfjastofnun forms import',
    LyfjastofnunFormsImportModule,
    (app) => app.get(LyfjastofnunFormsImportService).run({ publish, limit }),
  )
}
