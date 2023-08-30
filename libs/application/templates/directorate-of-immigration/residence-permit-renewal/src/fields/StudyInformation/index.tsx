import { Box } from '@island.is/island-ui/core'
import DescriptionText from '../../components/DescriptionText'
import { information } from '../../lib/messages'
import { NationalIdSchoolName } from '../NationalIdSchoolName'
import { FileUploadController } from '@island.is/application/ui-components'
import { useLocale } from '@island.is/localization'

export const StudyInformation = ({ field, application, errors }: any) => {
  const { formatMessage } = useLocale()
  const addSchoolToApplication = (ssn: string, name: string) => {}

  return (
    <Box key={`schoolInformation`}>
      <DescriptionText
        text={information.labels.study.title}
        format={{ name: 'Nafn hér ...' }}
        textProps={{
          as: 'h5',
          fontWeight: 'semiBold',
          paddingBottom: 1,
          paddingTop: 3,
          marginBottom: 0,
        }}
      />
      <NationalIdSchoolName
        field={field}
        application={application}
        customId={`${field.id}.studyInformation`}
        isRequired={true}
        addSchoolToApplication={addSchoolToApplication}
        errors={errors}
        readOnly={false}
      />
      <Box marginY={3}>
        <FileUploadController
          key="confirmationFile"
          application={application}
          id={`${field.id}.confirmationFile`}
          header={formatMessage(
            information.labels.study.fileUploadConfirmationLabel,
          )}
          description={`${formatMessage(
            information.labels.study.fileUploadConfirmationDescription,
          )}
            ${formatMessage(information.labels.study.acceptedFileTypes)}`} // TODO: KOMA ÞESSU I 2 LINUR
          buttonLabel={formatMessage(information.labels.study.buttonText)}
        />
      </Box>
      <Box marginY={3}>
        <FileUploadController
          key="graduationFile"
          application={application}
          id={`${field.id}.graduationFile`}
          header={formatMessage(
            information.labels.study.fileUploadGraduationLabel,
          )}
          buttonLabel={formatMessage(information.labels.study.buttonText)}
          description={formatMessage(
            information.labels.study.acceptedFileTypes,
          )}
        />
      </Box>
      <Box marginY={3}>
        <FileUploadController
          key="continuedEducationFile"
          application={application}
          id={`${field.id}.continuedEducationFile`}
          header={formatMessage(
            information.labels.study.fileUploadContinuedStudiesLabel,
          )}
          buttonLabel={formatMessage(information.labels.study.buttonText)}
          description={formatMessage(
            information.labels.study.acceptedFileTypes,
          )}
        />
      </Box>
    </Box>
  )
}
