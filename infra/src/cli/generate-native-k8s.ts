import { renderKubeEnv } from './render-env'
import { ChartName, Deployments } from '../uber-charts/all-charts'
import { writeFileSync } from 'fs'
import { Envs } from '../environments'
import { OpsEnv } from '../dsl/types/input-types'
;(async () => {
  for (const [name, envs] of Object.entries(Deployments)) {
    for (const [envType, envName] of Object.entries(envs)) {
      writeFileSync(
        `${__dirname}/../../../k8s-manifests/${name}/${Envs[envName].type}/deployments.yaml`,
        await renderKubeEnv(envType as OpsEnv, name as ChartName),
        { encoding: 'utf8' },
      )
    }
  }
})()
