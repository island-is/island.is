import React, { useEffect, useState } from 'react'
import cn from 'classnames'
import { useIntl } from 'react-intl'
import {
  Text,
  Box,
  ContentBlock,
  InputFileUpload,
  Input,
  Tooltip,
  Checkbox,
  LoadingDots,
  Button,
  UploadFile,
} from '@island.is/island-ui/core'
import { Case, CaseFile, CaseFileState } from '@island.is/judicial-system/types'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import {
  useCase,
  useS3Upload,
} from '@island.is/judicial-system-web/src/utils/hooks'
import {
  FormContentContainer,
  FormFooter,
} from '@island.is/judicial-system-web/src/shared-components'
import { icCaseFiles as m } from '@island.is/judicial-system-web/messages'
import { removeTabsValidateAndSet } from '@island.is/judicial-system-web/src/utils/formHelper'
import { parseString } from '@island.is/judicial-system-web/src/utils/formatters'
import MarkdownWrapper from '@island.is/judicial-system-web/src/shared-components/MarkdownWrapper/MarkdownWrapper'
import { PoliceCaseFilesData } from './CaseFiles'
import { AnimatePresence, AnimateSharedLayout, motion } from 'framer-motion'
import * as styles from './CaseFiles.css'
import { PoliceCaseFilesMessageBox } from '../../SharedComponents/PoliceCaseFilesMessageBox/PoliceCaseFilesMessageBox'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
  isLoading: boolean
  policeCaseFiles?: PoliceCaseFilesData
}

interface PoliceCaseFile {
  id: string
  label: string
  checked: boolean
}

