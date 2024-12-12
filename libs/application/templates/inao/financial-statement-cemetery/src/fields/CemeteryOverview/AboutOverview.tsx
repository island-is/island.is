import { GridColumn, GridRow } from '@island.is/island-ui/core'
import { format as formatNationalId } from 'kennitala'
import { sectionColumn } from './overviewStyles.css'
import { ValueLine } from './ValueLine'
import { FormValue } from '@island.is/application/types'
import { getAboutOverviewNumbers } from '../../utils/overviewUtils'
import { m } from '../../lib/messages'

type Props = {
  answers: FormValue
}

export const AboutOverview = ({ answers }: Props) => {
  const {
    fullName,
    nationalId,
    powerOfAttorneyName,
    powerOfAttorneyNationalId,
    email,
    phoneNumber,
  } = getAboutOverviewNumbers(answers)
  return (
    <>
      <GridRow>
        <GridColumn span={['12/12', '6/12']} className={sectionColumn}>
          <ValueLine label={m.fullName} value={fullName} />
        </GridColumn>
        <GridColumn span={['12/12', '6/12']} className={sectionColumn}>
          <ValueLine
            label={m.nationalId}
            value={nationalId ? nationalId : '-'}
          />
        </GridColumn>
      </GridRow>
      <GridRow>
        {powerOfAttorneyName ? (
          <GridColumn span={['12/12', '6/12']} className={sectionColumn}>
            <ValueLine
              label={m.powerOfAttorneyName}
              value={powerOfAttorneyName}
            />
          </GridColumn>
        ) : null}
        {powerOfAttorneyNationalId ? (
          <GridColumn span={['12/12', '6/12']} className={sectionColumn}>
            <ValueLine
              label={m.powerOfAttorneyNationalId}
              value={powerOfAttorneyNationalId}
            />
          </GridColumn>
        ) : null}
      </GridRow>
      <GridRow>
        <GridColumn span={['12/12', '6/12']} className={sectionColumn}>
          <ValueLine label={m.email} value={email} />
        </GridColumn>
        <GridColumn span={['12/12', '6/12']} className={sectionColumn}>
          <ValueLine label={m.phoneNumber} value={phoneNumber} />
        </GridColumn>
      </GridRow>
    </>
  )
}
