import { getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import {
  Box,
  GridColumn,
  GridRow,
  ResponsiveSpace,
} from '@island.is/island-ui/core'
import React, { FC, useEffect, useState } from 'react'
import { ShipInformation } from '../components'
import { ReviewGroup } from '@island.is/application/ui-components'
import { ValueLine } from './ValueLine'
import kennitala from 'kennitala'
import { GeneralFishingLicense } from '../../lib/dataSchema'
import {
  applicantInformation,
  fishingLicense,
  fishingLicenseFurtherInformation,
  overview,
} from '../../lib/messages'
import { formatIsk, formatPhonenumber } from '../../utils'
import { FishingLicenseShip } from '@island.is/api/schema'
import {
  licenseHasAreaSelection,
  licenseHasRailNetAndRoeNetField,
} from '../../utils/licenses'
import { MessageDescriptor } from '@formatjs/intl'
import { Colors } from '@island.is/island-ui/theme'
import { ChargeItemCode } from '@island.is/shared/constants'

export const Overview: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
  goToScreen,
}) => {
  const answers = application.answers as GeneralFishingLicense
  const [fishingLicensePrice, setFishingLicensePrice] = useState<number>(0)

  // Ships
  const ships =
    getValueViaPath<FishingLicenseShip[]>(
      application.externalData,
      'directoryOfFisheries.data.ships',
    ) ?? []
  const shipIndex =
    getValueViaPath<string>(answers, 'shipSelection.ship') ?? '0'
  const ship = ships[parseInt(shipIndex)]

  // ChargeItem
  const catalogItems = getValueViaPath(
    application.externalData,
    'feeInfoProvider.data',
    [],
  ) as {
    performingOrgID: string
    chargeItemCode: string
    chargeItemName: string
    priceAmount: number
  }[]
  const chargeItemCode = getValueViaPath<string>(
    answers,
    'fishingLicense.chargeType',
  )
  getValueViaPath<string>(answers, 'fishingLicense.chargeType', '')

  useEffect(() => {
    catalogItems?.map((item) => {
      if (item.chargeItemCode === chargeItemCode) {
        let price = item.priceAmount
        // chargeItemCode for "Leyfi til strandveiða"
        if (chargeItemCode === ChargeItemCode.GENERAL_FISHING_LICENSE_COASTAL) {
          price +=
            // chargeItemCode for "Sérstakt gjald vegna strandleyfa"
            catalogItems.find(
              (item) =>
                item.chargeItemCode ===
                ChargeItemCode.GENERAL_FISHING_LICENSE_SPECIAL_COASTAL,
            )?.priceAmount || 0
        }
        setFishingLicensePrice(price)
      }
      return item
    })
  }, [chargeItemCode])

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
          <OverviewItem
            label={applicantInformation.labels.name}
            value={answers.applicant.name}
          />
          <OverviewItem
            label={applicantInformation.labels.nationalId}
            value={kennitala.format(answers.applicant.nationalId)}
          />
          <OverviewItem
            label={applicantInformation.labels.address}
            value={answers.applicant.address}
          />
          <OverviewItem
            label={applicantInformation.labels.postalCode}
            value={answers.applicant.postalCode}
          />
          <OverviewItem
            label={applicantInformation.labels.city}
            value={answers.applicant.city}
          />
          {answers.applicant.email && (
            <OverviewItem
              paddingBottom={0}
              label={applicantInformation.labels.email}
              value={answers.applicant.email}
            />
          )}
          {answers.applicant.phoneNumber && (
            <OverviewItem
              paddingBottom={0}
              label={applicantInformation.labels.tel}
              value={formatPhonenumber(answers.applicant.phoneNumber)}
            />
          )}
        </GridRow>
      </ReviewGroup>
      <ReviewGroup>
        <Box
          border="standard"
          borderRadius="large"
          padding={3}
          width="full"
          display="flex"
          justifyContent="spaceBetween"
          marginBottom={2}
        >
          <ShipInformation ship={ship} seaworthinessHasColor />
        </Box>
      </ReviewGroup>
      <ReviewGroup
        isLast
        editAction={() => changeScreens('fishingLicenseFurtherInformation')}
      >
        <GridRow>
          <OverviewItem
            label={fishingLicense.general.title}
            value={fishingLicense.labels[answers.fishingLicense.license]}
          />
          {licenseHasAreaSelection(answers.fishingLicense.license) &&
            answers?.fishingLicenseFurtherInformation?.area && (
              <OverviewItem
                label={fishingLicenseFurtherInformation.labels.area}
                value={answers.fishingLicenseFurtherInformation.area}
              />
            )}
          {answers?.fishingLicenseFurtherInformation?.date && (
            <OverviewItem
              label={fishingLicenseFurtherInformation.labels.date}
              value={answers.fishingLicenseFurtherInformation.date}
            />
          )}
          {answers?.fishingLicenseFurtherInformation?.attachments &&
            answers.fishingLicenseFurtherInformation.attachments.map(
              (attachment, index) => (
                <OverviewItem
                  label={
                    overview.general[
                      `attachment${index + 1}` as keyof typeof overview.general
                    ]
                  }
                  value={attachment.name}
                  color="blue600"
                />
              ),
            )}
          {licenseHasRailNetAndRoeNetField(answers.fishingLicense.license) &&
            answers?.fishingLicenseFurtherInformation?.railAndRoeNet?.railnet &&
            answers?.fishingLicenseFurtherInformation?.railAndRoeNet
              ?.roenet && (
              <>
                <OverviewItem
                  label={fishingLicenseFurtherInformation.labels.roenet}
                  value={
                    answers.fishingLicenseFurtherInformation.railAndRoeNet
                      ?.roenet
                  }
                />
                <OverviewItem
                  label={fishingLicenseFurtherInformation.labels.railnet}
                  value={
                    answers.fishingLicenseFurtherInformation.railAndRoeNet
                      ?.railnet
                  }
                />
              </>
            )}
        </GridRow>
      </ReviewGroup>
      {!!fishingLicensePrice && (
        <ReviewGroup>
          <GridRow>
            <OverviewItem
              paddingBottom={0}
              label={overview.labels.amount}
              value={formatIsk(fishingLicensePrice)}
              color="blue400"
              isPrice
            />
          </GridRow>
        </ReviewGroup>
      )}
    </Box>
  )
}

type OverviewItemProps = {
  label: string | MessageDescriptor
  value: string | MessageDescriptor
  color?: Colors
  isPrice?: boolean
  paddingBottom?: ResponsiveSpace
}

const OverviewItem = ({ paddingBottom = 3, ...props }: OverviewItemProps) => (
  <GridColumn
    paddingBottom={paddingBottom}
    span={['9/12', '9/12', '9/12', '5/12']}
  >
    <ValueLine {...props} />
  </GridColumn>
)
