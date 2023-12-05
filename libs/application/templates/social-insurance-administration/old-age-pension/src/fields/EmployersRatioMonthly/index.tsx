import { FC, useEffect, useState } from 'react'
import { FieldErrors, FieldValues, useFormContext } from 'react-hook-form'

import { Table as T } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { RepeaterProps, FieldBaseProps } from '@island.is/application/types'

import { oldAgePensionFormMessage } from '../../lib/messages'
import { getApplicationAnswers } from '../../lib/oldAgePensionUtils'
import { MONTHS } from '../../lib/constants'
import { InputController } from '@island.is/shared/form-fields'
import { getErrorViaPath } from '@island.is/application/core'

interface MonthObject {
  [key: string]: string
}
let ratiosObj: MonthObject = {}

const EmployersRatioMonthly: FC<RepeaterProps & FieldBaseProps> = ({
  application,
  field,
  errors,
}) => {
  const { formatMessage } = useLocale()
  const { id } = field
  const [yearly, setYearly] = useState('0')
  const { rawEmployers } = getApplicationAnswers(application.answers)
  const { setValue } = useFormContext()
  const fieldId = `employers[${rawEmployers.length - 1}].ratioMonthlyAvg`
  const error = getErrorViaPath(errors as FieldErrors<FieldValues>, fieldId)

  useEffect(() => {
    const currentEmployer = rawEmployers[rawEmployers.length - 1]
    ratiosObj = currentEmployer?.ratioMonthly ?? {}

    if (currentEmployer?.ratioMonthlyAvg) {
      setYearly(currentEmployer.ratioMonthlyAvg)
    }
  }, [rawEmployers])

  useEffect(() => {
    setValue(fieldId, yearly.toString())
  }, [yearly, setValue, fieldId])

  const calculateYearly = () => {
    let total = 0
    for (const k in ratiosObj) {
      const ratio = ratiosObj[k]?.replace('%', '')
      if (!isNaN(+ratio)) {
        total += +ratio
      }
    }

    return Math.round(total / 12)
  }

  const updateProp = (key: keyof MonthObject, value: string) => {
    ratiosObj[key] = value
  }

  const onChange = async (val: string, month: string) => {
    updateProp(month as keyof MonthObject, val)
    const calYearly = calculateYearly()

    setYearly(calYearly.toString())
  }

  return (
    <T.Table box={{ paddingTop: 2 }}>
      <T.Head>
        <T.Row>
          <T.HeadData>
            {formatMessage(oldAgePensionFormMessage.employer.month)}
          </T.HeadData>
          <T.HeadData>
            {formatMessage(oldAgePensionFormMessage.employer.ratio)}
          </T.HeadData>
        </T.Row>
      </T.Head>
      <T.Body>
        {MONTHS?.map((e) => (
          <T.Row key={`${e.value}`}>
            <T.Data width="50%">{formatMessage(e.label)}</T.Data>
            <T.Data>
              <InputController
                id={`${id}.${e.value}`}
                placeholder="0%"
                label={formatMessage(oldAgePensionFormMessage.employer.ratio)}
                maxLength={4}
                type="number"
                suffix="%"
                onChange={(val) => onChange(val.target.value, e.value)}
                backgroundColor="blue"
              />
            </T.Data>
          </T.Row>
        ))}
        <T.Row>
          <T.Data width="50%">
            {formatMessage(
              oldAgePensionFormMessage.employer.monthlyAvgDescription,
            )}
          </T.Data>
          <T.Data>
            <InputController
              id={fieldId}
              label={formatMessage(
                oldAgePensionFormMessage.employer.totalRatio,
              )}
              type="number"
              suffix="%"
              disabled={true}
              error={error}
            />
          </T.Data>
        </T.Row>
      </T.Body>
    </T.Table>
  )
}

export default EmployersRatioMonthly
