import React, { FC } from 'react'
import { Slice } from '@island.is/web/graphql/schema'
import {
  renderSlices,
  defaultRenderComponent,
  RenderNode,
} from '@island.is/island-ui/contentful'

const renderComponent = (
  slice: Slice,
  renderNode: RenderNode,
  htmlClassName?: string,
) => {
  let children = defaultRenderComponent(slice, renderNode, htmlClassName)

  if (slice.__typename !== 'Html') {
    // wrap with slice id for navigation and linking to specific slice
    children = <div id={slice.id}>{children}</div>
  }

  return children
}

export const RichText: FC<{ body: Slice[] }> = ({ body }) => {
  const node = renderSlices(body, { renderComponent })
  return <>{node}</>
}

export default RichText
