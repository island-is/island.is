import { RegName } from './Regulations.types'
import { RegulationPageTexts } from './RegulationTexts.types'

import React from 'react'
import {
  Box,
  Breadcrumbs,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
} from '@island.is/island-ui/core'
import { useNamespace } from '@island.is/web/hooks'
import { SubpageLayout } from '@island.is/web/screens/Layouts/Layouts'
import { prettyName, useRegulationLinkResolver } from './regulationUtils'

export type RegulationLayoutProps = {
  name: RegName
  texts: RegulationPageTexts
  main: JSX.Element
  sidebar?: JSX.Element | false
}

export const RegulationLayout = (props: RegulationLayoutProps) => {
  const n = useNamespace(props.texts)
  const { linkResolver, linkToRegulation } = useRegulationLinkResolver()

  const breadCrumbs = (
    <Box display={['none', 'none', 'block']} marginBottom={4}>
      {/* Show when NOT a device */}
      <Breadcrumbs
        items={[
          {
            title: 'Ísland.is',
            href: linkResolver('homepage').href,
          },
          {
            title: 'Reglugerðir',
            href: linkResolver('regulationshome').href,
          },
          {
            title: prettyName(props.name),
            href: linkToRegulation(props.name),
          },
        ]}
      />
    </Box>
  )

  return (
    <SubpageLayout
      main={
        <Box paddingTop={[0, 0, 8]} paddingBottom={12}>
          <GridContainer>
            <GridRow>
              <GridColumn
                span={['1/1', '1/1', '1/1', '9/12', '8/12']}
                offset={['0', '0', '0', '0', '1/12']}
                order={1}
              >
                {breadCrumbs}
                {props.main}
              </GridColumn>

              <GridColumn
                span={['1/1', '1/1', '1/1', '3/12']}
                order={[1, 1, 0]}
              >
                {props.sidebar}
              </GridColumn>
            </GridRow>
          </GridContainer>
        </Box>
      }
    />
  )
}
