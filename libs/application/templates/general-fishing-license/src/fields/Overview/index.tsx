import { FieldBaseProps, getValueViaPath } from '@island.is/application/core'
import { Box, GridColumn, GridRow } from '@island.is/island-ui/core'
import React, { FC } from 'react'
import { ShipInformation } from '../components'
import { ReviewGroup } from '@island.is/application/ui-components'
import { ValueLine } from './ValueLine'
import kennitala from 'kennitala'
import { GeneralFishingLicense } from '../../lib/dataSchema'
import {
  applicantInformation,
  fishingLicense,
  overview,
} from '../../lib/messages'
import { formatIsk, formatPhonenumber } from '../../utils'
import { FishingLicenseShip as Ship } from '@island.is/api/schema'

export const Overview: FC<FieldBaseProps> = ({ application, goToScreen }) => {
  const answers = application.answers as GeneralFishingLicense

  console.log(application)

  const ships = getValueViaPath(
    application.externalData,
    'directoryOfFisheries.data.ships',
  ) as Ship[]
  const shipIndex = getValueViaPath(
    answers,
    'shipSelection.ship',
    '0',
  ) as string
  const ship = ships[parseInt(shipIndex)]

  const changeScreens = (screen: string) => {
    if (goToScreen) goToScreen(screen)
  }
  return (
    <Box marginBottom={2}>
      <ReviewGroup
        isLast
        editAction={() => changeScreens('applicant')}
        isEditable
      >
        <GridRow>
          <GridColumn paddingBottom={3} span={['9/12', '9/12', '9/12', '5/12']}>
            <ValueLine
              label={applicantInformation.labels.name}
              value={answers.applicant.name}
            />
          </GridColumn>
          <GridColumn paddingBottom={3} span={['9/12', '9/12', '9/12', '5/12']}>
            <ValueLine
              label={applicantInformation.labels.nationalId}
              value={kennitala.format(answers.applicant.nationalId)}
            />
          </GridColumn>
          <GridColumn paddingBottom={3} span={['9/12', '9/12', '9/12', '5/12']}>
            <ValueLine
              label={applicantInformation.labels.address}
              value={answers.applicant.address}
            />
          </GridColumn>
          <GridColumn paddingBottom={3} span={['9/12', '9/12', '9/12', '5/12']}>
            <ValueLine
              label={applicantInformation.labels.postalCode}
              value={answers.applicant.postalCode}
            />
          </GridColumn>
          <GridColumn paddingBottom={3} span={['9/12', '9/12', '9/12', '5/12']}>
            <ValueLine
              label={applicantInformation.labels.city}
              value={answers.applicant.city}
            />
          </GridColumn>
          {answers.applicant.email && (
            <GridColumn span={['9/12', '9/12', '9/12', '5/12']}>
              <ValueLine
                label={applicantInformation.labels.email}
                value={answers.applicant.email}
              />
            </GridColumn>
          )}
          {answers.applicant.phoneNumber && (
            <GridColumn span={['9/12', '9/12', '9/12', '5/12']}>
              <ValueLine
                label={applicantInformation.labels.tel}
                value={formatPhonenumber(answers.applicant.phoneNumber)}
              />
            </GridColumn>
          )}
        </GridRow>
      </ReviewGroup>

      <ReviewGroup isLast>
        <Box
          border="standard"
          borderRadius="large"
          padding={3}
          width="full"
          display="flex"
          justifyContent="spaceBetween"
          marginBottom={5}
        >
          <ShipInformation ship={ship} seaworthinessHasColor />
        </Box>
        <GridRow>
          <GridColumn span={['9/12', '9/12', '9/12', '5/12']}>
            <ValueLine
              label={fishingLicense.general.title}
              value={fishingLicense.labels[answers.fishingLicense.license]}
            />
          </GridColumn>
        </GridRow>
      </ReviewGroup>

      <ReviewGroup>
        <GridRow>
          <GridColumn span={['9/12', '9/12', '9/12', '5/12']}>
            <ValueLine
              label={overview.labels.amount}
              value={formatIsk(22490)}
              color="blue400"
              isPrice
            />
          </GridColumn>
        </GridRow>
      </ReviewGroup>
    </Box>
  )
}
