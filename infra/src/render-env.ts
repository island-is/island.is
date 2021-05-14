import { generateYamlForEnv, dumpYaml } from './dsl/serialize-to-yaml'
import { OpsEnv } from './dsl/types/input-types'
import { UberChart } from './dsl/uber-chart'
import { Envs } from './environments'
import { Services as ISServices } from './uber-charts/islandis'
import { Services as JSServices } from './uber-charts/judicial-system'
import { Services as ADSServices } from './uber-charts/air-discount-scheme'
import yargs = require('yargs/yargs')
import { EnvironmentServices } from './dsl/types/charts'

type ChartName = 'islandis' | 'judicial-system' | 'air-discount-scheme'

const charts: { [name in ChartName]: EnvironmentServices } = {
  islandis: ISServices,
  'judicial-system': JSServices,
  'air-discount-scheme': ADSServices,
}

const argv = yargs(process.argv.slice(2)).options({
  env: { choices: ['dev', 'staging', 'prod'] },
  chart: {
    choices: ['islandis', 'judicial-system', 'air-discount-scheme'],
  },
})

const env = argv.argv.env as OpsEnv
const chart = argv.argv.chart as ChartName

console.log(
  dumpYaml(generateYamlForEnv(new UberChart(Envs[env]), ...charts[chart][env])),
)
