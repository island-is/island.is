import { Box, Inline, Link, Stack, Text } from '@island.is/island-ui/core'
import React, { FC } from 'react'
import { formatText, getValueViaPath } from '@island.is/application/core'

import ConstraintController from './ApplicantsController'
import { FieldBaseProps } from '@island.is/application/types'
import { institutionApplicationMessages as m } from '../../../../institution-collaboration/src/lib/messages'
import { useLocale } from '@island.is/localization'

const Applicants: FC<FieldBaseProps> = ({ field, application }) => {
  const { formatMessage } = useLocale()

  const { answers } = application
  const { id } = field
  console.log(field)
  console.log(answers)

  const getConstraintVal = (constraintId: string) =>
    getValueViaPath(
      answers,
      `${id}.${constraintId}` as string,
      false,
    ) as boolean

  return (
    <Box>
      <Stack space={2}>
        <ConstraintController
          id={`${id}.mail`}
          checkboxId={`${id}.hasMail`}
          label={formatText(
            m.constraints.constraintsMailLabel,
            application,
            formatMessage,
          )}
          placeholder={formatText(
            m.constraints.constraintsMailPlaceholder,
            application,
            formatMessage,
          )}
          defaultValue={getConstraintVal('hasMail')}
          extraText={false}
        />
      </Stack>
    </Box>
  )
}

export default Applicants
