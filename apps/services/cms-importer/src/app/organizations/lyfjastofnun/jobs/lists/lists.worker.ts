import { parseCliFlags, runWorker } from '../../../../utils'
import { LyfjastofnunListsImportModule } from './lists.module'
import { LyfjastofnunListsImportService } from './lists.service'

export const lyfjastofnunListsImportWorker = () => {
  const { publish, limit } = parseCliFlags()
  return runWorker('Lyfjastofnun lists import', LyfjastofnunListsImportModule, (app) =>
    app.get(LyfjastofnunListsImportService).run({ publish, limit }),
  )
}
