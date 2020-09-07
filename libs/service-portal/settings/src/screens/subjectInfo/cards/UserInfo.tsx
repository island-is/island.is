import React, { FC, useState } from 'react'
import { UserWithMeta, ActionSidebar } from '@island.is/service-portal/core'
import {
  Box,
  Button,
  Typography,
  Stack,
  Checkbox,
  Select,
  Tag,
} from '@island.is/island-ui/core'
import InfoAccordionCard from '../../../components/InfoAccordionCard/InfoAccordionCard'

interface Props {
  userInfo: UserWithMeta
}

const UserInfoCard: FC<Props> = ({ userInfo }) => {
  const [relSidebarOpen, setRelSidebarOpen] = useState(false)

  const handleOpenChangeRelClick = (value: boolean) => setRelSidebarOpen(value)

  return (
    <>
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
                  <Box
                    textAlign="right"
                    onClick={handleOpenChangeRelClick.bind(null, true)}
                  >
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
      <ActionSidebar
        isActive={relSidebarOpen}
        onClose={handleOpenChangeRelClick.bind(null, false)}
      >
        <Box paddingTop={15} paddingX={8} paddingBottom={8}>
          <Box display="flex" justifyContent="spaceBetween" marginBottom={6}>
            <div>Trúfélag / lífsskoðunarfélag</div>
            <Tag variant="darkerMint">Gjaldfrjálst</Tag>
          </Box>
          <Stack space={3}>
            <Typography variant="h3">
              Breyta um trúfélag / lífsskoðunarfélag
            </Typography>
            <Typography variant="p">
              Tilkynntu skráningu í eða utan trú- eða lífsskoðunarfélags.
              Breytingin tekur samstundis gildi í þjóðskrá.
            </Typography>
          </Stack>
        </Box>
        <Box padding={8} background="blue100">
          <Stack space={5}>
            <Stack space={2}>
              <Checkbox label="Utan trú- og lífsskoðunarfélaga" />
              <Checkbox label="Ótilgreint" />
              <Checkbox label="Velja trú- og lífsskoðunarfélag" checked />
            </Stack>
            <Select
              name="rel-mock"
              options={[{ label: 'Siðmennt', value: 'Siðmennt' }]}
              value={{ label: 'Siðmennt', value: 'Siðmennt' }}
            />
          </Stack>
        </Box>
      </ActionSidebar>
    </>
  )
}

export default UserInfoCard
