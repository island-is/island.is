import React from 'react'
import { withDesign } from 'storybook-addon-designs'

import { withFigma } from '../../utils/withFigma'
import { ContentBlock } from '../ContentBlock/ContentBlock'
import { AlertMessage } from './AlertMessage'
import { GridContainer } from '../Grid/GridContainer/GridContainer'
import { GridRow } from '../Grid/GridRow/GridRow'
import { GridColumn } from '../Grid/GridColumn/GridColumn'

export default {
  title: 'Alerts/AlertMessage',
  component: AlertMessage,
  decorators: [withDesign],
  parameters: withFigma({
    desktop:
      'https://www.figma.com/file/pDczqgdlWxgn3YugWZfe1v/UI-Library-%E2%80%93-%F0%9F%96%A5%EF%B8%8F-Desktop?node-id=203%3A299',
    mobile:
      'https://www.figma.com/file/rU3mPM1cLfHa3u7TWuutPQ/UI-Library-%E2%80%93-%F0%9F%93%B1Mobile?node-id=1%3A12',
  }),
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
