import React from 'react'

import {
  Box,
  Divider,
  Link,
  RadioButton,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useNamespaces } from '@island.is/localization'
import { InfoLine } from '@island.is/portals/my-pages/core'
import {
  LawAndOrderActionTypeEnum,
  LawAndOrderGroup,
  LawAndOrderItemType,
} from '@island.is/api/schema'
import { RadioFormGroup } from './RadioButtonType'
import { RenderItem } from './RenderItem'

interface Props {
  groups: Array<LawAndOrderGroup>
  loading?: boolean
}

const InfoLines: React.FC<React.PropsWithChildren<Props>> = (props) => {
  useNamespaces('sp.law-and-order')

  return (
    <Stack space={1}>
      {props.groups.map((x) => {
        const hasRadioButtons = x.items?.some(
          (y) => y.type === LawAndOrderItemType.RadioButton,
        )
        if (hasRadioButtons) return <RadioFormGroup group={x} />
        return (
          <>
            <Box marginTop={4} />
            {x.items?.map((y, i) => {
              return (
                <>
                  {x.label && i === 0 && (
                    <Text
                      variant="eyebrow"
                      color="purple400"
                      marginBottom={[0, 2]}
                    >
                      {x.label}
                    </Text>
                  )}
                  <RenderItem key={i} item={y} loading={props.loading} />
                </>
              )
            })}
          </>
        )
      })}
    </Stack>
  )
}

export default InfoLines
