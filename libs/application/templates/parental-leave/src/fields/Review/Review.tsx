import { Application, Field, RecordObject } from '@island.is/application/types'
import { DataValue, ReviewGroup } from '@island.is/application/ui-components'
import {
  Box,
  Button,
  GridColumn,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import get from 'lodash/get'
import has from 'lodash/has'
import { FC } from 'react'
import {
  getApplicationAnswers,
  getSelectedChild,
} from '../../lib/parentalLeaveUtils'

import { useLocale } from '@island.is/localization'
import {
  Languages,
  MANUAL,
  PARENTAL_GRANT,
  PARENTAL_GRANT_STUDENTS,
  PARENTAL_LEAVE,
  ParentalRelations,
  SINGLE,
  States,
} from '../../constants'
import { parentalLeaveFormMessages } from '../../lib/messages'
import { SummaryRights } from '../Rights/SummaryRights'
import { Attachments } from './review-groups/Attachments'
import { BaseInformation } from './review-groups/BaseInformation'
import { Employment } from './review-groups/Employment'
import { OtherParent } from './review-groups/OtherParent'
import { Payments } from './review-groups/Payments'
import { Periods } from './review-groups/Periods'
import { PersonalAllowance } from './review-groups/PersonalAllowance'
import { SpousePersonalAllowance } from './review-groups/SpousePersonalAllowance'
import { Comment } from './review-groups/Comment'
import { NO, YES } from '@island.is/application/core'

interface ReviewScreenProps {
  application: Application
  field: Field & { props?: { editable?: boolean } }
  goToScreen?: (id: string) => void
  errors?: RecordObject
  editable?: boolean
}

export const Review: FC<React.PropsWithChildren<ReviewScreenProps>> = ({
  application,
  field,
  goToScreen,
  errors,
}) => {
  const editable = field.props?.editable ?? false
  const { applicationType, otherParent, employerLastSixMonths, language } =
    getApplicationAnswers(application.answers)
  const selectedChild = getSelectedChild(
    application.answers,
    application.externalData,
  )
  const { formatMessage } = useLocale()
  const { state } = application
  const isPrimaryParent =
    selectedChild?.parentalRelation === ParentalRelations.primary

  const hasSelectedOtherParent =
    otherParent !== NO && otherParent !== SINGLE && otherParent !== MANUAL

  const hasError = (id: string) => get(errors, id) as string

  const groupHasNoErrors = (ids: string[]) =>
    ids.every((id) => !has(errors, id))

  const childProps = {
    application,
    editable,
    groupHasNoErrors,
    hasError,
    goToScreen,
  }

  return (
    <>
      {state === `${States.DRAFT}` && (
        <Box display="flex" justifyContent="spaceBetween">
          <Box>
            <Box marginBottom={2}>
              <Text variant="h2">
                {formatMessage(parentalLeaveFormMessages.confirmation.title)}
              </Text>
            </Box>
            <Box marginBottom={10}>
              <Text variant="default">
                {formatMessage(
                  parentalLeaveFormMessages.confirmation.description,
                )}
              </Text>
            </Box>
          </Box>
          <Box>
            <Button
              variant="utility"
              icon="print"
              onClick={(e) => {
                e.preventDefault()
                window.print()
              }}
            />
          </Box>
        </Box>
      )}
      <BaseInformation {...childProps} />
      {otherParent !== undefined && <OtherParent {...childProps} />}
      <Payments {...childProps} />
      <PersonalAllowance {...childProps} />
      {isPrimaryParent && hasSelectedOtherParent && (
        <SpousePersonalAllowance {...childProps} />
      )}
      {(applicationType === PARENTAL_LEAVE ||
        ((applicationType === PARENTAL_GRANT ||
          applicationType === PARENTAL_GRANT_STUDENTS) &&
          employerLastSixMonths === YES)) && <Employment {...childProps} />}
      <ReviewGroup>
        <SummaryRights application={application} />
      </ReviewGroup>
      <Periods {...childProps} />
      <ReviewGroup
        isLast={true}
        isEditable={editable}
        editAction={() => goToScreen?.('infoSection')}
      >
        <GridRow>
          <GridColumn span={['7/12', '7/12', '7/12', '12/12']}>
            <DataValue
              label={formatMessage(
                parentalLeaveFormMessages.reviewScreen.language,
              )}
              value={
                formatMessage(
                  language === Languages.EN
                    ? parentalLeaveFormMessages.applicant.english
                    : parentalLeaveFormMessages.applicant.icelandic,
                ) ?? ''
              }
            />
          </GridColumn>
        </GridRow>
      </ReviewGroup>
      <Comment {...childProps} />
      <Attachments {...childProps} />

      {/**
       * TODO: Bring back this feature post v1 launch
       * Would also be good to combine it with the first accordion item
       * and make just one section for the other parent info, and sharing with the other parent
       * https://app.asana.com/0/1182378413629561/1200214178491339/f
       */}
      {/* {statefulOtherParentConfirmed === MANUAL && (
        <ReviewGroup
        isEditable={editable}>
          <Box paddingY={4}>
            <Box marginTop={1} marginBottom={2}>
              <Text variant="h5">
                {formatMessage(
                  parentalLeaveFormMessages.shareInformation.subSection,
                )}

                {formatMessage(
                  parentalLeaveFormMessages.shareInformation.title,
                )}
              </Text>
            </Box>

            {editable ? (
              <RadioController
                id="shareInformationWithOtherParent"
                name="shareInformationWithOtherParent"
                error={
                  (errors as RecordObject<string> | undefined)
                    ?.shareInformationWithOtherParent
                }
                defaultValue={shareInformationWithOtherParent}
                options={[
                  {
                    label: formatMessage(
                      parentalLeaveFormMessages.shared.yesOptionLabel,
                    ),
                    value: YES,
                  },
                  {
                    label: formatMessage(
                      parentalLeaveFormMessages.shared.noOptionLabel,
                    ),
                    value: NO,
                  },
                ]}
              />
            ) : (
              <RadioValue value={shareInformationWithOtherParent} />
            )}
          </Box>
        </ReviewGroup>
      )} */}
    </>
  )
}
