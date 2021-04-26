import React, { FC } from 'react'
import {
  FieldBaseProps,
  getValueViaPath,
  formatText,
} from '@island.is/application/core'
import { Box, Stack } from '@island.is/island-ui/core'
import ConstraintController from './ConstraintController'
import { useLocale } from '@island.is/localization'
import { institutionApplicationMessages as m } from '../../lib/messages'
const Constraints: FC<FieldBaseProps> = ({ field, application }) => {
  const { formatMessage } = useLocale()

  const { answers } = application
  const { id } = field

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
          id={`${id}.technical`}
          checkboxId={`${id}.hasTechnical`}
          label={formatText(
            m.constraints.constraintsTechicalLabel,
            application,
            formatMessage,
          )}
          placeholder={formatText(
            m.constraints.constraintsTechicalPlaceholder,
            application,
            formatMessage,
          )}
          defaultValue={getConstraintVal('hasTechnical')}
        />
        <ConstraintController
          id={`${id}.financial`}
          checkboxId={`${id}.hasFinancial`}
          label={formatText(
            m.constraints.constraintsFinancialLabel,
            application,
            formatMessage,
          )}
          placeholder={formatText(
            m.constraints.constraintsFinancialPlaceholder,
            application,
            formatMessage,
          )}
          defaultValue={getConstraintVal('hasFinancial')}
        />
        <ConstraintController
          id={`${id}.moral`}
          checkboxId={`${id}.hasMoral`}
          label={formatText(
            m.constraints.constraintsMoralLabel,
            application,
            formatMessage,
          )}
          placeholder={formatText(
            m.constraints.constraintsMoralPlaceholder,
            application,
            formatMessage,
          )}
          defaultValue={getConstraintVal('hasMoral')}
        />
        <ConstraintController
          id={`${id}.time`}
          checkboxId={`${id}.hasTime`}
          label={formatText(
            m.constraints.constraintsTimeLabel,
            application,
            formatMessage,
          )}
          placeholder={formatText(
            m.constraints.constraintsTimePlaceholder,
            application,
            formatMessage,
          )}
          defaultValue={getConstraintVal('hasTime')}
        />
        <ConstraintController
          id={`${id}.other`}
          checkboxId={`${id}.hasOther`}
          label={formatText(
            m.constraints.constraintsOtherLabel,
            application,
            formatMessage,
          )}
          placeholder={formatText(
            m.constraints.constraintsOtherPlaceholder,
            application,
            formatMessage,
          )}
          defaultValue={getConstraintVal('hasOther')}
        />
      </Stack>
    </Box>
  )
}

export default Constraints
