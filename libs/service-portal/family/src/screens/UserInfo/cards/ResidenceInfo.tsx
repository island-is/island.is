import React, { FC, useState } from 'react'
import { UserWithMeta, ActionSidebar } from '@island.is/service-portal/core'
import { useNatRegGeneralLookup } from '@island.is/service-portal/graphql'
import { Box, Button } from '@island.is/island-ui/core'
import InfoAccordionCard from '../../../components/InfoAccordionCard/InfoAccordionCard'
import ExternalFormDirect from '../../../components/forms/ExternalFormDirect/ExternalFormDirect'

interface Props {
  userInfo: UserWithMeta
}

type SidebarType = null | 'legalDomicile'

const ResidenceInfoCard: FC<Props> = ({ userInfo }) => {
  const [activeSidebar, setActiveSidebar] = useState<SidebarType>(null)
  const { data: userNatReg } = useNatRegGeneralLookup(userInfo)

  const handleSetActiveSidebar = (value: SidebarType) => setActiveSidebar(value)

  return (
    <>
      <InfoAccordionCard
        id="basic-user-info"
        label="Lögheimili"
        description="Hér getur þú skipt um lögheimili, gert eigendaskipti osfrv."
        rows={[
          {
            columns: [
              { content: 'Heimilisfang N/A' },
              { content: userNatReg?.address || '' },
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
              { content: 'Sveitarfélag N/A' },
              { content: userNatReg?.city || '' },
            ],
          },
          {
            columns: [
              { content: 'Póstáritun N/A' },
              {
                content: `${userNatReg?.postalcode || ''} ${userNatReg?.city ||
                  ''}`,
              },
            ],
          },
          {
            columns: [
              { content: 'Síðasta breyting N/A' },
              {
                content: userNatReg?.lastmodified
                  ? new Date(userNatReg.lastmodified).toString()
                  : '',
              },
            ],
          },
        ]}
      />

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
    </>
  )
}

export default ResidenceInfoCard
