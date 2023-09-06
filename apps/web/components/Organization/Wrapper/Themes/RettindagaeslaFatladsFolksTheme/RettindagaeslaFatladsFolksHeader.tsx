import { OrganizationPage } from '@island.is/web/graphql/schema'

interface Props {
  organizationPage: OrganizationPage
}

const RettindagaeslaFatladsFolksHeader = ({ organizationPage }: Props) => {
  return <p>Réttindagæsla Fatlaðs Fólks</p>
}

export default RettindagaeslaFatladsFolksHeader
