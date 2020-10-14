import React from 'react'
import { ProfileCard } from './ProfileCard'
import { Box } from '../Box/Box'
import { GridContainer } from '../Grid/GridContainer/GridContainer'
import { GridRow } from '../Grid/GridRow/GridRow'
import { GridColumn } from '../Grid/GridColumn/GridColumn'

export default {
  title: 'Components/ProfileCard',
  component: ProfileCard,
}

export const Default = () => {
  return (
    <Box paddingY={2} background="purple100">
      <GridContainer>
        <GridRow>
          <GridColumn span={['12/12', '6/12', '4/12']}>
            <Box marginBottom={3}>
              <ProfileCard
                title="Andri Heiðar Kristinsson"
                description="Stafrænn leiðtogi"
                image="https://www.stevensegallery.com/277/220"
              />
            </Box>
          </GridColumn>
          <GridColumn span={['12/12', '6/12', '4/12']}>
            <Box marginBottom={3}>
              <ProfileCard
                title="Andri Heiðar Kristinsson"
                description="Stafrænn leiðtogi"
                image="https://www.stevensegallery.com/277/220"
              />
            </Box>
          </GridColumn>
          <GridColumn span={['12/12', '6/12', '4/12']}>
            <Box marginBottom={3}>
              <ProfileCard
                title="Andri Heiðar Kristinsson"
                description="Stafrænn leiðtogi"
                image="https://www.stevensegallery.com/277/220"
              />
            </Box>
          </GridColumn>
          <GridColumn span={['12/12', '6/12', '4/12']}>
            <Box marginBottom={3}>
              <ProfileCard
                title="Andri Heiðar Kristinsson"
                description="Stafrænn leiðtogi"
                image="https://www.stevensegallery.com/277/220"
              />
            </Box>
          </GridColumn>
          <GridColumn span={['12/12', '6/12', '4/12']}>
            <Box marginBottom={3}>
              <ProfileCard
                title="Andri Heiðar Kristinsson"
                description="Stafrænn leiðtogi"
                image="https://www.stevensegallery.com/277/220"
              />
            </Box>
          </GridColumn>
          <GridColumn span={['12/12', '6/12', '4/12']}>
            <Box marginBottom={3}>
              <ProfileCard
                title="Andri Heiðar Kristinsson"
                description="Stafrænn leiðtogi"
                image="https://www.stevensegallery.com/277/220"
              />
            </Box>
          </GridColumn>
          <GridColumn span={['12/12', '6/12', '4/12']}>
            <Box marginBottom={3}>
              <ProfileCard
                title="Andri Heiðar Kristinsson"
                description="Stafrænn leiðtogi"
                image="https://www.stevensegallery.com/277/220"
              />
            </Box>
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Box>
  )
}
