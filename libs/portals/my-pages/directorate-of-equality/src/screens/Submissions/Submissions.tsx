import { matchPath, useLocation } from 'react-router-dom'

import { ApiScope } from '@island.is/auth/scopes'
import { useNamespaces } from '@island.is/localization'
import { useUserInfo } from '@island.is/react-spa/bff'

import { SubmissionsTabContent } from '../../components/SubmissionsTabContent/SubmissionsTabContent'
import { SubmissionsWrapper } from '../../components/SubmissionsWrapper/SubmissionsWrapper'
import { NAMESPACE } from '../../lib/constants'
import { DirectorateOfEqualityPaths } from '../../lib/paths'
import { DirectorateOfEqualitySubmissionType } from '../../mocks/types'

const Submissions = () => {
  useNamespaces(NAMESPACE)
  const userInfo = useUserInfo()
  const { pathname } = useLocation()
  const isReports = !!matchPath(DirectorateOfEqualityPaths.Reports, pathname)

  return (
    <SubmissionsWrapper
      pathname={
        isReports
          ? DirectorateOfEqualityPaths.Reports
          : DirectorateOfEqualityPaths.Plans
      }
    >
      <SubmissionsTabContent
        type={
          isReports
            ? DirectorateOfEqualitySubmissionType.SALARY_REPORT
            : DirectorateOfEqualitySubmissionType.EQUALITY_PLAN
        }
        hasAccess={userInfo.scopes.includes(
          isReports
            ? ApiScope.directorateOfEqualitySalary
            : ApiScope.directorateOfEquality,
        )}
      />
    </SubmissionsWrapper>
  )
}

export default Submissions
