import { oldAgePensionFormMessage } from '../../../lib/messages'
import { Box, Icon, Table as T } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { Employer } from '../../../types'
import { RatioType } from '../../../lib/constants'
import { formatPhoneNumber } from '@island.is/application/ui-components'

interface EmployerTableProps {
  employers: Employer[] | undefined
  editable?: boolean
  onDeleteEmployer?: (nationalId: string) => void
}

export const EmployersTable = ({
  employers,
  editable = false,
  onDeleteEmployer = () => undefined,
}: EmployerTableProps) => {
  const { formatMessage } = useLocale()
  const newEmployers = employers?.filter(
    (e, index) =>
      employers.findIndex((item) => item.email === e.email) === index,
  )

  return (
    <T.Table>
      <T.Head>
        <T.Row>
          {editable && <T.HeadData></T.HeadData>}
          <T.HeadData>
            {formatMessage(oldAgePensionFormMessage.employer.emailHeader)}
          </T.HeadData>
          <T.HeadData>
            {formatMessage(oldAgePensionFormMessage.employer.phoneNumberHeader)}
          </T.HeadData>
          <T.HeadData>
            {formatMessage(oldAgePensionFormMessage.employer.ratioHeader)}
          </T.HeadData>
        </T.Row>
      </T.Head>
      <T.Body>
        {newEmployers?.map((e, i) => {
          const ratioYearly =
            e.ratioType === RatioType.YEARLY
              ? e.ratioYearly ?? 0
              : e.ratioMonthlyAvg ?? 0
          return (
            <T.Row key={`${e.email}${i}`}>
              {editable && (
                <T.Data>
                  <Box onClick={() => onDeleteEmployer(e.email)}>
                    <Icon
                      color="dark200"
                      icon="removeCircle"
                      size="medium"
                      type="outline"
                    />
                  </Box>
                </T.Data>
              )}
              <T.Data>{e.email}</T.Data>
              <T.Data>
                {e.phoneNumber && formatPhoneNumber(e.phoneNumber)}
              </T.Data>
              <T.Data>{ratioYearly}%</T.Data>
            </T.Row>
          )
        })}
      </T.Body>
    </T.Table>
  )
}
