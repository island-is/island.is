import { Box, Inline, Link, Stack, Text } from '@island.is/island-ui/core'
import React, { FC } from 'react'
import { formatText, getValueViaPath } from '@island.is/application/core'

import ApplicantsController from './TempController'
import { FieldBaseProps } from '@island.is/application/types'
import { institutionApplicationMessages as m } from '../../../../institution-collaboration/src/lib/messages'
import { useLocale } from '@island.is/localization'

const Temp: FC<FieldBaseProps> = ({ field, application }) => {
  const { formatMessage } = useLocale()

  const { answers } = application
  const { id } = field
  console.log(field)
  console.log(application)

  const getConstraintVal = (tempId: string) =>
    getValueViaPath(
      answers,
      `${id}.${tempId}` as string,
      false,
    ) as boolean

  const tempApplicants = [
    { id: "1010885213", name: "Jón Lýðsson" },
    { id: "1022551122", name: "Pétur Sigurðsson" }
  ]

  console.log(answers)
  return (
    <Box>
      <Stack space={2}>
        {tempApplicants?.map((item) => (
          <ApplicantsController
            id={`${item.id}`}
            checkboxId={`${item.id}`}
            label={formatText(
              item.name,
              application,
              formatMessage,
            )}
            defaultValue={getConstraintVal(`${item.id}`)}
          />
        ))}

      </Stack>
    </Box>
  )
}

export default Temp
