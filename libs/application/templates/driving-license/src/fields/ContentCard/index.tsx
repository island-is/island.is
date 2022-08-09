import { BulletList, Bullet, ActionCard } from '@island.is/island-ui/core'
import { formatText, getValueViaPath } from '@island.is/application/core'
import {
  CustomField,
  FieldBaseProps,
  StaticText,
} from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'

const ContentCard = ({ application, field }: FieldBaseProps) => {
  const { formatMessage } = useLocale()
  const currentLicense = getValueViaPath<string | null>(
    application.externalData,
    'currentLicense.data.currentLicense',
  )
  const heading =
    currentLicense === 'B'
      ? 'Bráðabirgða'
      : currentLicense === 'B-full'
      ? 'Fullnaðar'
      : 'Engin'

  const text =
    getValueViaPath<string | null>(
      application.externalData,
      'currentLicense.data.currentLicense',
    ) === 'B'
      ? 'Almenn ökuréttindi - B flokkur (fólksbifreið)'
      : 'Engin'
  return (
    <ActionCard
      heading={heading}
      headingVariant="h3"
      text={currentLicense ? formatMessage(m.drivingLicenseB) : undefined}
      //   tag={tag}
      cta={{
        label: '',
        disabled: true,
      }}
    />
  )
}

export { ContentCard }
