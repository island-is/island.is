import { useEffect, useState } from 'react'
import { Box, Button, Inline, Select, Tag } from '@island.is/island-ui/core'
import {
  GET_QUOTA_TYPES_FOR_CALENDAR_YEAR,
  GET_QUOTA_TYPES_FOR_TIME_PERIOD,
} from './queries'
import initApollo from '@island.is/web/graphql/client'
import { useI18n } from '@island.is/web/i18n'

import {
  QueryGetQuotaTypesForTimePeriodArgs,
  QuotaType,
} from '@island.is/api/schema'
import { QueryGetQuotaTypesForCalendarYearArgs } from '@island.is/web/graphql/schema'

import * as styles from './QuotaTypeSelect.css'

const emptyValue = { value: -1, label: '' }

interface QuotaTypeSelectProps {
  type: 'aflamark' | 'deilistofn'
  timePeriod?: string
  year?: string
}

export const QuotaTypeSelect = ({
  type,
  timePeriod,
  year,
}: QuotaTypeSelectProps) => {
  const { activeLocale } = useI18n()

  const [optionsInDropdown, setOptionsInDropdown] = useState([])
  const [selectedOptions, setSelectedOptions] = useState([])

  useEffect(() => {
    let mounted = true
    const fetchQuotaTypes = async () => {
      const apolloClient = initApollo({}, activeLocale)

      let query =
        type === 'aflamark'
          ? GET_QUOTA_TYPES_FOR_TIME_PERIOD
          : GET_QUOTA_TYPES_FOR_CALENDAR_YEAR

      const response = await apolloClient.query<
        | { getQuotaTypeForTimePeriod: QuotaType[] }
        | { getQuotaTypesForCalendarYear: QuotaType[] },
        | QueryGetQuotaTypesForTimePeriodArgs
        | QueryGetQuotaTypesForCalendarYearArgs
      >({
        query,
        variables: {
          input: {
            timePeriod,
            year,
          },
        },
      })

      const data =
        response?.data?.[
          type === 'aflamark'
            ? 'getQuotaTypesForTimePeriod'
            : 'getQuotaTypesForCalendarYear'
        ]

      if (!data) return

      const quotaTypes = data
        .filter((qt) => qt?.name)
        .map((qt) => ({
          value: qt.id,
          label: qt.name,
        }))
      if (selectedOptions.length === 0) {
        quotaTypes.sort((a, b) => a.label.localeCompare(b.label))
        if (mounted) setOptionsInDropdown(quotaTypes)
      }
    }

    fetchQuotaTypes()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <Box>
      <Box className={styles.selectBox} marginBottom={3}>
        <Select
          size="sm"
          label="Bæta við tegund"
          name="tegund-fiskur-select"
          options={optionsInDropdown}
          onChange={(selectedOption: { value: number; label: string }) => {
            setSelectedOptions((prev) => prev.concat(selectedOption))
            setOptionsInDropdown((prev) => {
              return prev.filter((o) => o.value !== selectedOption.value)
            })
          }}
          value={emptyValue}
        />
      </Box>
      <Inline alignY="center" space={2}>
        {selectedOptions.map((o) => (
          <Tag
            onClick={() => {
              setSelectedOptions((prevSelected) =>
                prevSelected.filter((prev) => prev.value !== o.value),
              )
              setOptionsInDropdown((prevDropdown) => {
                const updatedDropdown = prevDropdown.concat(o)
                updatedDropdown.sort((a, b) => a.label.localeCompare(b.label))
                return updatedDropdown
              })
            }}
            key={o.value}
          >
            <Box flexDirection="row" alignItems="center">
              {o.label}
              <span className={styles.crossmark}>&#10005;</span>
            </Box>
          </Tag>
        ))}
        {selectedOptions.length > 0 && (
          <Button
            onClick={() => {
              setSelectedOptions((prevSelected) => {
                setOptionsInDropdown((prevDropdown) => {
                  const updatedDropdown = prevDropdown.concat(prevSelected)
                  updatedDropdown.sort((a, b) => a.label.localeCompare(b.label))
                  return updatedDropdown
                })
                return []
              })
            }}
            variant="text"
            size="small"
            colorScheme="default"
          >
            Hreinsa allt
          </Button>
        )}
      </Inline>
    </Box>
  )
}
