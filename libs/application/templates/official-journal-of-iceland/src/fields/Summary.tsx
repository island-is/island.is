import { useUserInfo } from '@island.is/auth/react'
import {
  AlertMessage,
  Bullet,
  BulletList,
  Stack,
} from '@island.is/island-ui/core'
import { Property } from '../components/property/Property'
import { error, summary } from '../lib/messages'
import { OJOIFieldBaseProps } from '../lib/types'
import { useLocale } from '@island.is/localization'
import { MINIMUM_WEEKDAYS } from '../lib/constants'
import { addWeekdays, parseZodIssue } from '../lib/utils'
import { useCategories } from '../hooks/useCategories'
import { validationSchema } from '../lib/dataSchema'
import { useApplication } from '../hooks/useUpdateApplication'
import { ZodCustomIssue } from 'zod'
import { useType } from '../hooks/useType'
import { useDepartment } from '../hooks/useDepartment'
import { usePrice } from '../hooks/usePrice'

export const Summary = ({ application }: OJOIFieldBaseProps) => {
  const { formatMessage: f, formatDate } = useLocale()
  const { application: currentApplication } = useApplication({
    applicationId: application.id,
  })

  const user = useUserInfo()

  const { type, loading: loadingType } = useType({
    typeId: currentApplication.answers.advert?.typeId,
  })

  const { price, loading: loadingPrice } = usePrice({
    applicationId: application.id,
  })

  const { department, loading: loadingDepartment } = useDepartment({
    departmentId: currentApplication.answers.advert?.departmentId,
  })

  const { categories, loading: loadingCategories } = useCategories()

  const selectedCategories = categories?.filter((c) =>
    currentApplication.answers?.advert?.categories?.includes(c.id),
  )

  const today = new Date()
  const estimatedDate = addWeekdays(today, MINIMUM_WEEKDAYS)

  const validationCheck = validationSchema.safeParse(currentApplication.answers)

  return (
    <>
      {!validationCheck.success && (
        <AlertMessage
          type="warning"
          title={f(error.missingFieldsTitle)}
          message={
            <BulletList color="black">
              {validationCheck.error.issues.map((issue) => {
                const parsedIssue = parseZodIssue(issue as ZodCustomIssue)
                return (
                  <Bullet key={issue.path.join('.')}>
                    {f(parsedIssue.message)}
                  </Bullet>
                )
              })}
            </BulletList>
          }
        />
      )}
      <Stack space={0} dividers>
        <Property
          name={f(summary.properties.sender)}
          value={user.profile.name}
        />
        <Property
          loading={loadingType}
          name={f(summary.properties.type)}
          value={type?.title}
        />
        <Property
          name={f(summary.properties.title)}
          value={currentApplication.answers?.advert?.title}
        />
        <Property
          loading={loadingDepartment}
          name={f(summary.properties.department)}
          value={department?.title}
        />
        <Property
          name={f(summary.properties.submissionDate)}
          value={new Date().toLocaleDateString()}
        />
        <Property
          name={f(summary.properties.estimatedDate)}
          value={formatDate(estimatedDate)}
        />
        <Property
          loading={loadingPrice}
          name={f(summary.properties.estimatedPrice)}
          value={`${price}. kr`}
        />
        <Property
          loading={loadingCategories}
          name={f(summary.properties.classification)}
          value={selectedCategories?.map((c) => c.title).join(', ')}
        />
      </Stack>
    </>
  )
}

export default Summary
