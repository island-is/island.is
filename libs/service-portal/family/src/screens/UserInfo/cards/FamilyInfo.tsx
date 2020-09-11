import React, { FC, useState } from 'react'
import { UserWithMeta } from '@island.is/service-portal/core'
import { useNatRegFamilyLookup } from '@island.is/service-portal/graphql'
import InfoAccordionCard from '../../../components/InfoAccordionCard/InfoAccordionCard'

interface Props {
  userInfo: UserWithMeta
}

type SidebarType = null

const FamilyInfoCard: FC<Props> = ({ userInfo }) => {
  const [activeSidebar, setActiveSidebar] = useState<SidebarType>(null)
  const { data: userFamilyReg } = useNatRegFamilyLookup(userInfo)

  const handleSetActiveSidebar = (value: SidebarType) => setActiveSidebar(value)

  return (
    <>
      <InfoAccordionCard
        id="basic-user-info"
        label="Fjölskyldan"
        description="Hér getur þú breytt upplýsingum um fjölskylduna. Nöfnum barnana þinna, sótt um skilnað og margt fleira skemmtilegt."
        rows={[
          {
            columns: [
              { content: 'Nafn (N/A)' },
              { content: 'Kennitala (N/A)' },
              { content: 'Heimilsfang (N/A)' },
            ],
          },
        ].concat(
          userFamilyReg?.results?.map((line) => ({
            columns: [
              {
                content: line.name,
              },
              {
                content: line.ssn,
              },
              {
                content: `${line.address}, ${line.postalcode} ${line.city}`,
              },
            ],
          })) || [],
        )}
      />
    </>
  )
}

export default FamilyInfoCard
