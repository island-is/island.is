import { Label, ReviewGroup } from '@island.is/application/ui-components'
import { GridColumn, GridRow } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { oldAgePensionFormMessage } from '../../../lib/messages'
import { ReviewGroupProps } from './props'
import { useStatefulAnswers } from '../../../hooks/useStatefulAnswers'
import { EmployersTable } from '../../components/EmployersTable'

export const Employers = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const [{ employers }] = useStatefulAnswers(application)
  const { formatMessage } = useLocale()

  return (
    <>
      <ReviewGroup
        isEditable={editable}
        editAction={() => goToScreen?.('employers')}
      >
        <GridRow>
          <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
            <Label>
              {formatMessage(oldAgePensionFormMessage.employer.employerTitle)}
            </Label>
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '12/12', '12/12']}>
            {employers?.length > 0 && <EmployersTable employers={employers} />}
          </GridColumn>
        </GridRow>
      </ReviewGroup>
    </>
  )
}
