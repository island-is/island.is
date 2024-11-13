import { renderEnv } from './render-env'
import { ChartName, Deployments, Charts } from '../uber-charts/all-charts'
import { writeFileSync, mkdirSync } from 'fs'
import { Envs } from '../environments'
import { OpsEnv } from '../dsl/types/input-types'
import path from 'path'
import yaml from 'yaml'
import type { ToStringOptions } from 'yaml'

const yamlOptions: ToStringOptions = {
  defaultStringType: 'QUOTE_SINGLE',
  defaultKeyType: 'PLAIN',
}

// Recursive function to filter out empty string properties
const removeEmptyStringProperties = (obj: any): any => {
  if (typeof obj !== 'object' || obj === null) return obj

  if (Array.isArray(obj)) {
    return obj.map(removeEmptyStringProperties)
  }

  return Object.fromEntries(
    Object.entries(obj)
      .filter(([_, value]) => value !== '') // Filter out empty strings
      .map(([key, value]) => [key, removeEmptyStringProperties(value)]), // Recursively apply to nested objects
  )
}

const writeYamlFile = (filePath: string, content: unknown) => {
  const filteredContent = removeEmptyStringProperties(content)
  const doc = new yaml.Document()
  doc.contents = doc.createNode(filteredContent, { keepUndefined: false })

  mkdirSync(path.dirname(filePath), { recursive: true })
  writeFileSync(filePath, doc.toString(yamlOptions), { encoding: 'utf8' })
}

async function generateChartValues() {
  console.log('Gathering charts')

  for (const [name, envs] of Object.entries(Deployments)) {
    for (const [envType, envName] of Object.entries(envs)) {
      console.log(`Processing ${name} ${envName} ${envType}`)

      // Get rendered environment values and parse
      const renderedYaml = await renderEnv(envType as OpsEnv, name as ChartName)
      const renderedValues = yaml
        .parseDocument(renderedYaml, { schema: 'json' })
        .toJSON()

      // Write umbrella chart values
      writeYamlFile(
        path.join(
          __dirname,
          '/../../../charts',
          name,
          `values.${Envs[envName].type}.yaml`,
        ),
        renderedValues,
      )

      // Write individual service values
      const services = Charts[name as ChartName][envType as OpsEnv]
      for (const service of services) {
        const serviceName = service.name()
        if (renderedValues[serviceName]) {
          const serviceValues = {
            service: {
              name: serviceName,
              ...renderedValues[serviceName],
            },
          }

          writeYamlFile(
            path.join(
              __dirname,
              '/../../../charts/services',
              serviceName,
              `values.${Envs[envName].type}.yaml`,
            ),
            serviceValues,
          )
        }
      }
    }
  }
}

generateChartValues().catch(console.error)
