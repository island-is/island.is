import { FC } from 'react'

import { sanitizeRichTextHtml } from '@island.is/judicial-system/formatters'

import * as styles from './HtmlContent.css'

interface Props {
  html: string
}

const HtmlContent: FC<Props> = ({ html }) => (
  <div
    className={styles.root}
    dangerouslySetInnerHTML={{ __html: sanitizeRichTextHtml(html) }}
  />
)

export default HtmlContent
