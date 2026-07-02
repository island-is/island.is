import { FC } from 'react'

import * as styles from './HtmlContent.css'

interface Props {
  html: string
}

const HtmlContent: FC<Props> = ({ html }) => (
  <div className={styles.root} dangerouslySetInnerHTML={{ __html: html }} />
)

export default HtmlContent
