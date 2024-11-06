import { compiler } from 'markdown-to-jsx'
import { getMarkdownOptions } from './markdownOptions'

interface Props {
  children: string
  conditionals?: OptionalConditionalOverrides
}

export interface OptionalConditionalOverrides {
  openLinksInNewTab?: boolean
  hehe?: number
}

const defaultOptionalOverrides: OptionalConditionalOverrides = {
  openLinksInNewTab: true,
  hehe: 5,
}

export const Markdown = ({ children, conditionals }: Props) => {
  const optionalConditionals = { ...defaultOptionalOverrides, ...conditionals }
  return compiler(children, getMarkdownOptions(optionalConditionals))
}

export default Markdown
