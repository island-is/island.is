import { YES } from '@island.is/application/types'
import {
  DataValue,
  RadioValue,
  ReviewGroup,
} from '@island.is/application/ui-components'
import { GridColumn, GridRow, Stack } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { ApplicationType } from '../../../lib/constants'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import { getApplicationAnswers } from '../../../lib/newPrimarySchoolUtils'
import { ReviewGroupProps } from './props'

export const Support = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { formatMessage } = useLocale()
  const {
    applicationType,
    developmentalAssessment,
    specialSupport,
    hasIntegratedServices,
    hasCaseManager,
    caseManagerName,
    caseManagerEmail,
    requestMeeting,
  } = getApplicationAnswers(application.answers)

  return (
    <ReviewGroup
      isEditable={editable}
      editAction={() => goToScreen?.('support')}
      isLast={true}
    >
      <Stack space={2}>
        <GridRow>
          <GridColumn span="9/12">
            <RadioValue
              label={formatMessage(
                applicationType === ApplicationType.ENROLLMENT_IN_PRIMARY_SCHOOL
                  ? newPrimarySchoolMessages.differentNeeds
                      .enrollmentDevelopmentalAssessment
                  : newPrimarySchoolMessages.differentNeeds
                      .developmentalAssessment,
              )}
              value={developmentalAssessment}
            />
          </GridColumn>
        </GridRow>
        <GridRow>
          <GridColumn span="12/12">
            <RadioValue
              label={formatMessage(
                applicationType === ApplicationType.ENROLLMENT_IN_PRIMARY_SCHOOL
                  ? newPrimarySchoolMessages.differentNeeds
                      .enrollmentSpecialSupport
                  : newPrimarySchoolMessages.differentNeeds.specialSupport,
              )}
              value={specialSupport}
            />
          </GridColumn>
        </GridRow>
        {(developmentalAssessment === YES || specialSupport === YES) && (
          <>
            <GridRow>
              <GridColumn span="12/12">
                <RadioValue
                  label={formatMessage(
                    newPrimarySchoolMessages.differentNeeds
                      .hasIntegratedServices,
                  )}
                  value={hasIntegratedServices}
                />
              </GridColumn>
            </GridRow>
            {hasIntegratedServices === YES && (
              <>
                <GridRow>
                  <GridColumn span="12/12">
                    <RadioValue
                      label={formatMessage(
                        newPrimarySchoolMessages.differentNeeds.hasCaseManager,
                      )}
                      value={hasCaseManager}
                    />
                  </GridColumn>
                </GridRow>
                {hasCaseManager === YES && (
                  <GridRow rowGap={2}>
                    <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                      <DataValue
                        label={formatMessage(
                          newPrimarySchoolMessages.differentNeeds
                            .caseManagerName,
                        )}
                        value={caseManagerName}
                      />
                    </GridColumn>
                    <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                      <DataValue
                        label={formatMessage(
                          newPrimarySchoolMessages.differentNeeds
                            .caseManagerEmail,
                        )}
                        value={caseManagerEmail}
                      />
                    </GridColumn>
                  </GridRow>
                )}
              </>
            )}
          </>
        )}
        <GridRow>
          <GridColumn span="12/12">
            <RadioValue
              label={formatMessage(
                newPrimarySchoolMessages.differentNeeds
                  .requestMeetingDescription,
              )}
              value={requestMeeting}
            />
          </GridColumn>
        </GridRow>
      </Stack>
    </ReviewGroup>
  )
}
