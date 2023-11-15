import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { IntroHeader } from '@island.is/portals/core'
import { m } from '../../lib/messages'

const SignatureLists = () => {
  const { formatMessage } = useLocale()

  return (
    
      <IntroHeader
        title={formatMessage(m.pageTitle)}
        intro={formatMessage(m.pageDescription)}
      >
      </IntroHeader>
  )
}

export default SignatureLists
