import { RepeaterProps } from '@island.is/application/types'
import { FC, useEffect } from 'react'
import { getApplicationAnswers } from '../../lib/childPensionUtils'
import { Box, Button, Inline } from '@island.is/island-ui/core'
import { childPensionFormMessage } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { RegisterChildTable } from './RegisterChildTable'
import * as kennitala from 'kennitala'
import { FieldDescription } from '@island.is/shared/form-fields'

export const RegisterChildRepeater: FC<RepeaterProps> = ({
  application,
  expandRepeater,
  setRepeaterItems,
}) => {
  const { formatMessage } = useLocale()
  const { registeredChildren } = getApplicationAnswers(application.answers)

  useEffect(() => {
    if (registeredChildren.length === 0) {
      expandRepeater()
    }
  }, [
    application,
    expandRepeater,
    setRepeaterItems,
    formatMessage,
    registeredChildren,
  ])

  const onDeleteChild = async (nationalIdOrBirthDate: string, name: string) => {
    const reducedChildren = registeredChildren?.filter((child) =>
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
          childPensionFormMessage.info.registerChildRepeaterDescription,
        )}
      />

      <Box paddingTop={5} paddingBottom={5}>
        <RegisterChildTable
          children={registeredChildren}
          onDeleteChild={onDeleteChild}
          application={application}
        />
      </Box>

      <Box alignItems="center">
        <Inline space={1} alignY="center">
          <Button size="small" icon="add" onClick={expandRepeater}>
            {formatMessage(childPensionFormMessage.info.addChildButton)}
          </Button>
        </Inline>
      </Box>
    </Box>
  )
}

export default RegisterChildRepeater
