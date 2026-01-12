import { Box, Stack } from '@island.is/island-ui/core'
import React, { FC } from 'react'
import { formatText, getValueViaPath } from '@island.is/application/core'

import ConstraintController from './ConstraintController'
import { FieldBaseProps } from '@island.is/application/types'
import { institutionApplicationMessages as m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'

const Constraints: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  field,
  application,
}) => {
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
        <ConstraintController
          id={`${id}.login`}
          checkboxId={`${id}.hasLogin`}
          label={formatText(
            m.constraints.constraintsLoginLabel,
            application,
            formatMessage,
          )}
          placeholder={formatText(
            m.constraints.constraintsLoginPlaceholder,
            application,
            formatMessage,
          )}
          defaultValue={getConstraintVal('hasLogin')}
          extraText={false}
        />
        <ConstraintController
          id={`${id}.straumur`}
          checkboxId={`${id}.hasStraumur`}
          label={formatText(
            m.constraints.constraintsStraumurLabel,
            application,
            formatMessage,
          )}
          placeholder={formatText(
            m.constraints.constraintsStraumurPlaceholder,
            application,
            formatMessage,
          )}
          defaultValue={getConstraintVal('hasStraumur')}
          extraText={false}
        />
        <ConstraintController
          id={`${id}.website`}
          checkboxId={`${id}.hasWebsite`}
          label={formatText(
            m.constraints.constraintsWebsiteLabel,
            application,
            formatMessage,
          )}
          placeholder={formatText(
            m.constraints.constraintsWebsitePlaceholder,
            application,
            formatMessage,
          )}
          defaultValue={getConstraintVal('hasWebsite')}
          extraText={false}
        />
        <ConstraintController
          id={`${id}.robot`}
          checkboxId={`${id}.hasRobot`}
          label={formatText(
            m.constraints.constraintRobotLabel,
            application,
            formatMessage,
          )}
          defaultValue={getConstraintVal('hasRobot')}
          extraText={false}
        />
        <ConstraintController
          id={`${id}.apply`}
          checkboxId={`${id}.hasApply`}
          label={formatText(
            m.constraints.constraintsApplyingLabel,
            application,
            formatMessage,
          )}
          placeholder={formatText(
            m.constraints.constraintsApplyingPlaceholder,
            application,
            formatMessage,
          )}
          defaultValue={getConstraintVal('hasApply')}
          subLabel={formatText(
            m.constraints.constraintsReqSubLabel,
            application,
            formatMessage,
          )}
          extraText={true}
        />

        <ConstraintController
          id={`${id}.myPages`}
          checkboxId={`${id}.hasMyPages`}
          label={formatText(
            m.constraints.constraintsmyPagesLabel,
            application,
            formatMessage,
          )}
          placeholder={formatText(
            m.constraints.constraintsmyPagesPlaceholder,
            application,
            formatMessage,
          )}
          defaultValue={getConstraintVal('hasMyPages')}
          subLabel={formatText(
            m.constraints.constraintsReqSubLabel,
            application,
            formatMessage,
          )}
          extraText={true}
        />

        <ConstraintController
          id={`${id}.cert`}
          checkboxId={`${id}.hasCert`}
          label={formatText(
            m.constraints.constraintsCertLabel,
            application,
            formatMessage,
          )}
          placeholder={formatText(
            m.constraints.constraintsCertPlaceholder,
            application,
            formatMessage,
          )}
          defaultValue={getConstraintVal('hasCert')}
          subLabel={formatText(
            m.constraints.constraintsReqSubLabel,
            application,
            formatMessage,
          )}
          extraText={true}
        />
        <ConstraintController
          id={`${id}.legacy`}
          checkboxId={`${id}.hasLegacy`}
          label={formatText(
            m.constraints.constraintLegacyLabel,
            application,
            formatMessage,
          )}
          placeholder={formatText(
            m.constraints.constraintLegacyPlaceholder,
            application,
            formatMessage,
          )}
          defaultValue={getConstraintVal('hasLegacy')}
          extraText={true}
        />
        <ConstraintController
          id={`${id}.consult`}
          checkboxId={`${id}.hasConsult`}
          label={formatText(
            m.constraints.constraintsConsultLabel,
            application,
            formatMessage,
          )}
          placeholder={formatText(
            m.constraints.constraintsConsultPlaceholder,
            application,
            formatMessage,
          )}
          defaultValue={getConstraintVal('hasConsult')}
          extraText={true}
        />
      </Stack>
    </Box>
  )
}

export default Constraints
