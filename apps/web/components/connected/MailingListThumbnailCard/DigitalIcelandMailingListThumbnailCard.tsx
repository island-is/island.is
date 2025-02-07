import type { ConnectedComponent } from '@island.is/web/graphql/schema'
import { useI18n } from '@island.is/web/i18n'

import { MailingListThumbnailCard } from './MailingListThumbnailCard'

interface DigitalIcelandMailingListThumbnailCardProps {
  slice: ConnectedComponent
}

export const DigitalIcelandMailingListThumbnailCard = ({
  slice,
}: DigitalIcelandMailingListThumbnailCardProps) => {
  const { activeLocale } = useI18n()

  const headingText =
    slice.json?.headingText ?? activeLocale === 'is'
      ? 'Fylgstu með því nýjasta'
      : 'Subscribe'
  const descriptionText =
    slice.json?.descriptionText ?? activeLocale === 'is'
      ? 'Skráðu þig á póstlista Stafræns Íslands og fylgstu með því nýjasta í stafrænni opinberri þjónustu.'
      : 'Sign up for the Digital Iceland mailing list and stay up to date with the latest in digital public services.'
  const linkHref = slice.json?.linkHref
  const linkLabel =
    slice.json?.linkLabel ?? activeLocale === 'is'
      ? 'Skrá mig á póstlista'
      : 'Subscribe to mailing list'

  return (
    <MailingListThumbnailCard
      headingText={headingText}
      descriptionText={descriptionText}
      linkHref={linkHref}
      linkLabel={linkLabel}
    />
  )
}
