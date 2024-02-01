import { useMemo, useState } from 'react'

import {
  Box,
  DatePicker,
  Option,
  Select,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { sortAlpha } from '@island.is/shared/utils'
import { getThemeConfig, OrganizationWrapper } from '@island.is/web/components'
import type {
  OrganizationPage,
  Query,
  QueryGetOrganizationPageArgs,
} from '@island.is/web/graphql/schema'
import { withMainLayout } from '@island.is/web/layouts/main'
import { CustomNextError } from '@island.is/web/units/errors'

import { Screen } from '../../../types'
import { GET_ORGANIZATION_PAGE_QUERY } from '../../queries'

interface PensionCalculatorProps {
  organizationPage: OrganizationPage
}

const PensionCalculator: Screen<PensionCalculatorProps> = ({
  organizationPage,
}) => {
  const basePensionTypeOptions = useMemo<Option<number>[]>(() => {
    const options = [
      {
        label: 'Ellilífeyrir',
        value: 1,
      },
      {
        label: 'Ellilífeyrir sjómanna',
        value: 2,
      },
      {
        label: 'Örorkulífeyrir',
        value: 3,
      },
      {
        label: 'Endurhæfingarlífeyrir',
        value: 4,
      },
      {
        label: 'Hálfur ellilífeyrir',
        value: 5,
      },
    ]
    options.sort(sortAlpha('label'))
    return options
  }, [])
  const [basePensionType, setBasePensionType] = useState<Option<number> | null>(
    basePensionTypeOptions?.[0],
  )

  const currentDate = new Date()
  const [birthdate, setBirthdate] = useState<Date>()

  return (
    <OrganizationWrapper
      organizationPage={organizationPage}
      navigationData={{ items: [], title: '' }}
      pageTitle="Reiknivél lífeyris"
      minimal={true}
      showFooterInMinimalView={true}
      mainContent={
        <Box paddingBottom={3}>
          <Stack space={3}>
            <Text>Reiknivél lífeyris</Text>
            <Select
              options={basePensionTypeOptions}
              value={basePensionType}
              onChange={(option) => {
                setBasePensionType(option)
              }}
            />
            <DatePicker
              label="Fæðingardagur"
              placeholderText=""
              appearInline={false}
              locale="is"
              selected={birthdate}
              handleChange={setBirthdate}
              minDate={currentDate}
              maxDate={currentDate}
            />
            <Text variant="h2" as="h2"></Text>
          </Stack>
        </Box>
      }
    />
  )
}

PensionCalculator.getProps = async ({ apolloClient, locale }) => {
  const slug =
    locale === 'is' ? 'tryggingastofnun' : 'social-insurance-administration'

  const [
    {
      data: { getOrganizationPage },
    },
  ] = await Promise.all([
    apolloClient.query<Query, QueryGetOrganizationPageArgs>({
      query: GET_ORGANIZATION_PAGE_QUERY,
      variables: {
        input: {
          slug,
          lang: 'is',
        },
      },
    }),
  ])

  if (!getOrganizationPage) {
    throw new CustomNextError(
      404,
      `Organization page with slug: ${slug} was not found`,
    )
  }

  return {
    organizationPage: getOrganizationPage,
    ...getThemeConfig(
      getOrganizationPage?.theme,
      getOrganizationPage?.organization,
    ),
  }
}

export default withMainLayout(PensionCalculator)
