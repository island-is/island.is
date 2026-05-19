import { FC, useContext } from 'react'
import { useIntl } from 'react-intl'

import { Box, Text } from '@island.is/island-ui/core'
import { formatDate } from '@island.is/judicial-system/formatters'

import { AppealCaseState, InstitutionType } from '../../graphql/schema'
import { CaseNumbers } from '../../routes/CourtOfAppeal/components'
import useTargetAppealCaseByAppealCaseId from '../../utils/hooks/useTargetAppealCaseByAppealCaseId'
import { titleForCase } from '../../utils/titleForCase/titleForCase'
import { getAppealActorText } from '../../utils/utils'
import DateLabel from '../DateLabel/DateLabel'
import RulingDateLabel from '../DateLabel/RulingDateLabel'
import { FormContext } from '../FormProvider/FormProvider'
import PageTitle from '../PageTitle/PageTitle'
import RestrictionTags from '../RestrictionTags/RestrictionTags'
import { UserContext } from '../UserProvider/UserProvider'
import { CaseTitleInfoAndTags as strings } from './CaseTitleInfoAndTags.strings'

const CaseTitleInfoAndTags: FC = () => {
  const { workingCase } = useContext(FormContext)
  const { formatMessage } = useIntl()
  const { user } = useContext(UserContext)
  const targetAppealCase = useTargetAppealCaseByAppealCaseId()

  // For ruling-order appeals show the user-generated filename of the ruling
  // file being appealed instead of the generic case-state title.
  const rulingOrderFile = targetAppealCase?.rulingFileId
    ? workingCase.caseFiles?.find((f) => f.id === targetAppealCase.rulingFileId)
    : undefined
  const rulingOrderFileName = rulingOrderFile?.userGeneratedFilename
  const courtCaseNumberPrefix = `${workingCase.courtCaseNumber ?? ''} `
  const title = rulingOrderFile
    ? (rulingOrderFileName?.startsWith(courtCaseNumberPrefix)
        ? rulingOrderFileName.slice(courtCaseNumberPrefix.length)
        : rulingOrderFileName) ?? 'Úrskurður'
    : titleForCase(formatMessage, workingCase)

  return (
    <Box
      display="flex"
      justifyContent="spaceBetween"
      flexDirection={['columnReverse', 'columnReverse', 'columnReverse', 'row']}
      marginBottom={3}
    >
      <Box>
        <PageTitle marginBottom={5}>{title}</PageTitle>
        <CaseNumbers />
        {workingCase.rulingDate &&
          (workingCase.isCompletedWithoutRuling ? (
            <DateLabel
              date={workingCase.rulingDate}
              text={formatMessage(strings.caseCompletedDatePrefix)}
            />
          ) : (
            <RulingDateLabel rulingDate={workingCase.rulingDate} />
          ))}
        {workingCase.hasBeenAppealed && (
          <>
            <Box marginTop={1}>
              <Text as="h5" variant="h5">
                {getAppealActorText(workingCase)}
              </Text>
            </Box>
            {((user?.institution?.type === InstitutionType.DISTRICT_COURT &&
              workingCase.appealCase?.appealState ===
                AppealCaseState.COMPLETED) ||
              user?.institution?.type === InstitutionType.COURT_OF_APPEALS) &&
              workingCase.appealCase?.appealReceivedByCourtDate && (
                <Box marginTop={1}>
                  <Text as="h5" variant="h5">
                    {formatMessage(
                      user.institution.type === InstitutionType.COURT_OF_APPEALS
                        ? strings.COAAppealReceivedAt
                        : strings.appealReceivedAt,
                      {
                        appealReceived: formatDate(
                          workingCase.appealCase?.appealReceivedByCourtDate,
                          'PPPp',
                        ),
                      },
                    )}
                  </Text>
                </Box>
              )}
          </>
        )}
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        marginLeft={[0, 0, 0, 1]}
        marginBottom={[1, 1, 1, 0]}
      >
        <RestrictionTags workingCase={workingCase} />
      </Box>
    </Box>
  )
}

export default CaseTitleInfoAndTags
