import { renderEnv } from './render-env'
import { ChartName, Deployments } from '../uber-charts/all-charts'
import { writeFileSync } from 'fs'
import { Envs } from '../environments'
import { OpsEnv } from '../dsl/types/input-types'

// this is to render all chart values
;(async () => {
  for (const [name, envs] of Object.entries(Deployments)) {
    for (const [envType, envName] of Object.entries(envs)) {
      writeFileSync(
        `${__dirname}/../../../charts/${name}/values.${Envs[envName].type}.yaml`,
        await renderEnv(envType as OpsEnv, name as ChartName),
        { encoding: 'utf8' },
      )
    }
  }
})()
