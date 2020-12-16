import React from 'react'
import { Link } from 'react-router-dom'
import { MessageDescriptor, defineMessage } from 'react-intl'

import {
  ServicePortalModuleComponent,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  Box,
  GridColumn,
  GridRow,
  Inline,
  Stack,
  ArrowLink,
  Tag,
  Text,
} from '@island.is/island-ui/core'

type Data = {
  heading: MessageDescriptor | string
  subtext: MessageDescriptor | string
  link: string
}

const data: Data[] = [
  {
    heading: defineMessage({
      id: 'service.portal:driving-license-general-license-title',
      defaultMessage: 'Almenn ökuréttindi',
    }),
    subtext: defineMessage({
      id: 'sp.driving-license:general-license-subtext',
      defaultMessage:
        'Ökunám á fólksbifreið getur hafist við 16 ára aldur en ökuréttindi eru fyrst veitt við 17 ára aldur. Réttindi til að aka bifhjóli (skellinöðru) er hægt að fá 15 ára og dráttarvél 16 ára. Til að hefja ökunám þarf að hafa samband við löggiltan ökukennara. Hann hefur umsjón með bæði verklegum og bóklegum hluta námsins og vísar á ökuskóla þar sem bóklegt nám fer fram.',
    }),
    link: ServicePortalPath.ParentalLeave,
  },
  {
    heading: defineMessage({
      id: 'service.portal:driving-license-final-license-heading',
      defaultMessage: 'Fullnaðarskírteini',
    }),
    subtext: defineMessage({
      id: 'service.portal:driving-license-final-license-subtext',
      defaultMessage:
        'Ökumaður getur fengið fullnaðarskírteini, hafi hann haft bráðabirgðaskírteini samfellt í 12 mánuði og ekki á þeim tíma fengið punkta í punktakerfi vegna umferðarlagabrota og farið í akstursmat.',
    }),
    link: ServicePortalPath.DrivingLicense,
  },
  {
    heading: defineMessage({
      id: 'service.portal:driving-license-renewal-heading',
      defaultMessage: 'Endurnýjun ökuskírteinis vegna aldurs',
    }),
    subtext: defineMessage({
      id: 'service.portal:driving-license-renewal-subtext',
      defaultMessage:
        'Almenn ökuréttindi (B réttindi) þarf að endurnýja við 70 ára aldur. Nýja ökuskírteinið gildir í 4 ár. Eftir það þarf að endurnýja það þriðja og annað hvert ár en eftir 80 ára aldur á árs fresti.',
    }),
    link: ServicePortalPath.DrivingLicense,
  },
  {
    heading: defineMessage({
      id: 'service.portal:driving-license-trucks-heading',
      defaultMessage: 'Dráttarvélar',
    }),
    subtext: defineMessage({
      id: 'service.portal:driving-license-trucks-subtext',
      defaultMessage:
        'Almenn ökuréttindi (B réttindi) þarf að endurnýja við 70 ára aldur. Nýja ökuskírteinið gildir í 4 ár. Eftir það þarf að endurnýja það þriðja og annað hvert ár en eftir 80 ára aldur á árs fresti.',
    }),
    link: ServicePortalPath.DrivingLicense,
  },
]

function DrivingLicense(): JSX.Element {
  useNamespaces('sp.driving-license')
  const { formatMessage } = useLocale()

  return (
    <Box marginBottom={[6, 6, 10]}>
      <Stack space={[6, 6, 10]}>
        <Box>
          <GridRow>
            <GridColumn span={['12/12', '12/12', '6/8', '6/8']}>
              <Stack space={2}>
                <Inline space={1}>
                  <Text variant="h1" as="h1">
                    {formatMessage({
                      id: 'sp.driving-license:title',
                      defaultMessage: 'Ökuréttindi',
                    })}
                  </Text>
                  <Tag variant="blue" outlined>
                    {formatMessage({
                      id: 'service.portal:in-progress',
                      defaultMessage: 'Í vinnslu',
                    })}
                  </Tag>
                </Inline>
                <Text as="p">
                  {formatMessage({
                    id: 'sp.driving-license:overview-subtext',
                    defaultMessage:
                      'Hér gefur að líta núverandi ökuréttindi þín og gildistíma þeirra.',
                  })}
                </Text>
              </Stack>
            </GridColumn>
          </GridRow>
        </Box>
        {data.map((item, index) => (
          <GridRow>
            <GridColumn span="12/12" order={[2, 2, 1]}>
              <Box
                display="flex"
                flexDirection="column"
                height="full"
                justifyContent="center"
                marginTop={[3, 3, 0]}
              >
                <Box marginBottom={2}>
                  <Text variant="h2" as="h2">
                    {formatMessage(item.heading)}
                  </Text>
                </Box>
                <Text marginBottom={[3, 4]}>{formatMessage(item.subtext)}</Text>
                <Box>
                  <Link to={item.link}>
                    <ArrowLink>
                      {formatMessage({
                        id: 'service.portal:continue-button',
                        defaultMessage: 'Halda áfram',
                      })}
                    </ArrowLink>
                  </Link>
                </Box>
              </Box>
            </GridColumn>
          </GridRow>
        ))}
      </Stack>
    </Box>
  )
  return (
    <>
      <Box marginBottom={4}>
        <Inline space={1}>
          <Text variant="h1" as="h1">
            {formatMessage({
              id: 'sp.driving-license:title',
              defaultMessage: 'Ökuréttindi',
            })}
          </Text>
          <Tag variant="blue" outlined>
            {formatMessage({
              id: 'service.portal:in-progress',
              defaultMessage: 'Í vinnslu',
            })}
          </Tag>
        </Inline>
      </Box>
      <Box marginBottom={5}>
        <GridRow>
          <GridColumn span={['1/1', '6/8']}>
            <Text>
              {formatMessage({
                id: 'sp.driving-license:intro',
                defaultMessage:
                  'Hér gefur að líta núverandi ökuréttindi þín og gildistíma þeirra.',
              })}
            </Text>
          </GridColumn>
        </GridRow>
      </Box>
    </>
  )
}

export default DrivingLicense
