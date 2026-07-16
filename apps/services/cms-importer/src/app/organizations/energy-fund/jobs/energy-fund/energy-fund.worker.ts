import { runWorker } from '../../../../utils'
import { EnergyFundImportModule } from './energy-fund.module'
import { EnergyFundImportService } from './energy-fund.service'

export const energyFundWorker = () =>
  runWorker('Energy fund import', EnergyFundImportModule, (app) =>
    app.get(EnergyFundImportService).run(),
  )
