import { compiler } from 'markdown-to-jsx'
import { getMarkdownOptions } from './markdownOptions'

interface Props {
  children: string
  options?: OptionalOverrides
}

export interface OptionalOverrides {
  openLinksInNewTab?: boolean
}

const defaultOptionalOverrides: OptionalOverrides = {
  openLinksInNewTab: true,
}

export const Markdown = ({ children, options }: Props) => {
  const optionalConditionals = { ...defaultOptionalOverrides, ...options }
  return compiler(children, getMarkdownOptions(optionalConditionals))
}

export default Markdown
