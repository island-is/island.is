import yaml, { Scalar, visit } from 'yaml'
import type { ToStringOptions } from 'yaml'

const yamlOptions: ToStringOptions = {
  defaultStringType: 'QUOTE_SINGLE',
  defaultKeyType: 'PLAIN',
  lineWidth: 0,
}

export const serializeChartYaml = (content: unknown): string => {
  const document = new yaml.Document()
  document.contents = document.createNode(content)

  visit(document, {
    Scalar(_key, node) {
      if (
        typeof node.value === 'string' &&
        node.value.includes("'") &&
        !node.value.includes('"')
      ) {
        node.type = Scalar.QUOTE_DOUBLE
      }
    },
  })

  return document.toString(yamlOptions)
}
