import { renderEnv } from './render-env'
import { ChartName, Deployments, Charts } from '../uber-charts/all-charts'
import { writeFileSync, mkdirSync } from 'fs'
import { Envs } from '../environments'
import { OpsEnv } from '../dsl/types/input-types'
import path from 'path'
import yaml from 'yaml'
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

      // Parse the rendered YAML
      const parsedValues = yaml.parse(renderedValues)

      // Write individual service values files
      for (const service of services) {
        const serviceName = service.name()
        const serviceDir = path.join(
          __dirname,
          '/../../../charts/services',
          serviceName,
        )
        mkdirSync(serviceDir, { recursive: true })

        // Extract just this service's section and restructure it
        if (parsedValues[serviceName]) {
          const serviceValues = {
            service: {
              name: serviceName,
              ...parsedValues[serviceName],
            },
          }

          writeFileSync(
            path.join(serviceDir, `values.${Envs[envName].type}.yaml`),
            yaml.stringify(serviceValues),
            { encoding: 'utf8' },
          )
        }
      }
    }
  }
})()
