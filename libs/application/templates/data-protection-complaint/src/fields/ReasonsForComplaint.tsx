import { Box, Text } from '@island.is/island-ui/core'
import React, { FC, useEffect, useState } from 'react'
import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
  getValueViaPath,
  getErrorViaPath,
} from '@island.is/application/core'
import { useFormContext } from 'react-hook-form'
import {
  CheckboxFormField,
  TextFormField,
} from '@island.is/application/ui-fields'
import { SubjectOfComplaint } from '../shared'
import { complaint } from '../lib/messages'

export const ReasonsForComplaint: FC<FieldBaseProps> = ({
  field,
  application,
  error,
}) => {
  const { register, errors, setValue, unregister } = useFormContext()
  const [statefulOtherReason, setStatefulOtherReason] = useState(
    getValueViaPath(application.answers, 'otherReason' || '') as string,
  )
  const [statefulCheckbox, setStatefulCheckbox] = useState(
    (getValueViaPath(
      application.answers,
      'subjectOfComplaint.values',
    ) as string[]) || [],
  )
  const renderHiddenOtherReasonInput = statefulCheckbox.includes('other')

  useEffect(() => {
    if (!renderHiddenOtherReasonInput) {
      unregister('subjectOfComplaint.somethingElse')
      setValue('subjectOfComplaint.somethingElse', undefined)
    }
  }, [renderHiddenOtherReasonInput, unregister, setValue])

  const onSelect = (selected: string[]) => {
    setStatefulCheckbox(selected)
  }

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setStatefulOtherReason(e.target.value)
  }

  return (
    <div>
      <CheckboxFormField
        application={application}
        error={error}
        field={{
          id: 'subjectOfComplaint.values',
          title: '',
          onSelect,
          type: FieldTypes.CHECKBOX,
          component: FieldComponents.CHECKBOX,
          defaultValue: [],
          backgroundColor: 'blue',
          children: undefined,
          options: [
            {
              label: complaint.labels.subjectAuthorities,
              value: SubjectOfComplaint.WITH_AUTHORITIES,
            },
            {
              label: complaint.labels.subjectLackOfEducation,
              value: SubjectOfComplaint.LACK_OF_EDUCATION,
            },
            {
              label: complaint.labels.subjectSocialMedia,
              value: SubjectOfComplaint.SOCIAL_MEDIA,
            },
            {
              label: complaint.labels.subjectRequestForAccess,
              value: SubjectOfComplaint.REQUEST_FOR_ACCESS,
            },
            {
              label: complaint.labels.subjectRightOfObjection,
              value: SubjectOfComplaint.RIGHTS_OF_OBJECTION,
            },
            {
              label: complaint.labels.subjectEmail,
              value: SubjectOfComplaint.EMAIL,
            },
            {
              label: complaint.labels.subjectNationalId,
              value: SubjectOfComplaint.NATIONAL_ID,
            },
            {
              label: complaint.labels.subjectEmailInWorkplace,
              value: SubjectOfComplaint.EMAIL_IN_WORKPLACE,
            },
            {
              label: complaint.labels.subjectUnauthorizedPublication,
              value: SubjectOfComplaint.UNAUTHORIZED_PUBLICATION,
            },
            {
              label: complaint.labels.subjectVanskilaskra,
              value: SubjectOfComplaint.VANSKILASKRA,
            },
            {
              label: complaint.labels.subjectVideoRecording,
              value: SubjectOfComplaint.VIDEO_RECORDINGS,
            },
            {
              label: complaint.labels.subjectOtherOther,
              value: SubjectOfComplaint.OTHER,
            },
          ],
          large: true,
        }}
      />
      {renderHiddenOtherReasonInput && (
        <>
          <TextFormField
            application={application}
            error={error}
            showFieldName={true}
            field={{
              ...field,
              type: FieldTypes.TEXT,
              component: FieldComponents.TEXT,
              children: undefined,
              defaultValue: application.answers.otherReason || '',
              id: 'subjectOfComplaint.somethingElse',
              title: complaint.labels.subjectSomethingElse,
              placeholder: complaint.labels.subjectSomethingElsePlaceholder,
              backgroundColor: 'blue',
              required: true,
              maxLength: 150,
              onChange,
            }}
          />
          {errors &&
            getErrorViaPath(
              errors,
              'subjectOfComplaint.somethingElseValue',
            ) && (
              <Box color="red600" paddingY={2} display="flex">
                <Text fontWeight="semiBold" color="red600">
                  {getErrorViaPath(
                    errors,
                    'subjectOfComplaint.somethingElseValue',
                  )}
                </Text>
              </Box>
            )}
          <input
            type="hidden"
            ref={register}
            id="subjectOfComplaint.somethingElseValue"
            name="subjectOfComplaint.somethingElseValue"
            value={statefulOtherReason}
          />
        </>
      )}
    </div>
  )
}
