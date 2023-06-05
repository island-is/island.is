import { FieldBaseProps } from '@island.is/application/types'
import {
  AlertMessage,
  GridColumn,
  GridContainer,
  LinkV2,
  Text,
} from '@island.is/island-ui/core'
import { FC } from 'react'
import * as styles from './InformationBoxWithLink.css'
import Markdown from 'markdown-to-jsx'
import { useIntl } from 'react-intl'
import DescriptionText from '../../components/DescriptionText'

interface InformationBoxWithLinkProps {
  field: {
    props: {
      title: string
      message?: any
      linkTitle: string
      linkUrl: string
    }
  }
}

export const InformationBoxWithLink: FC<
  InformationBoxWithLinkProps & FieldBaseProps
> = ({ field }) => {
  const { formatMessage } = useIntl()
  const linkTitle = field?.props?.linkTitle
  const linkUrl = field?.props?.linkUrl
  const title = field?.props?.title
  const message = field?.props?.message

  const messageComponent = (
    <GridContainer>
      <GridColumn>
        <DescriptionText text={message} textProps={{ variant: 'small' }} />
      </GridColumn>
      <GridColumn>
        <LinkV2
          href={linkUrl}
          color="blue400"
          underline="normal"
          underlineVisibility="always"
          className={styles.link}
        >
          {linkTitle}
        </LinkV2>
      </GridColumn>
    </GridContainer>
  )

  return <AlertMessage type="info" title={title} message={messageComponent} />
}
