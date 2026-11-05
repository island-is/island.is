import { useEffect, useMemo, useState } from 'react'

import {
  MOCK_COMPANY,
  MOCK_EQUALITY_PLANS,
  MOCK_PLAN_SUBMISSIONS,
  MOCK_REPORT_SUBMISSIONS,
  MOCK_REPORTS,
} from './data'
import {
  DirectorateOfEqualityCompany,
  DirectorateOfEqualityEqualityPlan,
  DirectorateOfEqualityReport,
  DirectorateOfEqualitySubmission,
  DirectorateOfEqualitySubmissionType,
} from './types'

const MOCK_DELAY_MS = 400

type MockQueryResult<T> = {
  data: T | undefined
  loading: boolean
  error: Error | undefined
}

let companyLoaded = false

const useMockLoading = (skip: boolean, key: string) => {
  const [loadedKey, setLoadedKey] = useState<string | null>(null)
  useEffect(() => {
    if (skip) {
      return
    }
    const timer = setTimeout(() => setLoadedKey(key), MOCK_DELAY_MS)
    return () => clearTimeout(timer)
  }, [skip, key])
  return !skip && loadedKey !== key
}

export const useDirectorateOfEqualityCompanyQuery = (): MockQueryResult<{
  directorateOfEqualityCompany: DirectorateOfEqualityCompany
}> => {
  const loading = useMockLoading(companyLoaded, 'company')
  useEffect(() => {
    if (!loading) {
      companyLoaded = true
    }
  }, [loading])
  const data = useMemo(
    () => ({ directorateOfEqualityCompany: MOCK_COMPANY }),
    [],
  )
  return { data: loading ? undefined : data, loading, error: undefined }
}

export const useDirectorateOfEqualitySubmissionsQuery = (options: {
  variables: { input: { type: DirectorateOfEqualitySubmissionType } }
  skip?: boolean
}): MockQueryResult<{
  directorateOfEqualitySubmissions: { items: DirectorateOfEqualitySubmission[] }
}> => {
  const { type } = options.variables.input
  const skip = options.skip ?? false
  const loading = useMockLoading(skip, type)
  const data = useMemo(
    () => ({
      directorateOfEqualitySubmissions: {
        items:
          type === DirectorateOfEqualitySubmissionType.EQUALITY_PLAN
            ? MOCK_PLAN_SUBMISSIONS
            : MOCK_REPORT_SUBMISSIONS,
      },
    }),
    [type],
  )
  return { data: loading || skip ? undefined : data, loading, error: undefined }
}

export const useDirectorateOfEqualityEqualityPlanQuery = (options: {
  variables: { input: { id: string } }
}): MockQueryResult<{
  directorateOfEqualityEqualityPlan: DirectorateOfEqualityEqualityPlan | null
}> => {
  const { id } = options.variables.input
  const loading = useMockLoading(false, id)
  const data = useMemo(
    () => ({
      directorateOfEqualityEqualityPlan:
        MOCK_EQUALITY_PLANS.find((plan) => plan.id === id) ?? null,
    }),
    [id],
  )
  return { data: loading ? undefined : data, loading, error: undefined }
}

export const useDirectorateOfEqualityReportQuery = (options: {
  variables: { input: { id: string } }
}): MockQueryResult<{
  directorateOfEqualityReport: DirectorateOfEqualityReport | null
}> => {
  const { id } = options.variables.input
  const loading = useMockLoading(false, id)
  const data = useMemo(
    () => ({
      directorateOfEqualityReport:
        MOCK_REPORTS.find((report) => report.id === id) ?? null,
    }),
    [id],
  )
  return { data: loading ? undefined : data, loading, error: undefined }
}
