import { parseCliFlags, runWorker } from '../../../../utils'
import { LyfjastofnunNewsImportModule } from './news.module'
import { LyfjastofnunNewsImportService } from './news.service'

export const lyfjastofnunNewsImportWorker = () => {
  const { publish, slug, months, limit } = parseCliFlags()
  return runWorker(
    'Lyfjastofnun news import',
    LyfjastofnunNewsImportModule,
    (app) =>
      app
        .get(LyfjastofnunNewsImportService)
        .run({ publish, slug, months, limit }),
  )
}
