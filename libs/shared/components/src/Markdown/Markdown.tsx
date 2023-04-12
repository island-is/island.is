import { compiler } from 'markdown-to-jsx'
import { markdownOptions } from './markdownOptions'

interface Props {
  children: string
}

export const Markdown = ({ children }: Props) =>
  compiler(children, markdownOptions)

export default Markdown
