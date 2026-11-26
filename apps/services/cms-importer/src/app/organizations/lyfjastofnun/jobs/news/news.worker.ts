import { readNewsImageAssignments } from '../../../../platform/news-images'
import { parseCliFlags, runWorker } from '../../../../utils'
import { LyfjastofnunNewsImportModule } from './news.module'
import { LyfjastofnunNewsImportService } from './news.service'

export const lyfjastofnunNewsImportWorker = () => {
  const { publish, slug, months, limit } = parseCliFlags()
  return runWorker(
    'Lyfjastofnun news import',
    LyfjastofnunNewsImportModule,
    async (app) => {
      const imageAssetIdsBySlug = await readNewsImageAssignments()
      await app.get(LyfjastofnunNewsImportService).run({
        publish,
        slug,
        months,
        limit,
        imageAssetIdsBySlug,
      })
    },
  )
}
