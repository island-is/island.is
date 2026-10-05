import { definePluginConfig, tsc } from '@hey-api/openapi-ts'
import type { DefinePlugin } from '@hey-api/openapi-ts'

import { operationKey, toResponseBodies } from './responseBodies'

type ResponseBodiesPlugin = DefinePlugin<{
  exportFromIndex?: boolean
  name: 'response-bodies'
  output?: string
}>

const handler: ResponseBodiesPlugin['Handler'] = ({ plugin }) => {
  const responseBodies: Record<string, Record<string, boolean>> = {}

  plugin.forEach('operation', ({ method, operation, path }) => {
    responseBodies[operationKey(method, path)] = toResponseBodies(
      operation.responses ?? {},
    )
  })

  const symbol = plugin.registerSymbol({
    exported: true,
    getFilePath: () => plugin.output,
    name: 'responseBodies',
  })
  plugin.setSymbolValue(
    symbol,
    tsc.constVariable({
      assertion: 'const',
      exportConst: symbol.exported,
      expression: tsc.objectExpression({ obj: responseBodies }),
      name: symbol.placeholder,
    }),
  )
}

/**
 * openapi-ts plugin that writes `responseBodies.gen.ts`, the {@link ResponseBodies} of the
 * document, for {@link requireResponseBodies} to check empty 2xx responses against.
 *
 * Not exported from the library: it is build tooling, imported by path from an
 * `openapi-ts.config.ts` because the openapi-ts CLI does not resolve workspace aliases.
 */
export const defineResponseBodiesPlugin = definePluginConfig<
  ResponseBodiesPlugin['Types']
>({
  config: {},
  handler,
  name: 'response-bodies',
  output: 'responseBodies',
})
