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
import { YES } from '@island.is/application/core'

export const Support = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { formatMessage } = useLocale()
  const {
    applicationType,
    hasDiagnoses,
    hasHadSupport,
    hasWelfareContact,
    welfareContactName,
    welfareContactEmail,
    hasIntegratedServices,
    hasCaseManager,
    caseManagerName,
    caseManagerEmail,
    requestingMeeting,
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
                      .enrollmentHasDiagnoses
                  : newPrimarySchoolMessages.differentNeeds.hasDiagnoses,
              )}
              value={hasDiagnoses}
            />
          </GridColumn>
        </GridRow>
        <GridRow>
          <GridColumn span="12/12">
            <RadioValue
              label={formatMessage(
                applicationType === ApplicationType.ENROLLMENT_IN_PRIMARY_SCHOOL
                  ? newPrimarySchoolMessages.differentNeeds
                      .enrollmentHasHadSupport
                  : newPrimarySchoolMessages.differentNeeds.hasHadSupport,
              )}
              value={hasHadSupport}
            />
          </GridColumn>
        </GridRow>
        {(hasDiagnoses === YES || hasHadSupport === YES) && (
          <>
            <GridRow>
              <GridColumn span="12/12">
                <RadioValue
                  label={formatMessage(
                    newPrimarySchoolMessages.differentNeeds.hasWelfareContact,
                  )}
                  value={hasWelfareContact || ''}
                />
              </GridColumn>
            </GridRow>
            {hasWelfareContact === YES && (
              <>
                <GridRow rowGap={2}>
                  <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                    <DataValue
                      label={formatMessage(
                        newPrimarySchoolMessages.differentNeeds
                          .welfareContactName,
                      )}
                      value={welfareContactName}
                    />
                  </GridColumn>
                  <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                    <DataValue
                      label={formatMessage(
                        newPrimarySchoolMessages.differentNeeds
                          .welfareContactEmail,
                      )}
                      value={welfareContactEmail}
                    />
                  </GridColumn>
                </GridRow>
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
              </>
            )}
          </>
        )}
        <GridRow>
          <GridColumn span="12/12">
            <RadioValue
              label={formatMessage(
                newPrimarySchoolMessages.differentNeeds
                  .requestingMeetingDescription,
              )}
              value={requestingMeeting}
            />
          </GridColumn>
        </GridRow>
      </Stack>
    </ReviewGroup>
  )
}
