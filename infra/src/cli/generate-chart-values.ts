import { renderEnv } from './render-env'
import { OpsEnvName } from '../dsl/types/charts'
import { ChartName } from '../uber-charts/all-charts'
import { writeFileSync } from 'fs'
import { Envs } from '../environments'

// this is to render all chart values

const deployments: { [name in ChartName]: OpsEnvName[] } = {
  'judicial-system': ['dev01', 'staging01', 'prod'],
  islandis: ['dev01', 'staging01', 'prod'],
  'identity-server': ['dev01', 'staging01', 'prod-ids'],
}
for (const [name, envs] of Object.entries(deployments)) {
  for (const env of envs) {
    writeFileSync(
      `${__dirname}/../../../charts/${name}/values.${Envs[env].type}.yaml`,
      renderEnv(env, name as ChartName),
      { encoding: 'utf8' },
    )
  }
}
