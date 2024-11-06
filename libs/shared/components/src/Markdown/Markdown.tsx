import { compiler } from 'markdown-to-jsx'
import { getMarkdownOptions } from './markdownOptions'

interface Props {
  children: string,
  options?: OptionalOverrides
}

export interface OptionalOverrides {
  openLinksInNewTab?: boolean,
  hehe?: number
}

const defaultOptionalOverrides: OptionalOverrides = {
  openLinksInNewTab: true,
  hehe: 5
}

export const Markdown = ({ children, options }: Props) => {
  const optionalConditionals = { ...defaultOptionalOverrides, ...options }
  return compiler(children, getMarkdownOptions(optionalConditionals))
}

export default Markdown
