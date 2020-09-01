import React, { FC } from 'react'
import { UserWithMeta } from '@island.is/service-portal/core'
import { Box, Button } from '@island.is/island-ui/core'
import InfoAccordionCard from '../../../components/InfoAccordionCard/InfoAccordionCard'

interface Props {
  userInfo: UserWithMeta
}

const UserInfoCard: FC<Props> = ({ userInfo }) => {
  return (
    <InfoAccordionCard
      id="basic-user-info"
      label="Þínar upplýsingar"
      description="T.d vegabréf sem er að renna út eða..."
      rows={[
        {
          columns: [
            { content: 'Nafn' },
            { content: userInfo.user.profile.name },
            {
              render: () => (
                <Box textAlign="right">
                  <Button variant="ghost" size="small">
                    Breyta nafni
                  </Button>
                </Box>
              ),
            },
          ],
        },
        {
          columns: [
            { content: 'Trúfélag / lífsskoðunarfélag' },
            { content: userInfo.user.profile.name },
            {
              render: () => (
                <Box textAlign="right">
                  <Button size="small">Breyta um trúfélag</Button>
                </Box>
              ),
            },
          ],
        },
        {
          columns: [
            { content: 'Kennitala' },
            { content: userInfo.user.profile.name },
          ],
        },
        {
          columns: [
            { content: 'Fæðingarstaður' },
            { content: userInfo.user.profile.name },
          ],
        },
        {
          columns: [
            { content: 'Kyn' },
            { content: userInfo.user.profile.name },
          ],
        },
        {
          columns: [
            { content: 'Ríkisfang' },
            { content: userInfo.user.profile.name },
          ],
        },
        {
          columns: [
            { content: 'Hjúskaparstaða' },
            { content: userInfo.user.profile.name },
          ],
        },
        {
          columns: [
            { content: 'Bannmerking' },
            { content: userInfo.user.profile.name },
            {
              render: () => (
                <Box textAlign="right">
                  <Button variant="ghost" size="small">
                    Breyta bannmerkingu
                  </Button>
                </Box>
              ),
            },
          ],
        },
      ]}
    />
  )
}

export default UserInfoCard
