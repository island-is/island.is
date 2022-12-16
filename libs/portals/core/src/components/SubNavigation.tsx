import { useIntl } from 'react-intl'
import { useNavigation } from '../hooks/useNavigation'
import { PortalNavigationItem } from '../types/portalCore'

interface SubNavigationProps {
  navigation: PortalNavigationItem
}

export const SubNavigation = ({ navigation }: SubNavigationProps) => {
  const { formatMessage } = useIntl()
  const nav = useNavigation(navigation)

  const renderLinks = ({ name, path }: PortalNavigationItem, index: number) => (
    <li key={index} style={{ padding: '0.5rem' }}>
      <a href={path}>{typeof name === 'string' ? name : formatMessage(name)}</a>
    </li>
  )

  return (
    <ul style={{ borderRight: '1px solid red', width: 400 }}>
      {nav?.children?.map((child, index) => (
        <div key={index}>
          {renderLinks(child, index)}
          <div style={{ marginLeft: 30 }}>
            {child.children?.map(renderLinks)}
          </div>
          <hr />
        </div>
      ))}
    </ul>
  )
}
