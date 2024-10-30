import { GridColumn, GridRow } from '@island.is/island-ui/core'
import { formatPhoneNumber } from '@island.is/application/ui-components'
import { format as formatNationalId } from 'kennitala'
import { ValueLine } from './ValueLine'
import { m } from '../lib/messages'
import { FinancialStatementPoliticalParty } from '../lib/dataSchema'
import { sectionColumn } from './css/overviewStyles.css'

type Props = {
  answers: FinancialStatementPoliticalParty
}

export const AboutOverview = ({ answers }: Props) => {
  return (
    <>
      <GridRow>
        <GridColumn span={['12/12', '6/12']} className={sectionColumn}>
          <ValueLine label={m.fullName} value={answers.about.fullName} />
        </GridColumn>
        <GridColumn span={['12/12', '6/12']} className={sectionColumn}>
          <ValueLine
            label={m.nationalId}
            value={
              answers.about?.nationalId
                ? formatNationalId(answers.about.nationalId)
                : '-'
            }
          />
        </GridColumn>
      </GridRow>
      <GridRow>
        {answers.about.powerOfAttorneyName ? (
          <GridColumn span={['12/12', '6/12']} className={sectionColumn}>
            <ValueLine
              label={m.powerOfAttorneyName}
              value={answers.about.powerOfAttorneyName}
            />
          </GridColumn>
        ) : null}
        {answers.about.powerOfAttorneyNationalId ? (
          <GridColumn span={['12/12', '6/12']} className={sectionColumn}>
            <ValueLine
              label={m.powerOfAttorneyNationalId}
              value={formatNationalId(answers.about.powerOfAttorneyNationalId)}
            />
          </GridColumn>
        ) : null}
      </GridRow>
      <GridRow>
        <GridColumn span={['12/12', '6/12']} className={sectionColumn}>
          <ValueLine label={m.email} value={answers.about.email} />
        </GridColumn>
        <GridColumn span={['12/12', '6/12']} className={sectionColumn}>
          <ValueLine
            label={m.phoneNumber}
            value={formatPhoneNumber(answers.about.phoneNumber)}
          />
        </GridColumn>
      </GridRow>
    </>
  )
}
