import React from 'react'
import {
  ServicePortalModuleComponent,
  EventCard,
} from '@island.is/service-portal/core'
import { Box, Columns, Column, Typography } from '@island.is/island-ui/core'

const AssetsCards: ServicePortalModuleComponent = () => {
  return (
    <Box>
      <Columns>
        <Column width="1/2">
          <EventCard
            title="Fasteignir"
            image="//images.ctfassets.net/8k0h54kbe6bj/4uI4AHH4fpT052SPhrfBsG/f2cd83c61a86ceb248c8f43880ff34fb/life-event-ad-flytja.png"
            url="/"
            renderContent={() => (
              <Box>
                <Typography variant="p">Kjartansgata 2</Typography>
                <Typography variant="p">
                  <strong>Sveitarfélag: </strong>
                  105 Reykjavík
                </Typography>
                <Typography variant="p">
                  <strong>Stærð: </strong>
                  151.4 fm
                </Typography>
              </Box>
            )}
          />
        </Column>
      </Columns>
    </Box>
  )
}

export default AssetsCards
