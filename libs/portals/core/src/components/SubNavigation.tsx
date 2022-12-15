import { useIntl } from 'react-intl'
import { useNavigation } from '../hooks/useNavigation'
import { PortalNavigationItem } from '../types/portalCore'
import { useModules } from './ModulesProvider'

export const SubNavigation = () => {
  const { formatMessage } = useIntl()
  const navigation = useNavigation()
  const { activeModule } = useModules()

  const moduleNavigation = navigation?.children?.find(
    // TODO find better matching of activeModule and filtered navigation.
    // Either we add id property to the module and navigation or we execute
    // activeModule.routes() and math the path.
    ({ name }) => name === activeModule?.name,
  )

  const renderLinks = ({ name, path }: PortalNavigationItem, index: number) => (
    <li key={index} style={{ padding: '0.5rem' }}>
      <a href={path}>{typeof name === 'string' ? name : formatMessage(name)}</a>
    </li>
  )

  return (
    <ul style={{ borderRight: '1px solid red', width: 400 }}>
      {moduleNavigation?.children?.map((child, index) => (
        <>
          {renderLinks(child, index)}
          <div style={{ marginLeft: 30 }}>
            {child.children?.map(renderLinks)}
          </div>
          <hr />
        </>
      ))}
    </ul>
  )
}
