import { GridColumn, GridRow } from '@island.is/island-ui/core'
import { formatPhoneNumber } from '@island.is/application/ui-components'
import { format as formatNationalId } from 'kennitala'
import { ValueLine } from './ValueLine'
import { sectionColumn } from './css/overviewStyles.css'
import { MessageDescriptor } from 'react-intl'

type Props = {
  about: {
    nationalId?: string
    fullName?: string
    powerOfAttorneyName?: string
    powerOfAttorneyNationalId?: string
    email?: string
    phoneNumber?: string
  }
  fullName: MessageDescriptor
  nationalId: MessageDescriptor
  powerOfAttorneyName: MessageDescriptor
  powerOfAttorneyNationalId: MessageDescriptor
  email: MessageDescriptor
  phoneNumber: MessageDescriptor
}

export const AboutOverview = ({
  about,
  fullName,
  nationalId,
  powerOfAttorneyName,
  powerOfAttorneyNationalId,
  email,
  phoneNumber,
}: Props) => {
  return (
    <>
      <GridRow>
        <GridColumn span={['12/12', '6/12']} className={sectionColumn}>
          <ValueLine label={fullName} value={about.fullName} />
        </GridColumn>
        <GridColumn span={['12/12', '6/12']} className={sectionColumn}>
          <ValueLine
            label={nationalId}
            value={about?.nationalId ? formatNationalId(about.nationalId) : '-'}
          />
        </GridColumn>
      </GridRow>
      <GridRow>
        {about.powerOfAttorneyName ? (
          <GridColumn span={['12/12', '6/12']} className={sectionColumn}>
            <ValueLine
              label={powerOfAttorneyName}
              value={about.powerOfAttorneyName}
            />
          </GridColumn>
        ) : null}
        {about.powerOfAttorneyNationalId ? (
          <GridColumn span={['12/12', '6/12']} className={sectionColumn}>
            <ValueLine
              label={powerOfAttorneyNationalId}
              value={formatNationalId(about.powerOfAttorneyNationalId)}
            />
          </GridColumn>
        ) : null}
      </GridRow>
      <GridRow>
        <GridColumn span={['12/12', '6/12']} className={sectionColumn}>
          <ValueLine label={email} value={about.email} />
        </GridColumn>
        {about.phoneNumber && (
          <GridColumn span={['12/12', '6/12']} className={sectionColumn}>
            <ValueLine
              label={phoneNumber}
              value={formatPhoneNumber(about.phoneNumber)}
            />
          </GridColumn>
        )}
      </GridRow>
    </>
  )
}
