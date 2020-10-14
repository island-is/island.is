function defaultTemplate(
  { template },
  opts,
  { imports, componentName, props, jsx, exports },
) {
  const plugins = ['jsx', 'typescript']
  const typeScriptTpl = template.smart({ plugins })
  return typeScriptTpl.ast`${imports}
import { SvgProps as SVGRProps } from '../Icon'
const ${componentName} = (${props}) => {
  return ${jsx};
}
${exports}
  `
}
module.exports = defaultTemplate
