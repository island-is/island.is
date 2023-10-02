import { Document } from '../../../../types/interfaces'
import { Icon, LinkV2, Tooltip } from '@island.is/island-ui/core'
import env from '../../../../lib/environment'
import { isDocumentLink, renderDocFileName } from '../../utils'
import localization from '../../Case.json'
import * as styles from './DocFileName.css'

interface Props {
  doc: Document
  isAdvice?: boolean
}

const DocFileName = ({ doc, isAdvice = false }: Props) => {
  const loc = localization['caseDocuments']
  const isLink = isDocumentLink(doc)
  const icon = isLink ? 'link' : 'document'
  const iconTitle = isLink ? loc.linkTitle : loc.documentTitle
  const linkHref = isLink ? doc.link : `${env.backendDownloadUrl}${doc.id}`
  const fileNameOrDesc = doc.description ? doc.description : doc.fileName
  const downloadName = isLink
    ? fileNameOrDesc
      ? fileNameOrDesc
      : doc.link
    : fileNameOrDesc
  const name = isAdvice ? doc.fileName : downloadName

  const linkDesc = renderDocFileName({
    name: name,
    isAdvice: isAdvice,
  })

  return (
    <LinkV2
      href={linkHref}
      color="blue400"
      underline="normal"
      underlineVisibility="always"
      newTab
    >
      <>
        <Tooltip placement="right" as="span" text={name} fullWidth>
          <span>{linkDesc}</span>
        </Tooltip>
        <Icon
          size="small"
          icon={icon}
          type="outline"
          className={styles.iconStyle}
          title={iconTitle}
        />
      </>
    </LinkV2>
  )
}

export default DocFileName
