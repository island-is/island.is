import { parseCliFlags, runWorker } from '../../../../utils'
import { RskTreatiesImportModule } from './treaties.module'
import { RskTreatiesImportService } from './treaties.service'

export const rskTreatiesImportWorker = () => {
  const { limit } = parseCliFlags()
  return runWorker('RSK treaties import', RskTreatiesImportModule, (app) =>
    app.get(RskTreatiesImportService).run({ limit }),
  )
}
