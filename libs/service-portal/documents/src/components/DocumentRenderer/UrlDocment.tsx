import { Button, LinkV2 } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/service-portal/core'
import { useEffect } from 'react'
type UrlDocumentProps = {
  url: string
}

export const UrlDocument: React.FC<UrlDocumentProps> = ({ url }) => {
  const { formatMessage } = useLocale()

  // open the document directly to save user 1 click
  useEffect(() => {
    window.open(url, '_blank')
  }, [])

  return (
    <Button variant="utility" icon="open" iconType="outline">
      <LinkV2 href={url} newTab>
        {formatMessage(m.getDocument)}
      </LinkV2>
    </Button>
  )
}
