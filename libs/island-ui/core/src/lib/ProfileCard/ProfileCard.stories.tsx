import React from 'react'
import { ProfileCard } from './ProfileCard'
import { Box } from '../Box/Box'
import { GridContainer } from '../Grid/GridContainer/GridContainer'
import { GridRow } from '../Grid/GridRow/GridRow'
import { GridColumn } from '../Grid/GridColumn/GridColumn'

export default {
  title: 'Cards/ProfileCard',
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

export const TitleAbove = () => {
  return (
    <Box paddingY={2} background="purple100">
      <GridContainer>
        <GridRow>
          <GridColumn span={['12/12', '6/12', '4/12']}>
            <Box marginBottom={3}>
              <ProfileCard
                title="Umboðskerfi"
                description="Skráðu þig á póstlista Stafræns Íslands og fylgstu með því nýjasta í stafrænni opinberri þjónustu."
                image="https://images.ctfassets.net/8k0h54kbe6bj/019iw5SSHsBi5vnjxLYupo/b869ce9a3fcbd5060084b2a3a967005b/LE_-_Retirement_-_S1.svg"
                variant="title-above"
                size="small"
                link={{ text: 'Nánar um vöru', url: 'https://island.is' }}
              />
            </Box>
          </GridColumn>
          <GridColumn span={['12/12', '6/12', '4/12']}>
            <Box marginBottom={3}>
              <ProfileCard
                title="Umboðskerfi"
                description="Skráðu þig á póstlista Stafræns Íslands og fylgstu með því nýjasta í stafrænni opinberri þjónustu."
                image="https://images.ctfassets.net/8k0h54kbe6bj/019iw5SSHsBi5vnjxLYupo/b869ce9a3fcbd5060084b2a3a967005b/LE_-_Retirement_-_S1.svg"
                variant="title-above"
                size="small"
                link={{ text: 'Nánar um vöru', url: 'https://island.is' }}
              />
            </Box>
          </GridColumn>
          <GridColumn span={['12/12', '6/12', '4/12']}>
            <Box marginBottom={3}>
              <ProfileCard
                title="Umboðskerfi"
                description="Skráðu þig á póstlista Stafræns Íslands og fylgstu með því nýjasta í stafrænni opinberri þjónustu."
                image="https://images.ctfassets.net/8k0h54kbe6bj/019iw5SSHsBi5vnjxLYupo/b869ce9a3fcbd5060084b2a3a967005b/LE_-_Retirement_-_S1.svg"
                variant="title-above"
                size="small"
                link={{ text: 'Nánar um vöru', url: 'https://island.is' }}
              />
            </Box>
          </GridColumn>
          <GridColumn span={['12/12', '6/12', '4/12']}>
            <Box marginBottom={3}>
              <ProfileCard
                title="Umboðskerfi"
                description="Skráðu þig á póstlista Stafræns Íslands og fylgstu með því nýjasta í stafrænni opinberri þjónustu."
                image="https://images.ctfassets.net/8k0h54kbe6bj/019iw5SSHsBi5vnjxLYupo/b869ce9a3fcbd5060084b2a3a967005b/LE_-_Retirement_-_S1.svg"
                variant="title-above"
                size="small"
                link={{ text: 'Nánar um vöru', url: 'https://island.is' }}
              />
            </Box>
          </GridColumn>
          <GridColumn span={['12/12', '6/12', '4/12']}>
            <Box marginBottom={3}>
              <ProfileCard
                title="Umboðskerfi"
                description="Skráðu þig á póstlista Stafræns Íslands og fylgstu með því nýjasta í stafrænni opinberri þjónustu."
                image="https://images.ctfassets.net/8k0h54kbe6bj/019iw5SSHsBi5vnjxLYupo/b869ce9a3fcbd5060084b2a3a967005b/LE_-_Retirement_-_S1.svg"
                variant="title-above"
                size="small"
                link={{ text: 'Nánar um vöru', url: 'https://island.is' }}
              />
            </Box>
          </GridColumn>
          <GridColumn span={['12/12', '6/12', '4/12']}>
            <Box marginBottom={3}>
              <ProfileCard
                title="Umboðskerfi"
                description="Skráðu þig á póstlista Stafræns Íslands og fylgstu með því nýjasta í stafrænni opinberri þjónustu."
                image="https://images.ctfassets.net/8k0h54kbe6bj/019iw5SSHsBi5vnjxLYupo/b869ce9a3fcbd5060084b2a3a967005b/LE_-_Retirement_-_S1.svg"
                variant="title-above"
                size="small"
                link={{ text: 'Nánar um vöru', url: 'https://island.is' }}
              />
            </Box>
          </GridColumn>
          <GridColumn span={['12/12', '6/12', '4/12']}>
            <Box marginBottom={3}>
              <ProfileCard
                title="Umboðskerfi"
                description="Skráðu þig á póstlista Stafræns Íslands og fylgstu með því nýjasta í stafrænni opinberri þjónustu."
                image="https://images.ctfassets.net/8k0h54kbe6bj/019iw5SSHsBi5vnjxLYupo/b869ce9a3fcbd5060084b2a3a967005b/LE_-_Retirement_-_S1.svg"
                variant="title-above"
                size="small"
                link={{ text: 'Nánar um vöru', url: 'https://island.is' }}
              />
            </Box>
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Box>
  )
}
