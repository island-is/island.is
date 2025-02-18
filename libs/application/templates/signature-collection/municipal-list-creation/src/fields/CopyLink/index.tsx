import { useLocale } from '@island.is/localization'
import { CopyLink as Copy } from '@island.is/application/ui-components'
import { m } from '../../lib/messages'
import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'

export const CopyLink: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const { slug } =
    (application.externalData.submit?.data as { slug: string }) ?? ''

  return (
    <Copy
      linkUrl={`${document.location.origin}${slug}`}
      buttonTitle={formatMessage(m.copyLink)}
    />
  )
}

export default CopyLink
