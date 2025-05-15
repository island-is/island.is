import { FC, useEffect, useState } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { useMutation } from '@apollo/client'
import { useLocale } from '@island.is/localization'
import { UPDATE_APPLICATION_EXTERNAL_DATA } from '@island.is/application/graphql'
import { getValueViaPath } from '@island.is/application/core'

export const UpdateExternalDataSchools: FC<FieldBaseProps> = ({
  application,
  refetch,
}) => {
  const { locale } = useLocale()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [updateApplicationExternalData] = useMutation(
    UPDATE_APPLICATION_EXTERNAL_DATA,
  )

  const updateExternalDataSchoolsAndRefetch = async () => {
    try {
      const res = await updateApplicationExternalData({
        variables: {
          input: {
            id: application.id,
            dataProviders: [
              {
                actionId: 'SecondarySchool.getSchools',
                order: 0,
              },
            ],
          },
          locale,
        },
      })

      const schoolsDataStr = JSON.stringify(
        application.externalData.schools.data,
      )

      const updatedExternalData =
        res.data.updateApplicationExternalData.externalData
      const updatedschoolsDataStr = JSON.stringify(
        updatedExternalData.schools.data,
      )

      if (updatedschoolsDataStr !== schoolsDataStr) {
        refetch?.()
      }
    } finally {
      setIsLoading(false)
    }
  }

  const timeLapsedInMinutes = (dateFromStr?: string): number => {
    const dateFrom = new Date(dateFromStr || '')
    const dateTo = new Date()
    const oneMinute = 60 * 1000

    if (isNaN(dateFrom.getTime())) {
      throw new Error('Invalid date string provided')
    }

    return Math.abs(dateTo.getTime() - dateFrom.getTime()) / oneMinute
  }

  const oldDataStatus = getValueViaPath<string>(
    application.externalData,
    'schools.status',
  )
  const oldDataDateStr = getValueViaPath<string>(
    application.externalData,
    'schools.date',
  )

  useEffect(() => {
    // Should only update external data and refetch if old data was fetched was over an hour ago
    if (
      !isLoading &&
      (oldDataStatus !== 'success' || timeLapsedInMinutes(oldDataDateStr) > 60)
    ) {
      setIsLoading(true)
      updateExternalDataSchoolsAndRefetch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
