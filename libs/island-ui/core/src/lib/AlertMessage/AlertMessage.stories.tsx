import React from 'react'

import { withFigma } from '../../utils/withFigma'
import { ContentBlock } from '../ContentBlock/ContentBlock'
import { AlertMessage } from './AlertMessage'
import { GridContainer } from '../Grid/GridContainer/GridContainer'
import { GridRow } from '../Grid/GridRow/GridRow'
import { GridColumn } from '../Grid/GridColumn/GridColumn'

export default {
  title: 'Alerts/AlertMessage',
  component: AlertMessage,
  parameters: withFigma('AlertMessage'),
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

export const Warning = () => (
  <ContentBlock>
    <AlertMessage
      type="warning"
      title="Vissir þú að þú getur gert eitthvað sniðugt og þetta eru lengri skilaboð?"
      message="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Purus pellentesque amet, id tortor urna faucibus augue sit. Fames dignissim condimentum nibh ut in."
    />
  </ContentBlock>
)

export const Success = () => (
  <ContentBlock>
    <AlertMessage
      type="success"
      title="Vissir þú að þú getur gert eitthvað sniðugt og þetta eru lengri skilaboð?"
      message="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Purus pellentesque amet, id tortor urna faucibus augue sit. Fames dignissim condimentum nibh ut in."
    />
  </ContentBlock>
)
