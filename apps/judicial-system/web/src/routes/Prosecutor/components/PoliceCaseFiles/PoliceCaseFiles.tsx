import React, { useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import { AnimatePresence, AnimateSharedLayout, motion } from 'framer-motion'
import cn from 'classnames'

import { PoliceCaseFilesQuery } from '@island.is/judicial-system-web/graphql'
import {
  CaseFile,
  CaseFileState,
  CaseOrigin,
  PoliceCaseFile,
} from '@island.is/judicial-system/types'
import {
  AlertMessage,
  Box,
  Button,
  Checkbox,
  LoadingDots,
  UploadFile,
} from '@island.is/island-ui/core'
import { errors } from '@island.is/judicial-system-web/messages'
import { useS3Upload } from '@island.is/judicial-system-web/src/utils/hooks'
import {
  FormContext,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'

import { policeCaseFiles as m } from './PoliceCaseFiles.strings'
import PoliceCaseFilesMessageBox from '../PoliceCaseFilesMessageBox/PoliceCaseFilesMessageBox'
import * as styles from './PoliceCaseFiles.css'

interface PoliceCaseFilesData {
  files: PoliceCaseFile[]
  isLoading: boolean
  hasError: boolean
  errorCode?: string
}

export interface PoliceCaseFileCheck extends PoliceCaseFile {
  checked: boolean
}

const CheckboxListItem: React.FC<{ key: string }> = ({ children, key }) => (
  <motion.li
    layout
    className={styles.policeCaseFile}
    key={key}
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
    {children}
  </motion.li>
)

interface ListItemProps {
  files: PoliceCaseFileCheck[]
  isUploading: boolean
  onCheck: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const CheckboxList: React.FC<ListItemProps> = ({
  files,
  isUploading,
  onCheck,
}) => (
  <AnimatePresence>
    {files.map((file) => (
      <CheckboxListItem key={file.id}>
        <Checkbox
          label={
            <Box
              display="flex"
              alignItems="center"
              justifyContent="spaceBetween"
            >
              {file.name}
              {isUploading && file.checked && <LoadingDots />}
            </Box>
          }
          name={file.id}
          value={file.id}
          checked={file.checked}
          onChange={onCheck}
        />
      </CheckboxListItem>
    ))}
  </AnimatePresence>
)

interface Props {
  isUploading: boolean
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>
  policeCaseFileList: PoliceCaseFileCheck[]
  setPoliceCaseFileList: React.Dispatch<
    React.SetStateAction<PoliceCaseFileCheck[]>
  >
}

const PoliceCaseFiles: React.FC<Props> = ({
  isUploading,
  setIsUploading,
  policeCaseFileList,
  setPoliceCaseFileList,
}) => {
  const { formatMessage } = useIntl()
  const { workingCase } = useContext(FormContext)
  const router = useRouter()
  const id = router.query.id

  const {
    data: policeData,
    loading: policeDataLoading,
    error: policeDataError,
  } = useQuery(PoliceCaseFilesQuery, {
    variables: { input: { caseId: id } },
    fetchPolicy: 'no-cache',
    skip: workingCase.origin !== CaseOrigin.LOKE,
  })

  const [policeCaseFiles, setPoliceCaseFiles] = useState<PoliceCaseFilesData>()
  useEffect(() => {
    if (workingCase.origin !== CaseOrigin.LOKE) {
      setPoliceCaseFiles({
        files: [],
        isLoading: false,
        hasError: false,
      })
    } else if (policeData && policeData.policeCaseFiles) {
      setPoliceCaseFiles({
        files: policeData.policeCaseFiles,
        isLoading: false,
        hasError: false,
      })
    } else if (policeDataLoading) {
      setPoliceCaseFiles({
        files: policeData ? policeData.policeCaseFiles : [],
        isLoading: true,
        hasError: false,
      })
    } else {
      setPoliceCaseFiles({
        files: policeData ? policeData.policeCaseFiles : [],
        isLoading: false,
        hasError: true,
        errorCode: policeDataError?.graphQLErrors[0]?.extensions?.code as string,
      })
    }
  }, [
    policeData,
    policeDataError,
    policeDataLoading,
    workingCase.origin,
    setPoliceCaseFiles,
  ])

  const [checkAllChecked, setCheckAllChecked] = useState<boolean>(false)

  const { uploadPoliceCaseFile, addFileToCase, files } = useS3Upload(
    workingCase,
  )
  useEffect(() => {
    if (policeCaseFiles) {
      const policeCaseFilesNotStoredInRVG = policeCaseFiles.files.filter(
        (p) => {
          const xFiles = files as CaseFile[]

          return !xFiles.find((f) => f.name === p.name && f.key)
        },
      )

      if (policeCaseFilesNotStoredInRVG.length !== policeCaseFileList.length) {
        setPoliceCaseFileList(
          policeCaseFilesNotStoredInRVG.map((policeCaseFile) => {
            return {
              id: policeCaseFile.id,
              name: policeCaseFile.name,
              checked:
                policeCaseFileList.find((p) => p.id === policeCaseFile.id)
                  ?.checked || false,
            }
          }),
        )
      }
    }
  }, [policeCaseFiles, files, policeCaseFileList, setPoliceCaseFileList])

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
          return { id: l.id, name: l.name, checked: evt.target.checked }
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
        policeCaseFile.name,
      )

      await addFileToCase({
        type: 'application/pdf',
        name: policeCaseFile.name,
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
      <SectionHeading
        title={formatMessage(m.heading)}
        description={formatMessage(m.introduction)}
      />
      <Box marginBottom={5}>
        {workingCase.origin === CaseOrigin.LOKE && (
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
                    label={formatMessage(m.selectAllLabel)}
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
                  policeCaseFiles?.errorCode ===
                  'https://httpstatuses.org/404' ? (
                    <PoliceCaseFilesMessageBox
                      icon="warning"
                      iconColor="yellow400"
                      message={formatMessage(m.caseNotFoundInLOKEMessage)}
                    />
                  ) : (
                    <PoliceCaseFilesMessageBox
                      icon="close"
                      iconColor="red400"
                      message={formatMessage(m.couldNotGetFromLOKEMessage)}
                    />
                  )
                ) : policeCaseFiles?.files.length === 0 ? (
                  <PoliceCaseFilesMessageBox
                    icon="warning"
                    iconColor="yellow400"
                    message={formatMessage(m.noFilesFoundInLOKEMessage)}
                  />
                ) : policeCaseFileList.length > 0 ? (
                  <CheckboxList
                    files={policeCaseFileList}
                    isUploading={isUploading}
                    onCheck={toggleCheckbox}
                  />
                ) : (
                  <PoliceCaseFilesMessageBox
                    icon="checkmark"
                    iconColor="blue400"
                    message={formatMessage(errors.general)}
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
                {formatMessage(m.uploadButtonLabel)}
              </Button>
            </motion.div>
          </AnimateSharedLayout>
        )}
        {workingCase.origin !== CaseOrigin.LOKE && (
          <AlertMessage
            type="info"
            title={formatMessage(m.originNotLokeTitle)}
            message={formatMessage(m.originNotLokeMessage)}
          ></AlertMessage>
        )}
      </Box>
    </>
  )
}

export default PoliceCaseFiles
