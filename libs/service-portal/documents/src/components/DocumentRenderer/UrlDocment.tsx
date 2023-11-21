import { Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { LinkResolver, m } from '@island.is/service-portal/core'
type UrlDocumentProps = {
  url: string
}

export const UrlDocument: React.FC<UrlDocumentProps> = ({ url }) => {
  const { formatMessage } = useLocale()

  return (
    <LinkResolver href={url}>
      <Button
        as="span"
        variant="utility"
        icon="open"
        iconType="outline"
        unfocusable
      >
        {formatMessage(m.getDocument)}
      </Button>
    </LinkResolver>
  )
}
