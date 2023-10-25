import React from 'react'
import { Link } from 'react-router-dom'
import { MessageDescriptor, defineMessage } from 'react-intl'

import {
  Text,
  Box,
  Stack,
  Inline,
  Tag,
  ArrowLink,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { ServicePortalPath, m } from '@island.is/service-portal/core'

type Data = {
  heading: MessageDescriptor | string
  subtext: MessageDescriptor | string
  link: string
  image: string
}

const data: Data[] = [
  {
    heading: m.parentalLeave,
    subtext: defineMessage({
      id: 'sp.eligibility:parental-leave-subtext',
      defaultMessage:
        'Við viljum að stafræn þjónusta sé aðgengileg notanda og því er staða fæðingarorlofs engin undantekning. Hér má skoða stöðu fæðingarorlofs, sækja um eða ráðstafa núverandi fæðingarorlofi.',
    }),
    link: ServicePortalPath.ParentalLeave,
    image: '/assets/images/baby.jpg',
  },
  {
    heading: m.drivingLicense,
    subtext: defineMessage({
      id: 'sp.eligibility:eligibility-driving-license-subtext',
      defaultMessage:
        'Hér er hægt að skoða stöðu núverandi ökuskírteinis, ásamt því að sækja um og eða endurnýja ökupróf í öllum flokkum.',
    }),
    link: ServicePortalPath.LicensesRoot,
    image: '/assets/images/movingTruck.svg',
  },
]

function Eligibility() {
  const { formatMessage } = useLocale()
  useNamespaces('sp.eligibility')

  return (
    <Box marginBottom={[6, 6, 10]}>
      <Stack space={[6, 6, 10]}>
        <Box>
          <GridRow>
            <GridColumn span={['12/12', '12/12', '6/8', '6/8']}>
              <Stack space={2}>
                <Inline space={1}>
                  <Text variant="h3" as="h1">
                    {formatMessage({
                      id: 'sp.eligibility:title',
                      defaultMessage: 'Mín réttindi',
                    })}
                  </Text>
                  <Tag variant="blue" outlined>
                    {formatMessage(m.inProgress)}
                  </Tag>
                </Inline>
                <Text as="p">
                  {formatMessage({
                    id: 'sp.eligibility:overview-subtext',
                    defaultMessage:
                      'Hér sérð þú þau réttindi sem þú hefur fengið send frá viðeigandi stofnunum.',
                  })}
                </Text>
              </Stack>
            </GridColumn>
          </GridRow>
        </Box>
        {data.map((item, index) => (
          <GridRow>
            <GridColumn span={['12/12', '12/12', '5/8']} order={[2, 2, 1]}>
              <Box
                display="flex"
                flexDirection="column"
                height="full"
                justifyContent="center"
                marginTop={[3, 3, 0]}
              >
                <Box marginBottom={2}>
                  <Text variant="h4" as="h2">
                    {formatMessage(item.heading)}
                  </Text>
                </Box>
                <Text marginBottom={[3, 4]}>{formatMessage(item.subtext)}</Text>
                <Box>
                  <Link to={item.link}>
                    <ArrowLink>{formatMessage(m.continue)}</ArrowLink>
                  </Link>
                </Box>
              </Box>
            </GridColumn>
            <GridColumn span={['1/1', '1/1', '3/8']} order={[1, 1, 2]}>
              <Box
                display="flex"
                height="full"
                justifyContent="center"
                alignItems="center"
                marginBottom={[3, 3, 0]}
              >
                <img src={item.image} alt="" />
              </Box>
            </GridColumn>
          </GridRow>
        ))}
      </Stack>
    </Box>
  )
}

export default Eligibility
