import React, { FC, useState } from 'react'
import { UserWithMeta, ActionSidebar } from '@island.is/service-portal/core'
import { Box, Button } from '@island.is/island-ui/core'
import InfoAccordionCard from '../../../components/InfoAccordionCard/InfoAccordionCard'
import ExternalFormDirect from '../../../components/forms/ExternalFormDirect/ExternalFormDirect'

interface Props {
  userInfo: UserWithMeta
}

type SidebarType =
  | null
  | 'name'
  | 'religiousOrg'
  | 'legalDomicile'
  | 'islandInfo'
  | 'islandAuthInfo'

const UserInfoCard: FC<Props> = ({ userInfo }) => {
  const [activeSidebar, setActiveSidebar] = useState<SidebarType>(null)

  const handleSetActiveSidebar = (value: SidebarType) => setActiveSidebar(value)

  return (
    <>
      <InfoAccordionCard
        id="basic-user-info"
        label="Þínar upplýsingar"
        description="Hér getur þú breytt þínum upplýsingum. "
        rows={[
          {
            columns: [
              { content: 'Nafn' },
              { content: userInfo.user.profile.name },
              {
                render: () => (
                  <Box textAlign="right">
                    <Button
                      variant="menu"
                      size="small"
                      onClick={handleSetActiveSidebar.bind(null, 'name')}
                    >
                      Breyta nafni
                    </Button>
                  </Box>
                ),
              },
            ],
          },
          {
            columns: [
              { content: 'Kennitala' },
              { content: userInfo.user.profile.natreg },
            ],
          },
          {
            columns: [
              { content: 'Ríkisfang' },
              {
                content:
                  userInfo.user.profile.nat === 'IS'
                    ? 'Ísland'
                    : userInfo.user.profile.nat,
              },
            ],
          },
          {
            columns: [
              { content: 'Trúfélag / lífsskoðunarfélag' },
              { content: 'RSK?' },
              {
                render: () => (
                  <Box
                    textAlign="right"
                    onClick={handleSetActiveSidebar.bind(null, 'religiousOrg')}
                  >
                    <Button variant="menu" size="small">
                      Breyta um trúfélag
                    </Button>
                  </Box>
                ),
              },
            ],
          },
          {
            columns: [
              { content: 'Lögheimili' },
              { content: 'RSK?' },
              {
                render: () => (
                  <Box
                    textAlign="right"
                    onClick={handleSetActiveSidebar.bind(null, 'legalDomicile')}
                  >
                    <Button variant="menu" size="small">
                      Flytja lögheimili
                    </Button>
                  </Box>
                ),
              },
            ],
          },
          {
            columns: [
              { content: 'Netfang, farsími og hnipp' },
              { content: 'innskraning.island.is?' },
              {
                render: () => (
                  <Box
                    textAlign="right"
                    onClick={handleSetActiveSidebar.bind(null, 'islandInfo')}
                  >
                    <Button variant="menu" size="small">
                      Breyta upplýsingum
                    </Button>
                  </Box>
                ),
              },
            ],
          },
          {
            columns: [
              { content: 'Íslykill, bankaupplýsingar og innskráning' },
              { content: 'innskraning.island.is?' },
              {
                render: () => (
                  <Box
                    textAlign="right"
                    onClick={handleSetActiveSidebar.bind(
                      null,
                      'islandAuthInfo',
                    )}
                  >
                    <Button variant="menu" size="small">
                      Breyta upplýsingum
                    </Button>
                  </Box>
                ),
              },
            ],
          },
        ]}
      />
      <ActionSidebar
        isActive={activeSidebar === 'religiousOrg'}
        onClose={handleSetActiveSidebar.bind(null, null)}
      >
        <ExternalFormDirect
          label="Trúfélag / lífsskoðunarfélag"
          tag="Gjaldfrjálst"
          title="Breyta um trúfélag / lífsskoðunarfélag"
          description={`Tilkynntu skráningu í eða utan trú- eða lífsskoðunarfélags.
          Breytingin tekur samstundis gildi í þjóðskrá.`}
          url="https://www.skra.is/default.aspx?pageid=cfd67803-ffc1-11e5-943c-005056851dd2"
          buttonText="Breyta um trúfélag / lífsskoðunarfélag"
        />
      </ActionSidebar>
      <ActionSidebar
        isActive={activeSidebar === 'name'}
        onClose={handleSetActiveSidebar.bind(null, null)}
      >
        <ExternalFormDirect
          label="Nafnbreyting"
          tag="Gjaldfrjálst"
          title="Nafnbreyting"
          description={`Breyting á eiginnafni/-nöfnum eða millinafni, kenning til móður eða
          föður (beggja eða annars), kenninafnsbreyting, ættarnafn o.fl.`}
          url="https://www.skra.is/umsoknir/eydublod-umsoknir-og-vottord/stok-vara/?productid=5c55d7a6-089b-11e6-943d-005056851dd2"
          buttonText="Breyta nafni"
        />
      </ActionSidebar>
      <ActionSidebar
        isActive={activeSidebar === 'legalDomicile'}
        onClose={handleSetActiveSidebar.bind(null, null)}
      >
        <ExternalFormDirect
          label="Lögheimili"
          tag="Gjaldfrjálst"
          title="Flytja lögheimili"
          description={`Ertu að flytja? Hér getur þú tilkynnt flutning einstaklinga
        innanlands og frá Íslandi (utan Norðurlandanna).`}
          url="https://www.skra.is/umsoknir/rafraen-skil/flutningstilkynning/"
          buttonText="Flytja lögheimili"
        />
      </ActionSidebar>
      <ActionSidebar
        isActive={activeSidebar === 'islandInfo'}
        onClose={handleSetActiveSidebar.bind(null, null)}
      >
        <ExternalFormDirect
          label="Grunnupplýsingar"
          tag="Gjaldfrjálst"
          title="Breyta grunnuppýsingum hjá island.is"
          description={`Hér getur þú breytt grunnupplýsingum þínum hjá island.is eins og netfangi, farsíma og vali um hnipp`}
          url="https://innskraning.island.is/notify.aspx"
          buttonText="Breyta upplýsingum"
        />
      </ActionSidebar>
      <ActionSidebar
        isActive={activeSidebar === 'islandAuthInfo'}
        onClose={handleSetActiveSidebar.bind(null, null)}
      >
        <ExternalFormDirect
          label="Innskráning og greiðsla"
          tag="Gjaldfrjálst"
          title="Breyta innskráningar- og greiðsluuplýsingum hjá island.is"
          description={`Hér getur þú breytt innskráningar- og greiðsluuplýsingum þínum hjá island.is eins og Ísklykil, bankaupplýsingum og innskráningarmöguleikum`}
          url="https://innskraning.island.is/notify.aspx"
          buttonText="Breyta upplýsingum"
        />
      </ActionSidebar>
    </>
  )
}

export default UserInfoCard
