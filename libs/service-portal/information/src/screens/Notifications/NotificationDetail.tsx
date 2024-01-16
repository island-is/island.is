import { useLocale, useNamespaces } from '@island.is/localization'
import { IntroHeader, m, SYSLUMENN_SLUG } from '@island.is/service-portal/core'
import { useParams } from 'react-router-dom'

const UserNotifications = () => {
  useNamespaces('sp.notifications')
  const { formatMessage } = useLocale()

  const { id } = useParams()

  return (
    <IntroHeader
      title="Tilkynning"
      intro={`${id} - Lorem ipsum dolor sit amet consectetur. Sapien diam egestas amet consequat sed. Leo ut suspendisse eu sem auctor tellus netus praesent. Non blandit vitae id varius porttitor. Ullamcorper et ullamcorper blandit nunc a nam natoque lorem. Felis scelerisque id condimentum fames tempor leo pretium urna. Enim pharetra bibendum nisi nunc semper augue venenatis libero fringilla. Eget non mi ac habitant morbi ullamcorper urna sed. Velit mattis mollis erat dolor sit lacinia nisi. Ullamcorper egestas pharetra turpis massa a enim id arcu dolor.`}
      serviceProviderSlug={SYSLUMENN_SLUG}
      serviceProviderTooltip={formatMessage(m.tjodskraTooltip)}
    />
  )
}
export default UserNotifications
