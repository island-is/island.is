import * as s from './RegulationDisplay.css'

import { RegName, prettyName } from '@island.is/regulations'
import { RegulationPageTexts } from './RegulationTexts.types'

import React, { useRef } from 'react'
import {
  Box,
  Breadcrumbs,
  GridColumn,
  GridContainer,
  GridRow,
} from '@island.is/island-ui/core'
import { useNamespace } from '@island.is/web/hooks'
import { SubpageLayout } from '@island.is/web/screens/Layouts/Layouts'
import { useRegulationLinkResolver } from './regulationUtils'
import { useIntersection } from 'react-use'

export type RegulationLayoutProps = {
  name: RegName
  texts: RegulationPageTexts
  main: JSX.Element
  sidebar?: JSX.Element | false
}

export const RegulationLayout = (props: RegulationLayoutProps) => {
  const n = useNamespace(props.texts)
  const { linkResolver, linkToRegulation } = useRegulationLinkResolver()
  const mainElmRef = useRef<HTMLDivElement>(null)
  const isIntersecting =
    (
      useIntersection(mainElmRef, {
        rootMargin: '0% 0% -100% 0%',
        threshold: 0,
      }) || {}
    ).isIntersecting || undefined

  const breadCrumbs = (
    <Box
      display={['none', 'none', 'block']}
      marginBottom={4}
      className={s.breadCrumbs}
    >
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
                <div ref={mainElmRef} className={isIntersecting && s.scrolled}>
                  {breadCrumbs}
                  {props.main}
                </div>
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
