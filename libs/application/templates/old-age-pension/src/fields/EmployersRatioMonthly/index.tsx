import { FC, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'

import { Table as T } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { RepeaterProps, FieldBaseProps } from '@island.is/application/types'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import { useMutation } from '@apollo/client'

import { oldAgePensionFormMessage } from '../../lib/messages'
import { getApplicationAnswers } from '../../lib/oldAgePensionUtils'
import { MONTHS } from '../../lib/constants'
import { InputController } from '@island.is/shared/form-fields'

interface monthObject {
  [key: string]: string
}
let ratiosObj: monthObject = {}

const EmployersRatioMonthly: FC<RepeaterProps & FieldBaseProps> = ({
  application,
  field,
}) => {
  const { formatMessage } = useLocale()
  const { id } = field
  const [yearly, setYearly] = useState(0)
  const { rawEmployers } = getApplicationAnswers(application.answers)
  const { setValue } = useFormContext()

  useEffect(() => {
    ratiosObj = {}
  }, [])

  useEffect(() => {
    setValue(
      `employers[${rawEmployers.length - 1}].ratioMonthly.yearly`,
      yearly.toString(),
    )
  }, [yearly, setValue])

  const calculateYearly = () => {
    let total = 0
    for (const k in ratiosObj) {
      const ratio = ratiosObj[k].replace('%', '')
      if (!isNaN(+ratio)) {
        total += +ratio
      }
    }

    return Math.round(total / 12)
  }

  const updateProp = (key: keyof monthObject, value: string) => {
    ratiosObj[key] = value
  }

  const onChange = async (val: string, month: string) => {
    updateProp(month as keyof monthObject, val)
    const calYearly = calculateYearly()

    setYearly(calYearly)
  }

  return (
    <T.Table>
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
        {MONTHS?.map((e, i) => (
          <T.Row key={`${e}${i}`}>
            <T.Data width="50%">{e}</T.Data>
            <T.Data>
              <InputController
                id={`${id}.${e}`}
                defaultValue="0"
                label={formatMessage(oldAgePensionFormMessage.employer.ratio)}
                maxLength={4}
                type="number"
                suffix="%"
                onChange={(val) => onChange(val.target.value, e)}
              />
            </T.Data>
          </T.Row>
        ))}
        <T.Row>
          <T.Data width="50%">
            {formatMessage(
              oldAgePensionFormMessage.employer.monthlyYearlyDescription,
            )}
          </T.Data>
          <T.Data>{yearly}%</T.Data>
        </T.Row>
      </T.Body>
    </T.Table>
  )
}

export default EmployersRatioMonthly
