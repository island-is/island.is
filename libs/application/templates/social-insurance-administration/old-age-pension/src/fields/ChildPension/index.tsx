import { RepeaterProps } from '@island.is/application/types'
import { FC, useEffect } from 'react'
import { getApplicationAnswers } from '../../lib/oldAgePensionUtils'
import { Box, Button, Inline } from '@island.is/island-ui/core'
import { oldAgePensionFormMessage } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { ChildPensionTable } from './table'
import * as kennitala from 'kennitala'
import { FieldDescription } from '@island.is/shared/form-fields'

export const ChildCustodyRepeater: FC<RepeaterProps> = ({
  application,
  expandRepeater,
  setRepeaterItems,
}) => {
  const { formatMessage } = useLocale()
  const { childPension } = getApplicationAnswers(application.answers)

  useEffect(() => {
    if (childPension.length === 0) {
      expandRepeater()
    }
  }, [
    application,
    expandRepeater,
    setRepeaterItems,
    formatMessage,
    childPension,
  ])

  const onDeleteChild = async (nationalIdOrBirthDate: string, name: string) => {
    const reducedChildren = childPension?.filter((child) =>
      child.childDoesNotHaveNationalId
        ? child.nationalIdOrBirthDate !== nationalIdOrBirthDate ||
          (child.nationalIdOrBirthDate === nationalIdOrBirthDate &&
            child.name !== name)
        : kennitala.format(child.nationalIdOrBirthDate) !==
          nationalIdOrBirthDate,
    )

    await setRepeaterItems(reducedChildren)
  }

  return (
    <Box>
      <FieldDescription
        description={formatMessage(
          oldAgePensionFormMessage.connectedApplications
            .childPensionAddChildDescription,
        )}
      />

      <Box paddingTop={5} paddingBottom={5}>
        <ChildPensionTable
          children={childPension}
          onDeleteChild={onDeleteChild}
        />
      </Box>

      <Box alignItems="center">
        <Inline space={1} alignY="center">
          <Button size="small" icon="add" onClick={expandRepeater}>
            {formatMessage(
              oldAgePensionFormMessage.connectedApplications.addChildButton,
            )}
          </Button>
        </Inline>
      </Box>
    </Box>
  )
}

export default ChildCustodyRepeater
