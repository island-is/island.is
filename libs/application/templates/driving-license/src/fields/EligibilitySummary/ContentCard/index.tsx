import { BulletList, Bullet, ActionCard } from '@island.is/island-ui/core'
import { formatText, getValueViaPath } from '@island.is/application/core'
import {
  CustomField,
  FieldBaseProps,
  StaticText,
} from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import { MessageDescriptor } from '@formatjs/intl'
import { Application } from '@island.is/application/types'

export interface Content {
  title: MessageDescriptor
  description: MessageDescriptor
  tag?: string
}

type ContentCardProps = {
  application: Application
  content: Content
}

const ContentCard = ({
  application,
  content: { title, description, tag },
}: ContentCardProps) => {
  const { formatMessage } = useLocale()

  return (
    <ActionCard
      heading={formatText(title, application, formatMessage)}
      headingVariant="h3"
      text={formatText(description, application, formatMessage)}
      tag={tag ? { label: tag } : undefined}
      cta={{
        label: '',
        disabled: true,
      }}
    />
  )
}

export { ContentCard }
