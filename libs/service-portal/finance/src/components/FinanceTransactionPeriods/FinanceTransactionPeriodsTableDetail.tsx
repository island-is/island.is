import {
  Box,
  Text,
  Table as T,
  Pagination,
  Select,
  Option,
  Checkbox,
} from '@island.is/island-ui/core'
import { dateFormat } from '@island.is/shared/constants'
import format from 'date-fns/format'
import * as styles from './FinanceTransactionPeriodsTableDetail.css'
import { amountFormat, periodFormat } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/service-portal/core'
import { useEffect, useMemo, useState } from 'react'
import sortBy from 'lodash/sortBy'
import {
  ChargeItemSubject,
  ChargeItemSubjects,
  ChargeItemSubjectsPeriod,
  SelectedPeriod,
} from './FinanceTransactionPeriodsTypes'
import { useFinanceTransactionPeriodsState } from './FinanceTransactionPeriodsContext'
import { m as messages } from '../../lib/messages'

interface Props {
  typeId: string
  data: ChargeItemSubjects
}

const ITEMS_ON_PAGE = 5

const FinanceTransactionPeriodsTableDetail = ({ typeId, data }: Props) => {
  const { formatMessage } = useLocale()
  const { financeTransactionPeriodsState, setFinanceTransactionPeriodsState } =
    useFinanceTransactionPeriodsState()

  const [page, setPage] = useState(1)

  const [activeSubjects, setActiveSubjects] = useState<Array<Option<string>>>(
    [],
  )
  const [subjectsFilter, setSubjectsFilter] = useState<Array<string>>([])
  const [filteredSubjects, setFilteredSubjects] = useState<typeof data>([])

  const subjects = useMemo(() => {
    return sortBy(data, (item) => {
      return item.lastMoveDate
    }).reverse()
  }, [data])

  useEffect(() => {
    const subjectsArray: Array<Option<string>> = []
    subjects.forEach((s) => {
      subjectsArray.push({
        label: s.chargeItemSubject,
        value: s.chargeItemSubject,
      })
    })
    setActiveSubjects(subjectsArray)
  }, [subjects])

  useEffect(() => {
    if (subjectsFilter.length) {
      setFilteredSubjects(
        subjects.filter((s) => subjectsFilter.includes(s.chargeItemSubject)),
      )
    } else {
      setFilteredSubjects(subjects)
    }
  }, [subjects, subjectsFilter, activeSubjects])

  const totalPages =
    filteredSubjects && filteredSubjects.length > ITEMS_ON_PAGE
      ? Math.ceil(filteredSubjects.length / ITEMS_ON_PAGE)
      : 0

  const setActivePeriods = (
    subject: ChargeItemSubject,
    period: ChargeItemSubjectsPeriod,
    checked: boolean,
  ) => {
    let selectedPeriods = [
      ...(financeTransactionPeriodsState.selectedPeriods ?? []),
    ]
    const findPeriod = (p: SelectedPeriod) =>
      typeId === p.typeId &&
      p.period === period.period &&
      p.subject === subject.chargeItemSubject

    if (checked && !selectedPeriods.find(findPeriod)) {
      selectedPeriods.push({
        typeId,
        period: period.period,
        subject: subject.chargeItemSubject,
        year: financeTransactionPeriodsState.year ?? '',
      })
    } else if (!checked && selectedPeriods.find(findPeriod)) {
      selectedPeriods = selectedPeriods.filter(
        (p) =>
          !(
            typeId === p.typeId &&
            p.period === period.period &&
            p.subject === subject.chargeItemSubject
          ),
      )
    }

    setFinanceTransactionPeriodsState({ selectedPeriods })
  }

  return (
    <Box padding={2} background="blue100">
      {subjects.length > 1 ? (
        <Box padding={2} paddingBottom={4} width="half">
          <Select
            name="filter-subjects"
            label={formatMessage(messages.feeBasePlural)}
            placeholder={formatMessage(messages.feeBasePlaceholder)}
            value={activeSubjects.filter((v) =>
              subjectsFilter.includes(v.value),
            )}
            options={activeSubjects}
            onChange={(val) => {
              setSubjectsFilter(val?.value ? [val.value] : [])
            }}
            isClearable
            isSearchable
            // isMulti // isMulti is not supported by Select component, always returns single value
          />
        </Box>
      ) : null}
      {filteredSubjects
        .slice(ITEMS_ON_PAGE * (page - 1), ITEMS_ON_PAGE * page)
        .map((item) => (
          <Box
            className={styles.innerCol}
            key={item.chargeItemSubject}
            padding={2}
            paddingBottom={4}
          >
            <Box paddingBottom={2}>
              <Text fontWeight="semiBold" variant="medium" as="span">
                {formatMessage(messages.feeBase)} -{' '}
              </Text>
              <Text variant="medium" as="span">
                {item.chargeItemSubject}
              </Text>
            </Box>

            <T.Table box={{ className: styles.zebraTable }}>
              <T.Head>
                <T.Row>
                  <T.HeadData width={56}></T.HeadData>
                  <T.HeadData width="15%">
                    <Text variant="small" fontWeight="semiBold">
                      {formatMessage(m.period)}
                    </Text>
                  </T.HeadData>
                  <T.HeadData>
                    <Text variant="small" fontWeight="semiBold">
                      {formatMessage(m.explanationNote)}
                    </Text>
                  </T.HeadData>
                  <T.HeadData>
                    <Text variant="small" fontWeight="semiBold">
                      {formatMessage(messages.lastMovement)}
                    </Text>
                  </T.HeadData>
                  <T.HeadData align="right" width="15%">
                    <Text variant="small" fontWeight="semiBold">
                      {formatMessage(m.financeStatus)}
                    </Text>
                  </T.HeadData>
                </T.Row>
              </T.Head>
              <T.Body>
                {item.periods.map((period, i) => (
                  <T.Row key={`${period.period}-${i}-${period.lastMoveDate}`}>
                    <T.Data>
                      <Checkbox
                        // TODO: Needs aria-label instead of label, not supported by Checkbox component
                        onChange={(e) => {
                          setActivePeriods(item, period, e.target.checked)
                        }}
                      />
                    </T.Data>
                    <T.Data>
                      <Text variant="small" whiteSpace="nowrap">
                        {periodFormat(period.period)}
                      </Text>
                    </T.Data>
                    <T.Data>{period.description}</T.Data>
                    <T.Data>
                      {format(new Date(period.lastMoveDate), dateFormat.is)}
                    </T.Data>
                    <T.Data align="right">
                      <Text variant="small" whiteSpace="nowrap">
                        {amountFormat(Number(period.amount))}
                      </Text>
                    </T.Data>
                  </T.Row>
                ))}
              </T.Body>
              <T.Foot>
                <T.Row>
                  <T.Data colSpan={3}>
                    <Text variant="small" fontWeight="semiBold">
                      {formatMessage(m.total)}
                    </Text>
                  </T.Data>
                  <T.Data colSpan={2} align="right">
                    <Text variant="small" fontWeight="semiBold">
                      {amountFormat(item.totalAmount)}
                    </Text>
                  </T.Data>
                </T.Row>
              </T.Foot>
            </T.Table>
          </Box>
        ))}
      {totalPages > 0 ? (
        <Box padding={2} paddingTop={8}>
          <Pagination
            page={page}
            totalPages={totalPages}
            renderLink={(page, className, children) => (
              <Box
                cursor="pointer"
                className={className}
                onClick={() => setPage(page)}
                component="button"
              >
                {children}
              </Box>
            )}
          />
        </Box>
      ) : null}
    </Box>
  )
}

export default FinanceTransactionPeriodsTableDetail
