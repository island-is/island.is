import { useRouter } from 'next/router'
import { Box, Divider, Hidden, Stack, Text } from '@island.is/island-ui/core'
import { Select as NativeSelect } from '@island.is/web/components'
import { makeHref } from './utils'
import { useNamespaceStrict } from '@island.is/web/hooks'

interface NewsListSidebarProps {
  title: string
  selectedYear: number
  selectedMonth: number
  selectedTag: string
  newsOverviewUrl: string
  namespace: Record<string, string>
  yearOptions: { label: any; value: any }[]
  monthOptions: { label: any; value: any }[]
}

export const NewsListSidebar = ({
  title,
  selectedYear,
  selectedMonth,
  selectedTag,
  newsOverviewUrl,
  namespace,
  yearOptions,
  monthOptions,
}: NewsListSidebarProps) => {
  const router = useRouter()
  const n = useNamespaceStrict(namespace)

  const allYearsString = n('allYears', 'Allar fréttir')
  const allMonthsString = n('allMonths', 'Allt árið')
  const yearString = n('year', 'Ár')
  const monthString = n('month', 'Mánuður')

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
              router.push(makeHref(selectedValue))
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
