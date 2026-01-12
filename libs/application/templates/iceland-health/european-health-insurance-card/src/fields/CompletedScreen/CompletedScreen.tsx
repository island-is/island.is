import { Address, Answer, NationalRegistry, TempData } from '../../lib/types'
import {
  Box,
  Bullet,
  BulletList,
  Button,
  Inline,
  Stack,
} from '@island.is/island-ui/core'

import { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { base64ToArrayBuffer } from '../../lib/helpers/applicantHelper'
import { europeanHealthInsuranceCardApplicationMessages as e } from '../../lib/messages'
import { formatText } from '@island.is/application/core'
import { useLocale } from '@island.is/localization'

const CompletedScreen: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
}) => {
  const { formatMessage } = useLocale()
  const tempData = application.externalData.getTemporaryCard?.data as TempData[]
  const links: JSX.Element[] = []

  const answers = application.answers as unknown as Answer
  const plastic = answers.delimitations.applyForPlastic

  const nationalRegistryData = application.externalData.nationalRegistry
    ?.data as NationalRegistry

  const residence: Address = {
    streetAddress: nationalRegistryData.address.streetAddress,
    locality: nationalRegistryData.address.locality,
    municipalityCode: nationalRegistryData.address.municipalityCode,
    postalCode: nationalRegistryData.address.postalCode,
  }

  if (tempData) {
    for (let i = 0; i < tempData.length; i++) {
      const byte = base64ToArrayBuffer(tempData[i].data)
      const blob = new Blob([byte], { type: tempData[i].contentType })
      const uri = URL.createObjectURL(blob)
      links.push(
        <Box marginRight={3}>
          <Button
            colorScheme="default"
            onClick={() => window.open(uri, '_blank')}
            variant="ghost"
            preTextIconType="outline"
            preTextIcon="download"
          >
            {tempData[i].fileName}
          </Button>
        </Box>,
      )
    }
  }

  return (
    <Box marginTop={0}>
      <Stack space={6}>
        <BulletList>
          <Bullet>
            {formatText(
              e.confirmation.sectionInfoBulletFirst,
              application,
              formatMessage,
            )}
          </Bullet>
          {plastic?.length > 0 && (
            <Bullet>
              {formatText(
                e.confirmation.sectionInfoBulletSecondOne,
                application,
                formatMessage,
              )}{' '}
              {residence.streetAddress}, {residence.postalCode}{' '}
              {residence.locality}{' '}
              {formatText(
                e.confirmation.sectionInfoBulletSecondTwo,
                application,
                formatMessage,
              )}
            </Bullet>
          )}
          {tempData.length > 0 && (
            <>
              <Bullet>
                {formatText(
                  e.confirmation.sectionInfoBulletThird,
                  application,
                  formatMessage,
                )}
              </Bullet>
              <Bullet>
                {formatText(
                  e.confirmation.sectionInfoBulletFour,
                  application,
                  formatMessage,
                )}
              </Bullet>
            </>
          )}
        </BulletList>
        <Inline>{links}</Inline>
      </Stack>
    </Box>
  )
}
export default CompletedScreen
