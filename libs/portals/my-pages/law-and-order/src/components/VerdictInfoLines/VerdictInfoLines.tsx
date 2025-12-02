import React from 'react'

import {
  LawAndOrderAppealDecision,
  LawAndOrderGroup,
  LawAndOrderItemType,
} from '@island.is/api/schema'
import { Box, Stack, Text } from '@island.is/island-ui/core'
import { useNamespaces } from '@island.is/localization'
import { AppealForm } from './AppealForm'
import { RenderItem } from './RenderItem'
import { SubmitHandler } from '../../utils/types'

interface Props {
  groups: Array<LawAndOrderGroup>
  onFormSubmit?: SubmitHandler
  loading?: boolean
  formLoading?: boolean
  formSubmitMessage?: string
  modalOpen?: boolean
  appealDecision?: LawAndOrderAppealDecision
  extraInfoLine?: React.ReactNode
}

const VerdictInfoLines: React.FC<React.PropsWithChildren<Props>> = (props) => {
  useNamespaces('sp.law-and-order')

  return (
    <Stack space={1}>
      {props.groups.map((group, index) => {
        const hasRadioButtons = group.items?.some(
          (y) => y.type === LawAndOrderItemType.RadioButton,
        )
        if (hasRadioButtons && !props.extraInfoLine && !props.modalOpen) {
          return (
            <AppealForm
              group={group}
              onFormSubmit={props.onFormSubmit}
              appealDecision={props.appealDecision}
              loading={props.formLoading}
            />
          )
        } else if (hasRadioButtons) {
          // Don't render radio button groups when extraInfoLine is present
          return null
        }
        return (
          <>
            <Box marginTop={4} />
            {group.items?.map((item, i) => (
              <>
                {group.label && i === 0 && (
                  <Text
                    variant="eyebrow"
                    color="purple400"
                    marginBottom={[0, 2]}
                  >
                    {group.label}
                  </Text>
                )}
                <RenderItem
                  key={i}
                  item={item}
                  loading={props.loading}
                  dividerOnBottom={
                    index === 0 && props.extraInfoLine
                      ? false // Don't add divider if extraInfoLine will be added after
                      : (group.items?.length ?? 0) - 1 === i
                  }
                />
              </>
            ))}
            {index === 0 && props.extraInfoLine}
          </>
        )
      })}
    </Stack>
  )
}

export default VerdictInfoLines
