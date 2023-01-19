import { Box, Inline, Link, Stack, Text } from '@island.is/island-ui/core'
import React, { FC } from 'react'
import { formatText, getValueViaPath } from '@island.is/application/core'

import ApplicantsController from './ApplicantsController'
import { FieldBaseProps } from '@island.is/application/types'
import { institutionApplicationMessages as m } from '../../../../institution-collaboration/src/lib/messages'
import { useLocale } from '@island.is/localization'

const Applicants: FC<FieldBaseProps> = ({ field, application }) => {
  console.log(application)
  console.log('check')
  const { formatMessage } = useLocale()

  const { answers } = application
  const { id } = field

  const getConstraintVal = (constraintId: string) => {
    // console.log(answers)
    // console.log(constraintId)
    console.log(`${id}.${constraintId}`)
    return getValueViaPath(
      answers,
      `${id}.${constraintId}` as string,
      false,
    ) as boolean
  }

  const applicants = [
    { id: '1010885213', name: 'Jón Lýðsson' },
    { id: '1022551122', name: 'Pétur Sigurðsson' },
  ]

  return (
    <Box>
      <Stack space={2}>
        {applicants?.map((item) => (
          <ApplicantsController
            id={`${item.id}`}
            checkboxId={`${item.id}`}
            label={formatText(item.name, application, formatMessage)}
            defaultValue={getConstraintVal(`${item.id}`)}
          />
        ))}
      </Stack>
    </Box>
  )
}

export default Applicants
