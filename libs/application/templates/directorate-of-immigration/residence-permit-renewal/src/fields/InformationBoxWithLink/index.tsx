import { FieldBaseProps } from '@island.is/application/types'
import { AlertMessage, GridContainer, LinkV2 } from '@island.is/island-ui/core'
import { FC } from 'react'
import * as styles from './InformationBoxWithLink.css'
import { MessageDescriptor } from 'react-intl'
import DescriptionText from '../../components/DescriptionText'
import { useLocale } from '@island.is/localization'

interface InformationBoxWithLinkProps {
  field: {
    props: {
      title: MessageDescriptor
      message: MessageDescriptor
      linkTitle: MessageDescriptor
      linkUrl: MessageDescriptor
    }
  }
}

export const InformationBoxWithLink: FC<
  InformationBoxWithLinkProps & FieldBaseProps
> = ({ field }) => {
  const { formatMessage } = useLocale()
  const linkTitle = formatMessage(field?.props?.linkTitle)
  const linkUrl = formatMessage(field?.props?.linkUrl)
  const title = formatMessage(field?.props?.title)

  const messageComponent = (
    <GridContainer>
      <DescriptionText
        text={field?.props?.message}
        textProps={{ variant: 'small' }}
      />

      <LinkV2
        href={linkUrl}
        color="blue400"
        underline="normal"
        underlineVisibility="always"
        className={styles.link}
      >
        {linkTitle}
      </LinkV2>
    </GridContainer>
  )

  return <AlertMessage type="info" title={title} message={messageComponent} />
}
