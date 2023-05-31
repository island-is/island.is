import { Icon, Inline, LinkV2 } from '@island.is/island-ui/core'
import { Document } from '../../../../types/interfaces'
import env from '../../../../lib/environment'
import localization from '../../Case.json'
import * as styles from './CaseDocumentsSkeleton.css'
import { isDocumentLink } from '../../utils'

interface Props {
  document: Document
}

const CaseDocumentsSkeleton = ({ document }: Props) => {
  const isLink = isDocumentLink(document)
  const loc = localization['caseDocuments']
  const icon = isLink ? 'link' : 'document'
  const iconTitle = isLink ? loc.linkTitle : loc.documentTitle
  const linkHref = isLink
    ? document.link
    : `${env.backendDownloadUrl}${document.id}`
  const linkDesc = isLink ? document.description : document.fileName

  return (
    <Inline space={1} flexWrap="nowrap">
      <Icon
        icon={icon}
        size="small"
        title={iconTitle}
        color="blue400"
        className={styles.iconStyle}
      />
      <LinkV2
        href={linkHref}
        color="blue400"
        underline="normal"
        underlineVisibility="always"
      >
        {linkDesc}
      </LinkV2>
    </Inline>
  )
}

export default CaseDocumentsSkeleton
