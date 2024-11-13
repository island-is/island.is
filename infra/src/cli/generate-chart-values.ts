import { renderEnv } from './render-env'
import { ChartName, Deployments, Charts } from '../uber-charts/all-charts'
import { writeFileSync, mkdirSync } from 'fs'
import { Envs } from '../environments'
import { OpsEnv } from '../dsl/types/input-types'
import path from 'path'
;(async () => {
  console.log('Gathering charts')
  for (const [name, envs] of Object.entries(Deployments)) {
    for (const [envType, envName] of Object.entries(envs)) {
      console.log(`Processing ${name} ${envName} ${envType}`)

      // Get the rendered environment values
      const renderedValues = await renderEnv(
        envType as OpsEnv,
        name as ChartName,
      )

      // Ensure umbrella chart directory exists and write values
      const umbrellaDir = path.join(__dirname, '/../../../charts', name)
      mkdirSync(umbrellaDir, { recursive: true })
      writeFileSync(
        path.join(umbrellaDir, `values.${Envs[envName].type}.yaml`),
        renderedValues,
        { encoding: 'utf8' },
      )

      // Get services for this chart and environment
      const services = Charts[name as ChartName][envType as OpsEnv]

      // Write individual service values files
      for (const service of services) {
        const serviceName = service.name()
        const serviceDir = path.join(
          __dirname,
          '/../../../charts/services',
          serviceName,
        )
        mkdirSync(serviceDir, { recursive: true })

        // Create service-specific values by isolating just that service's section
        const serviceValues = {
          [serviceName]: service,
        }

        writeFileSync(
          path.join(serviceDir, `values.${Envs[envName].type}.yaml`),
          JSON.stringify(serviceValues, null, 2), // or however you format your YAML
          { encoding: 'utf8' },
        )
      }
    }
  }
})()
