import React from 'react'
import capitalize from 'lodash/capitalize'

import { Box, DialogPrompt, Tag, Tooltip } from '@island.is/island-ui/core'
import {
  AccessCategory,
  DataCategory,
  PricingCategory,
  TypeCategory,
} from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'

interface ServiceTagProps {
  category: string
  item: PricingCategory | DataCategory | TypeCategory | AccessCategory
  namespace?: Record<string, string>
}
export const ServiceTag: React.FC<React.PropsWithChildren<ServiceTagProps>> = ({
  category,
  item,
  namespace,
}) => {
  const n = useNamespace(namespace)

  return (
    <DialogPrompt
      baseId={`${category.toLowerCase()}-${item}-dialog`}
      title={n(`${category.toLowerCase() + capitalize(item)}`)}
      description={n(`${category.toLowerCase() + capitalize(item)}Description`)}
      ariaLabel={`Show detailed description of ${item} data`}
      disclosureElement={
        <Box>
          <Tooltip
            placement="right"
            as="span"
            text={n(`${category.toLowerCase() + capitalize(item)}Description`)}
          >
            <Tag variant="white" outlined>
              {n(`${category.toLowerCase() + capitalize(item)}`)}
            </Tag>
          </Tooltip>
        </Box>
      }
      buttonTextCancel={n('closeDialog')}
      key={item}
    />
  )
}

export default ServiceTag