const CaseFilesForm: React.FC<Props> = (props) => {
  const { workingCase, setWorkingCase, isLoading, policeCaseFiles } = props
  const [policeCaseFileList, setPoliceCaseFileList] = useState<
    PoliceCaseFile[]
  >([])
  const [checkAllChecked, setCheckAllChecked] = useState<boolean>(false)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const {
    files,
    uploadErrorMessage,
    allFilesUploaded,
    uploadPoliceCaseFile,
    addFileToCase,
    onChange,
    onRemove,
    onRetry,
  } = useS3Upload(workingCase)
  const { formatMessage } = useIntl()
  const { updateCase } = useCase()

  useEffect(() => {
    if (policeCaseFiles) {
      const policeCaseFilesNotStoredInRVG = policeCaseFiles.files.filter(
        (p) => {
          const xFiles = files as CaseFile[]

          return !xFiles.find(
            (f) => f.name === p.name && f.state === CaseFileState.STORED_IN_RVG,
          )
        },
      )

      if (policeCaseFilesNotStoredInRVG.length !== policeCaseFileList.length) {
        setPoliceCaseFileList(
          policeCaseFilesNotStoredInRVG.map((policeCaseFile) => {
            return {
              id: policeCaseFile.id,
              label: policeCaseFile.name,
              checked:
                policeCaseFileList.find((p) => p.id === policeCaseFile.id)
                  ?.checked || false,
            }
          }),
        )
      }
    }
  }, [policeCaseFiles, files, policeCaseFileList])

  const toggleCheckbox = (
    evt: React.ChangeEvent<HTMLInputElement>,
    checkAll?: boolean,
  ) => {
    const newPoliceCaseFileList = [...policeCaseFileList]
    const target = policeCaseFileList.findIndex(
      (listItem) => listItem.id.toString() === evt.target.value,
    )

    if (checkAll) {
      setCheckAllChecked(!checkAllChecked)
      setPoliceCaseFileList(
        policeCaseFileList.map((l) => {
          return { id: l.id, label: l.label, checked: evt.target.checked }
        }),
      )
    } else {
      newPoliceCaseFileList[target].checked = !newPoliceCaseFileList[target]
        .checked
      setPoliceCaseFileList(newPoliceCaseFileList)
    }
  }

  const uploadToRVG = async () => {
    const filesToUpload = policeCaseFileList.filter((p) => p.checked)
    let newPoliceCaseFileList = [...policeCaseFileList]

    setIsUploading(true)

    filesToUpload.forEach(async (policeCaseFile, index) => {
      const { key, size } = await uploadPoliceCaseFile(
        policeCaseFile.id,
        policeCaseFile.label,
      )

      await addFileToCase({
        type: 'application/pdf',
        name: policeCaseFile.label,
        status: 'done',
        state: CaseFileState.STORED_IN_RVG,
        key,
        size,
      } as UploadFile)

      newPoliceCaseFileList = newPoliceCaseFileList.filter(
        (p) => p.id !== policeCaseFile.id,
      )

      if (index === filesToUpload.length - 1) {
        setIsUploading(false)
        setCheckAllChecked(false)
      }
    })

    setPoliceCaseFileList(newPoliceCaseFileList)
  }

  return (
    <>
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            {formatMessage(m.heading)}
          </Text>
        </Box>
        <Box marginBottom={5}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              {formatMessage(m.sections.description.heading)}
            </Text>
          </Box>
          <MarkdownWrapper
            text={m.sections.description.list}
            textProps={{ marginBottom: 0 }}
          />
        </Box>
        <Box marginBottom={3}>
          <Text variant="h3" as="h3">
            {formatMessage(m.sections.policeCaseFiles.heading, {
              policeCaseNumber: workingCase.policeCaseNumber,
            })}
          </Text>
        </Box>
        <Box marginBottom={5}>
          <AnimateSharedLayout>
            <motion.div layout className={styles.policeCaseFilesContainer}>
              <motion.ul layout>
                <motion.li
                  layout
                  className={cn(styles.policeCaseFile, {
                    [styles.selectAllPoliceCaseFiles]: true,
                  })}
                >
                  <Checkbox
                    name="selectAllPoliceCaseFiles"
                    label={formatMessage(
                      m.sections.policeCaseFiles.selectAllLabel,
                    )}
                    checked={checkAllChecked}
                    onChange={(evt) => toggleCheckbox(evt, true)}
                    disabled={isUploading || policeCaseFileList.length === 0}
                    strong
                  />
                </motion.li>
                {policeCaseFiles?.isLoading ? (
                  <Box
                    textAlign="center"
                    paddingY={2}
                    paddingX={3}
                    marginBottom={2}
                  >
                    <LoadingDots />
                  </Box>
                ) : policeCaseFiles?.hasError ? (
                  policeCaseFiles?.errorMessage &&
                  policeCaseFiles?.errorMessage.indexOf('404') > -1 ? (
                    <PoliceCaseFilesMessageBox
                      icon="warning"
                      iconColor="yellow400"
                      message={formatMessage(
                        m.sections.policeCaseFiles.caseNotFoundInLOKEMessage,
                      )}
                    />
                  ) : (
                    <PoliceCaseFilesMessageBox
                      icon="close"
                      iconColor="red400"
                      message={formatMessage(
                        m.sections.policeCaseFiles.errorMessage,
                      )}
                    />
                  )
                ) : policeCaseFiles?.files.length === 0 ? (
                  <PoliceCaseFilesMessageBox
                    icon="warning"
                    iconColor="yellow400"
                    message={formatMessage(
                      m.sections.policeCaseFiles.noFilesFoundInLOKEMessage,
                    )}
                  />
                ) : policeCaseFileList.length > 0 ? (
                  <AnimatePresence>
                    {policeCaseFileList.map((listItem) => {
                      return (
                        <motion.li
                          layout
                          className={styles.policeCaseFile}
                          key={listItem.label}
                          initial={{
                            opacity: 0,
                          }}
                          animate={{
                            opacity: 1,
                          }}
                          exit={{
                            opacity: 0,
                          }}
                        >
                          <Checkbox
                            label={
                              <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="spaceBetween"
                              >
                                {listItem.label}
                                {isUploading && listItem.checked && (
                                  <LoadingDots />
                                )}
                              </Box>
                            }
                            name={listItem.id}
                            value={listItem.id}
                            checked={listItem.checked}
                            onChange={(evt) => toggleCheckbox(evt)}
                          />
                        </motion.li>
                      )
                    })}
                  </AnimatePresence>
                ) : (
                  <PoliceCaseFilesMessageBox
                    icon="checkmark"
                    iconColor="blue400"
                    message={formatMessage(
                      m.sections.policeCaseFiles.allFilesUploadedMessage,
                    )}
                  />
                )}
              </motion.ul>
            </motion.div>
            <motion.div layout className={styles.uploadToRVGButtonContainer}>
              <Button
                onClick={uploadToRVG}
                loading={isUploading}
                disabled={policeCaseFileList.length === 0}
              >
                {formatMessage(m.sections.policeCaseFiles.uploadButtonLabel)}
              </Button>
            </motion.div>
          </AnimateSharedLayout>
        </Box>
        <Box marginBottom={3}>
          <Text variant="h3" as="h3">
            {formatMessage(m.sections.files.heading)}
          </Text>
        </Box>
        <Box marginBottom={5}>
          <ContentBlock>
            <InputFileUpload
              fileList={files}
              header={formatMessage(m.sections.files.label)}
              buttonLabel={formatMessage(m.sections.files.buttonLabel)}
              onChange={onChange}
              onRemove={onRemove}
              onRetry={onRetry}
              errorMessage={uploadErrorMessage}
              showFileSize
            />
          </ContentBlock>
        </Box>
        <Box>
          <Box marginBottom={3}>
            <Text variant="h3" as="h3">
              {formatMessage(m.sections.comments.heading)}{' '}
              <Tooltip
                placement="right"
                as="span"
                text={formatMessage(m.sections.comments.tooltip)}
              />
            </Text>
          </Box>
          <Box marginBottom={10}>
            <Input
              name="caseFilesComments"
              label={formatMessage(m.sections.comments.label)}
              placeholder={formatMessage(m.sections.comments.placeholder)}
              defaultValue={workingCase?.caseFilesComments}
              onChange={(event) =>
                removeTabsValidateAndSet(
                  'caseFilesComments',
                  event,
                  [],
                  workingCase,
                  setWorkingCase,
                )
              }
              onBlur={(evt) =>
                updateCase(
                  workingCase.id,
                  parseString('caseFilesComments', evt.target.value),
                )
              }
              textarea
              rows={7}
            />
          </Box>
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${Constants.IC_POLICE_REPORT_ROUTE}/${workingCase.id}`}
          nextUrl={`${Constants.IC_POLICE_CONFIRMATION_ROUTE}/${workingCase.id}`}
          nextIsDisabled={!allFilesUploaded || isUploading}
          nextIsLoading={isLoading}
        />
      </FormContentContainer>
    </>
  )
}
export default CaseFilesForm
