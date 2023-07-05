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
  const fileNameOrDesc = isLink ? doc.description : doc.fileName
  const linkDesc = renderDocFileName({
    name: fileNameOrDesc,
    isAdvice: isAdvice,
  })

  return (
    <Tooltip placement="right" as="span" text={fileNameOrDesc} fullWidth>
      <span>
        <LinkV2
          href={linkHref}
          color="blue400"
          underline="normal"
          underlineVisibility="always"
          newTab
        >
          {linkDesc}
          <Icon
            size="small"
            icon={icon}
            type="outline"
            className={styles.iconStyle}
            title={iconTitle}
          />
        </LinkV2>
      </span>
    </Tooltip>
  )
}

export default DocFileName
