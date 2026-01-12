import capitalize from 'lodash/capitalize'
import { useRouter } from 'next/router'

import {
  Box,
  Divider,
  Hidden,
  Link,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { Select as NativeSelect } from '@island.is/web/components'
import { useNamespace } from '@island.is/web/hooks'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'

import { makeHref } from './utils'

interface NewsListSidebarProps {
  title: string
  selectedYear: number
  selectedMonth: number
  selectedTag: string | string[]
  newsOverviewUrl: string
  namespace: Record<string, string>
  yearOptions: { label: any; value: any }[]
  months: number[]
}

export const NewsListSidebar = ({
  title,
  selectedYear,
  selectedMonth,
  selectedTag,
  newsOverviewUrl,
  namespace,
  yearOptions,
  months,
}: NewsListSidebarProps) => {
  const router = useRouter()
  const n = useNamespace(namespace)
  const { getMonthByIndex } = useDateUtils()

  const allYearsString = n('allYears', 'Allar fréttir')
  const allMonthsString = n('allMonths', 'Allt árið')

  return (
    <Hidden below="md">
      <Box
        background="purple100"
        borderRadius="large"
        padding={4}
        marginTop={4}
      >
        <Stack space={3}>
          <Text variant="h4" as="h1" color="purple600">
            {title}
          </Text>
          <Divider weight="purple200" />
          <NativeSelect
            name="year"
            value={selectedYear ? selectedYear.toString() : allYearsString}
            options={yearOptions}
            onChange={(e) => {
              const selectedValue =
                e.target.value !== allYearsString ? e.target.value : null
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore make web strict
              router.push(makeHref(selectedTag, newsOverviewUrl, selectedValue))
            }}
            color="purple400"
          />
          {selectedYear && (
            <div>
              <Link href={makeHref(selectedTag, newsOverviewUrl, selectedYear)}>
                <Text
                  as="span"
                  fontWeight={!selectedMonth ? 'semiBold' : 'regular'}
                >
                  {allMonthsString}
                </Text>
              </Link>
            </div>
          )}
          {months.map((month) => (
            <div key={month}>
              <Link
                href={makeHref(
                  selectedTag,
                  newsOverviewUrl,
                  selectedYear,
                  month,
                )}
              >
                <Text
                  as="span"
                  fontWeight={selectedMonth === month ? 'semiBold' : 'regular'}
                >
                  {capitalize(getMonthByIndex(month - 1))}
                </Text>
              </Link>
            </div>
          ))}
        </Stack>
      </Box>
    </Hidden>
  )
}
