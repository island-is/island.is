import { Application } from '@island.is/application/types'
import {
  DataValue,
  RadioValue,
  ReviewGroup,
  formatPhoneNumber,
} from '@island.is/application/ui-components'
import { NO, YES } from '@island.is/application/core'
import {
  Box,
  GridColumn,
  GridRow,
  Stack,
  Tag,
  Text,
  Tooltip,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { format as formatKennitala } from 'kennitala'
import { FC } from 'react'
import { MANUAL, SINGLE, SPOUSE } from '../../../constants'
import { parentalLeaveFormMessages } from '../../../lib/messages'
import {
  getApplicationAnswers,
  getChangeBaseline,
  getOtherParentId,
  getOtherParentName,
  normalize,
  requiresOtherParentApproval,
} from '../../../lib/parentalLeaveUtils'

interface ReviewScreenProps {
  application: Application
  goToScreen?: (id: string) => void
}

const OtherParent: FC<React.PropsWithChildren<ReviewScreenProps>> = ({
  application,
  goToScreen,
}) => {
  const { formatMessage } = useLocale()
  const {
    otherParent,
    otherParentEmail,
    otherParentPhoneNumber,
    otherParentRightOfAccess,
    otherParentName: otherParentNameFromAnswers,
    otherParentId: otherParentIdFromAnswers,
  } = getApplicationAnswers(application.answers)

  const otherParentName =
    getOtherParentName(application) || otherParentNameFromAnswers
  const otherParentId =
    getOtherParentId(application) || otherParentIdFromAnswers

  // The application this change descends from holds the old values.
  const previous = getChangeBaseline(application.externalData)?.otherParent

  const oldName = previous?.otherParentName || ''
  const oldId = previous?.otherParentId || ''

  const resolvedName = otherParentName || ''
  const resolvedId = otherParentId || ''

  const hasChangedName = !!previous && oldName !== resolvedName
  const hasChangedId = !!previous && oldId !== resolvedId
  const hasChangedRelation =
    !!previous && normalize(previous.otherParent) !== normalize(otherParent)
  const hasChangedOtherParent =
    hasChangedName || hasChangedId || hasChangedRelation
  const hasPreviousOtherParentDetails = !!(oldName || oldId)
  const otherParentWillApprove = requiresOtherParentApproval(
    application.answers,
    application.externalData,
  )

  return (
    <ReviewGroup
      editAction={() =>
        goToScreen?.(
          otherParent === SPOUSE ? 'editOtherParentSpouse' : 'editOtherParent',
        )
      }
    >
      <Box display="flex" alignItems="center" columnGap={1} marginBottom={3}>
        <Text variant="h3">
          {formatMessage(parentalLeaveFormMessages.shared.otherParentTitle)}
        </Text>
        <Tooltip
          text={formatMessage(
            parentalLeaveFormMessages.shared.otherParentTitle,
          )}
        />
        {hasChangedOtherParent && (
          <Tag variant="purple">
            {formatMessage(parentalLeaveFormMessages.shared.changesMadeTag)}
          </Tag>
        )}
      </Box>
      <Stack space={2}>
        {otherParent === undefined && (
          <Text>
            {formatMessage(
              parentalLeaveFormMessages.shared.otherParentDescription,
            )}
          </Text>
        )}
        {(otherParent === NO || otherParent === SINGLE) && (
          <RadioValue
            label={formatMessage(
              parentalLeaveFormMessages.shared.otherParentTitle,
            )}
            value={NO}
          />
        )}
        {(otherParent === SPOUSE || otherParent === MANUAL) && (
          <>
            {hasChangedOtherParent && hasPreviousOtherParentDetails && (
              <GridRow rowGap={2}>
                <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                  <Box>
                    <Text variant="h4" as="h4" color="dark300">
                      {formatMessage(
                        parentalLeaveFormMessages.shared.otherParentName,
                      )}
                    </Text>
                    <Text color="dark300">
                      <span style={{ textDecoration: 'line-through' }}>
                        {oldName}
                      </span>
                    </Text>
                  </Box>
                </GridColumn>
                <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                  <Box>
                    <Text variant="h4" as="h4" color="dark300">
                      {formatMessage(
                        parentalLeaveFormMessages.shared.otherParentID,
                      )}
                    </Text>
                    <Text color="dark300">
                      <span style={{ textDecoration: 'line-through' }}>
                        {oldId ? formatKennitala(oldId) : ''}
                      </span>
                    </Text>
                  </Box>
                </GridColumn>
              </GridRow>
            )}
            <GridRow rowGap={2}>
              <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                <DataValue
                  label={formatMessage(
                    parentalLeaveFormMessages.shared.otherParentName,
                  )}
                  value={resolvedName}
                />
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                <DataValue
                  label={formatMessage(
                    parentalLeaveFormMessages.shared.otherParentID,
                  )}
                  value={resolvedId ? formatKennitala(resolvedId) : ''}
                />
              </GridColumn>
            </GridRow>
          </>
        )}
        {otherParent === MANUAL && otherParentRightOfAccess && (
          <DataValue
            label={formatMessage(parentalLeaveFormMessages.rightOfAccess.title)}
            value={
              otherParentRightOfAccess === YES
                ? formatMessage(
                    parentalLeaveFormMessages.rightOfAccess.yesOption,
                  )
                : formatMessage(
                    parentalLeaveFormMessages.rightOfAccess.noOption,
                  )
            }
          />
        )}
        {otherParentWillApprove && (
          <GridRow rowGap={2}>
            <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
              <DataValue
                label={formatMessage(
                  parentalLeaveFormMessages.shared.otherParentEmailSubSection,
                )}
                value={otherParentEmail ?? ''}
              />
            </GridColumn>
            {otherParentPhoneNumber && (
              <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                <DataValue
                  label={formatMessage(
                    parentalLeaveFormMessages.shared
                      .otherParentPhoneNumberSubSection,
                  )}
                  value={formatPhoneNumber(otherParentPhoneNumber) ?? ''}
                />
              </GridColumn>
            )}
          </GridRow>
        )}
      </Stack>
    </ReviewGroup>
  )
}

export default OtherParent
