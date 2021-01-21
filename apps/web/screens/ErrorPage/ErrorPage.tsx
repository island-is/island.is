import React from 'react'
import { Screen } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'
import { GET_ERROR_PAGE } from '@island.is/web/screens/queries'
import {
  ErrorPageQuery,
  QueryGetErrorPageArgs,
} from '@island.is/web/graphql/schema'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  Text,
  GridContainer,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import { renderHtml } from '@island.is/island-ui/contentful'
import { Document } from '@contentful/rich-text-types'

interface ErrProps {
  errPage: ErrorPageQuery['getErrorPage']
}

export const ErrPage: React.FC<ErrProps> = ({
    errPage
  }) => {
  console.log('helo', errPage)
  return (
    <GridContainer>
      <GridRow>
        <GridColumn span={'6/12'} paddingBottom={10} paddingTop={8}>
          <Text variant="eyebrow" as="div" paddingBottom={2} color="purple400">
            {errPage.errorCode}
          </Text>
          <Text variant="h1" as="h1" paddingBottom={3}>
            {errPage.title}
          </Text>
          <Text variant="intro" as="p">
            {renderHtml(errPage.description.document as Document)}
          </Text>
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default ErrPage

