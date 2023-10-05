import { Text } from '@island.is/island-ui/core'
import localization from './LogoText.json'

type Props = {
  isSmall?: boolean
}

const LogoText = ({ isSmall = false }: Props) => {
  const loc = localization['logoText']
  return <Text variant={isSmall ? 'h2' : 'h1'}>{loc.title}</Text>
}

export default LogoText
