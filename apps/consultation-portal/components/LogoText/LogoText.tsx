import { Text } from '@island.is/island-ui/core'
import localization from './LogoText.json'

type Props = {
  isFooter?: boolean
}

const LogoText = ({ isFooter = false }: Props) => {
  const loc = localization['logoText']
  return (
    <Text variant={isFooter ? 'h2' : 'h1'} color="blue400">
      {loc.title}
    </Text>
  )
}

export default LogoText
