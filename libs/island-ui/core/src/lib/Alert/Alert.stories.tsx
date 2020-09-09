import React from 'react'
import { ContentBlock } from '../..'
import { Alert } from './Alert'
import { GridContainer } from '../Grid/GridContainer'
import { GridRow, GridColumn } from '../Grid'
export default {
  title: 'Components/Alert',
  component: Alert,
}

export const Info = () => (
  <GridContainer>
    <ContentBlock>
      <GridRow>
        <GridColumn span="5/12">
          <Alert
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
    <Alert
      type="error"
      title="Vissir þú að þú getur gert eitthvað sniðugt og þetta eru lengri skilaboð?"
      message="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Purus pellentesque amet, id tortor urna faucibus augue sit. Fames dignissim condimentum nibh ut in."
    />
  </ContentBlock>
)
