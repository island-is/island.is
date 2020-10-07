import React from 'react'
import { ContentBlock } from '../ContentBlock'
import { AlertMessage } from './AlertMessage'
import { GridContainer } from '../Grid/GridContainer/GridContainer'
import { GridRow } from '../Grid/GridRow/GridRow'
import { GridColumn } from '../Grid/GridColumn/GridColumn'

export default {
  title: 'Alerts/AlertMessage',
  component: AlertMessage,
}

export const Info = () => (
  <GridContainer>
    <ContentBlock>
      <GridRow>
        <GridColumn span="5/12">
          <AlertMessage
            type="info"
            title="Vissir þú að þú getur gert eitthvað sniðugt og þetta eru lengri skilaboð?"
            message="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Purus pellentesque amet, id tortor urna faucibus augue sit. Fames dignissim condimentum nibh ut in."
          />
        </GridColumn>
      </GridRow>
    </ContentBlock>
  </GridContainer>
)

export const Error = () => (
  <ContentBlock>
    <AlertMessage
      type="error"
      title="Vissir þú að þú getur gert eitthvað sniðugt og þetta eru lengri skilaboð?"
      message="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Purus pellentesque amet, id tortor urna faucibus augue sit. Fames dignissim condimentum nibh ut in."
    />
  </ContentBlock>
)
