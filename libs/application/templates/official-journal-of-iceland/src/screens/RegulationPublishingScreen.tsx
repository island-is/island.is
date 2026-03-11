import { useEffect, useRef, useState } from 'react'
import { useLocale } from '@island.is/localization'
import { FormScreen } from '../components/form/FormScreen'
import { FormGroup } from '../components/form/FormGroup'
import { InputFields, OJOIFieldBaseProps } from '../lib/types'
import { error, publishing } from '../lib/messages'
import { OJOIDateController } from '../components/input/OJOIDateController'
import { useApplication } from '../hooks/useUpdateApplication'
import { useRegulationDraft } from '../hooks/useRegulationDraft'
import { useCategories } from '../hooks/useCategories'
import { CommunicationChannels } from '../fields/CommunicationChannels'
import {
  AlertMessage,
  Box,
  Icon,
  Inline,
  Select,
  SkeletonLoader,
  Tag,
} from '@island.is/island-ui/core'
import addYears from 'date-fns/addYears'
import set from 'lodash/set'
import { getDefaultDate, getExcludedDates, getFastTrack } from '../lib/utils'
import { OJOI_INPUT_HEIGHT } from '../lib/constants'
import { baseEntitySchema } from '../lib/dataSchema'
import { z } from 'zod'

export const RegulationPublishingScreen = (props: OJOIFieldBaseProps) => {
  const { formatMessage: f } = useLocale()
  const { application } = props

  const { application: currentApplication, updateApplication } = useApplication(
    {
      applicationId: application.id,
    },
  )

  const [isUpdatingCategory, setIsUpdatingCategory] = useState(false)
  const {
    categories,
    error: categoryError,
    loading: categoryLoading,
  } = useCategories()

  const onCategoryChange = (value?: z.infer<typeof baseEntitySchema>) => {
    setIsUpdatingCategory(true)
    if (!value) {
      setIsUpdatingCategory(false)
      return
    }

    const currentAnswers = structuredClone(currentApplication.answers)
    const selectedCategories = currentAnswers.advert?.categories || []

    const newCategories = selectedCategories.find((cat) => cat.id === value.id)
      ? selectedCategories.filter((c) => c.id !== value.id)
      : [...selectedCategories, value]

    const updatedAnswers = set(
      currentAnswers,
      InputFields.advert.categories,
      newCategories,
    )

    updateApplication(updatedAnswers, () => {
      setIsUpdatingCategory(false)
    })
  }

  const mappedCategories = categories?.map((c) => ({
    label: c.title,
    value: c,
  }))

  const selectedCategories = currentApplication.answers.advert?.categories

  const { draftId, draftData, loadDraft, saveDraft, updateDraftField } =
    useRegulationDraft({
      applicationId: application.id,
      answers: application.answers as unknown as Record<string, unknown>,
    })

  // Load regulation draft on mount to get current fastTrack state
  const loadRef = useRef(false)
  useEffect(() => {
    if (loadRef.current || !draftId) return
    loadRef.current = true
    loadDraft()
  }, [draftId, loadDraft])

  const today = new Date()
  const maxEndDate = addYears(today, 5)
  const minDate = new Date()
  if (minDate.getHours() >= 12) {
    minDate.setDate(minDate.getDate() + 1)
  }

  const defaultDate = getDefaultDate(
    currentApplication.answers.advert?.requestedDate,
  )

  const [fastTrack, setFastTrack] = useState(
    getFastTrack(new Date(defaultDate)).fastTrack,
  )

  const saveDraftRef = useRef(saveDraft)
  saveDraftRef.current = saveDraft

  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>()

  const saveDraftNow = () => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => saveDraftRef.current(), 50)
  }

  const handleDateChange = (date: string) => {
    const isFastTrack = getFastTrack(new Date(date)).fastTrack
    setFastTrack(isFastTrack)

    // Persist fast track to the regulation DB
    updateDraftField('fastTrack', isFastTrack)
    saveDraftNow()
  }

  // Save regulation fast track to DB on navigation
  const handleNavigate = (screenId?: string) => {
    if (draftId) {
      saveDraft()
    }
    props.goToScreen?.(screenId ?? '')
  }

  return (
    <FormScreen
      title={f(publishing.general.title)}
      intro={f(publishing.general.intro)}
      goToScreen={handleNavigate}
    >
      <FormGroup title={f(publishing.headings.date)}>
        <Box width="half">
          <OJOIDateController
            name={InputFields.advert.requestedDate}
            label={f(publishing.inputs.datepicker.label)}
            placeholder={f(publishing.inputs.datepicker.placeholder)}
            applicationId={application.id}
            excludeDates={getExcludedDates(today, maxEndDate)}
            minDate={minDate}
            maxDate={maxEndDate}
            defaultValue={defaultDate}
            onChange={handleDateChange}
          />
        </Box>
        {fastTrack && (
          <AlertMessage
            type="info"
            title={f(publishing.headings.fastTrack)}
            message={f(publishing.headings.fastTrackMessage)}
          />
        )}
      </FormGroup>
      <FormGroup>
        <Box width="half">
          {categoryLoading ? (
            <SkeletonLoader repeat={2} height={OJOI_INPUT_HEIGHT} space={2} />
          ) : categoryError ? (
            <AlertMessage
              type="error"
              message={f(error.fetchFailedTitle)}
              title={f(error.fetchFailedTitle)}
            />
          ) : (
            <>
              <Select
                size="sm"
                label={f(publishing.inputs.contentCategories.label)}
                backgroundColor="blue"
                placeholder={f(publishing.inputs.contentCategories.placeholder)}
                options={mappedCategories}
                onChange={(opt) => onCategoryChange(opt?.value)}
                filterConfig={{
                  matchFrom: 'start',
                }}
              />
              <Box marginTop={1}>
                <Inline space={1} flexWrap="wrap">
                  {selectedCategories?.map((c) => (
                    <Tag
                      disabled={isUpdatingCategory}
                      onClick={() => onCategoryChange(c)}
                      outlined
                      key={c.id}
                    >
                      <Box display="flex" alignItems="center">
                        {c.title}
                        <Icon icon="close" size="small" />
                      </Box>
                    </Tag>
                  ))}
                </Inline>
              </Box>
            </>
          )}
        </Box>
      </FormGroup>
      <CommunicationChannels {...props} />
    </FormScreen>
  )
}

export default RegulationPublishingScreen
