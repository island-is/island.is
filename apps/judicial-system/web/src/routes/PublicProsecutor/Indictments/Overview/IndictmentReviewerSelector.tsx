import { Dispatch, SetStateAction, useContext, useMemo } from 'react'
import { useIntl } from 'react-intl'

import { Option, Select, Text } from '@island.is/island-ui/core'
import { formatDate } from '@island.is/judicial-system/formatters'
import {
  BlueBox,
  SectionHeading,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { useProsecutorSelectionUsersQuery } from '@island.is/judicial-system-web/src/components/ProsecutorSelection/prosecutorSelectionUsers.generated'
import {
  Case,
  CaseIndictmentRulingDecision,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { strings } from './Overview.strings'

export const IndictmentReviewerSelector = ({
  workingCase,
  selectedIndictmentReviewer,
  setSelectedIndictmentReviewer,
}: {
  workingCase: Case
  selectedIndictmentReviewer: Option<string> | null | undefined
  setSelectedIndictmentReviewer: Dispatch<
    SetStateAction<Option<string> | null | undefined>
  >
}) => {
  const { formatMessage: fm } = useIntl()

  const { user } = useContext(UserContext)

  const { data, loading } = useProsecutorSelectionUsersQuery({
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const publicProsecutors = useMemo(() => {
    if (!data?.users || !user) {
      return []
    }
    return data.users.reduce(
      (acc: { label: string; value: string }[], prosecutor) => {
        if (prosecutor.institution?.id === user?.institution?.id) {
          acc.push({
            label: prosecutor.name ?? '',
            value: prosecutor.id,
          })
        }
        return acc
      },
      [],
    )
  }, [data?.users, user])

  return (
    <>
      <SectionHeading
        title={fm(strings.reviewerTitle)}
        description={
          <Text variant="eyebrow">
            {fm(strings.reviewerSubtitle, {
              isFine:
                workingCase.indictmentRulingDecision ===
                CaseIndictmentRulingDecision.FINE,
              indictmentAppealDeadline: formatDate(
                workingCase.indictmentAppealDeadline,
              ),
              appealDeadlineIsInThePast:
                workingCase.indictmentVerdictAppealDeadlineExpired,
            })}
          </Text>
        }
      />
      <BlueBox>
        <Select
          name="reviewer"
          dataTestId="select-reviewer"
          label="Veldu saksóknara"
          placeholder={fm(strings.reviewerPlaceholder)}
          value={
            selectedIndictmentReviewer
              ? selectedIndictmentReviewer
              : workingCase.indictmentReviewer
              ? {
                  label: workingCase.indictmentReviewer.name || '',
                  value: workingCase.indictmentReviewer.id,
                }
              : undefined
          }
          options={publicProsecutors}
          onChange={(value) => {
            setSelectedIndictmentReviewer(value as Option<string>)
          }}
          isDisabled={loading}
          required
        />
      </BlueBox>
    </>
  )
}
