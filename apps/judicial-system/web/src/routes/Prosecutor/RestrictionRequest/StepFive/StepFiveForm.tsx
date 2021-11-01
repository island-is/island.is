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
  Button,
  LoadingDots,
  UploadFile,
  Icon,
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
import { rcCaseFiles as m } from '@island.is/judicial-system-web/messages'
import { removeTabsValidateAndSet } from '@island.is/judicial-system-web/src/utils/formHelper'
import { parseString } from '@island.is/judicial-system-web/src/utils/formatters'
import MarkdownWrapper from '@island.is/judicial-system-web/src/shared-components/MarkdownWrapper/MarkdownWrapper'
import { AnimatePresence, AnimateSharedLayout, motion } from 'framer-motion'
import * as styles from './StepFive.css'
import { PoliceCaseFilesData } from './StepFive'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
  policeCaseFiles?: PoliceCaseFilesData
}

interface PoliceCaseFile {
  id: string
  label: string
  checked: boolean
}

export const StepFiveForm: React.FC<Props> = (props) => {
  const { workingCase, setWorkingCase, policeCaseFiles } = props
  const { formatMessage } = useIntl()
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
  const { updateCase } = useCase()

  useEffect(() => {
    if (policeCaseFiles) {
      console.log(files)
      const policeCaseFilesNotStoredInRVG = policeCaseFiles.files.filter(
        (p) => {
          const xFiles = files as CaseFile[]

          return !xFiles.find(
            (f) => f.name === p.name && f.state === CaseFileState.STORED_IN_RVG,
          )
        },
      )

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
  }, [policeCaseFiles, files])

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
    const newPoliceCaseFileList = [...policeCaseFileList]
    const filesToUpload = policeCaseFileList.filter((p) => p.checked)
    let updatedPoliceCaseFileList: PoliceCaseFile[] = policeCaseFileList

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

      updatedPoliceCaseFileList = newPoliceCaseFileList.filter(
        (p) => p.id !== policeCaseFile.id,
      )

      if (index === filesToUpload.length - 1) {
        setIsUploading(false)
      }
    })

    setPoliceCaseFileList(updatedPoliceCaseFileList)
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
              {policeCaseFileList.length > 0 ? (
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
                      strong
                    />
                  </motion.li>
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
                </motion.ul>
              ) : policeCaseFiles?.isLoading ? (
                <Box textAlign="center">
                  <LoadingDots />
                </Box>
              ) : policeCaseFiles?.hasError ? (
                <Box display="flex" alignItems="center" paddingY={3}>
                  <Box display="flex" marginRight={2}>
                    <Icon icon="close" color="red400" />
                  </Box>
                  <Text variant="h5">
                    {formatMessage(m.sections.policeCaseFiles.errorMessage)}
                  </Text>
                </Box>
              ) : (
                <Box display="flex" alignItems="center" paddingY={3}>
                  <Box display="flex" marginRight={2}>
                    <Icon icon="checkmark" color="blue400" />
                  </Box>
                  <Text variant="h5">
                    {formatMessage(
                      m.sections.policeCaseFiles.allFilesUploadedMessage,
                    )}
                  </Text>
                </Box>
              )}
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
              onRemove={(file) => {
                onRemove(file)

                setPoliceCaseFileList([
                  ...policeCaseFileList,
                  (file as unknown) as PoliceCaseFile,
                ])
              }}
              onRetry={onRetry}
              errorMessage={uploadErrorMessage}
              disabled={isUploading}
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
          previousUrl={`${Constants.STEP_FOUR_ROUTE}/${workingCase.id}`}
          nextUrl={`${Constants.STEP_SIX_ROUTE}/${workingCase.id}`}
          nextIsDisabled={!allFilesUploaded}
        />
      </FormContentContainer>
    </>
  )
}
