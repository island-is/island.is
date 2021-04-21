import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import HelpBox from '../../common/HelpBox'
import { AdminAccessDTO } from './../../../entities/dtos/admin-acess.dto'
import { AdminAccess } from './../../../entities/models/admin-access.model'
import { AdminAccessService } from './../../../services/AdminAccessService'
import ValidationUtils from './../../../utils/validation.utils'
import LocalizationUtils from '../../../utils/localization.utils'
import { FormControl } from '../../../entities/common/Localization'
interface Props {
  adminAccess: AdminAccessDTO
  handleSaveButtonClicked?: (admin: AdminAccess) => void
  handleCancel?: () => void
}

interface FormOutput {
  admin: AdminAccessDTO
}

const AdminUserCreateForm: React.FC<Props> = (props: Props) => {
  const { register, handleSubmit, errors, formState } = useForm<FormOutput>()
  const { isSubmitting } = formState
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [localization] = useState<FormControl>(
    LocalizationUtils.getFormControl('AdminUserCreateForm'),
  )
  const admin = props.adminAccess

  useEffect(() => {
    if (props.adminAccess && props.adminAccess.nationalId) {
      setIsEditing(true)
    }
  }, [props.adminAccess])

  const pushEvent = (response: AdminAccess | null) => {
    if (response) {
      if (props.handleSaveButtonClicked) {
        props.handleSaveButtonClicked(response)
      }
      return response
    }
  }

  const create = async (data: AdminAccessDTO): Promise<void> => {
    if (isEditing) {
      const response = await AdminAccessService.update(
        props.adminAccess.nationalId,
        data,
      )
      if (response) {
        pushEvent(response)
      }
    } else {
      const response = await AdminAccessService.create(data)
      if (response) {
        pushEvent(response)
      }
    }
  }

  const save = async (data: FormOutput) => {
    await create(data.admin)
  }

  return (
    <div className="admin-user-create-form">
      <div className="admin-user-create-form__wrapper">
        <div className="admin-user-create-form__container">
          <h1>{isEditing ? localization.editTitle : localization.title}</h1>
          <div className="admin-user-create-form__container__form">
            <div className="admin-user-create-form__help">
              {localization.help}
            </div>
            <form onSubmit={handleSubmit(save)}>
              <div className="admin-user-create-form__container__fields">
                <div className="admin-user-create-form__container__field">
                  <label
                    className="admin-user-create-form__label"
                    htmlFor="nationalId"
                  >
                    {localization.fields['nationalId'].label}
                  </label>
                  <input
                    id="nationalId"
                    type="text"
                    name="admin.nationalId"
                    ref={register({
                      required: true,
                      maxLength: 10,
                      minLength: 10,
                      validate: ValidationUtils.validateNationalId,
                    })}
                    defaultValue={admin.nationalId}
                    className="admin-user-create-form__input"
                    placeholder={localization.fields['nationalId'].placeholder}
                    maxLength={10}
                    title={localization.fields['nationalId'].helpText}
                    readOnly={isEditing}
                  />
                  <HelpBox
                    helpText={localization.fields['nationalId'].helpText}
                  />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="admin.nationalId"
                    message="NationalId must be 10 numeric characters"
                  />
                </div>

                <div className="admin-user-create-form__container__field">
                  <label
                    className="admin-user-create-form__label"
                    htmlFor="email"
                  >
                    {localization.fields['email'].label}
                  </label>
                  <input
                    id="email"
                    type="text"
                    ref={register({
                      required: true,
                      validate: ValidationUtils.validateEmail,
                    })}
                    name="admin.email"
                    defaultValue={admin.email ?? ''}
                    className="admin-user-create-form__input"
                    title={localization.fields['email'].helpText}
                    placeholder={localization.fields['email'].placeholder}
                  />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="admin.email"
                    message={localization.fields['email'].errorMessage}
                  />
                  <HelpBox helpText={localization.fields['email'].helpText} />
                </div>

                <div className="admin-user-create-form__container__field">
                  <label
                    className="admin-user-create-form__label"
                    htmlFor="scope"
                  >
                    {localization.fields['scope'].label}
                  </label>
                  <select
                    id="scope"
                    name="admin.scope"
                    ref={register({ required: true })}
                    title={localization.fields['scope'].helpText}
                  >
                    <option value="auth-admin-api.full_control" selected>
                      Full control
                    </option>
                  </select>

                  <HelpBox helpText={localization.fields['scope'].helpText} />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="admin.scope"
                    message={localization.fields['scope'].errorMessage}
                  />
                </div>

                <div className="admin-user-create-formcontainer__checkbox__field hidden">
                  <label
                    className="admin-user-create-formlabel"
                    htmlFor="active"
                  >
                    {localization.fields['active'].label}
                  </label>
                  <input
                    id="active"
                    type="checkbox"
                    name="admin.active"
                    className="admin-user-create-formcheckbox"
                    defaultChecked={true}
                    ref={register}
                    title={localization.fields['active'].helpText}
                  ></input>
                  <HelpBox helpText={localization.fields['active'].helpText} />
                </div>
              </div>

              <div className="admin-user-create-form__buttons__container">
                <div className="admin-user-create-form__button__container">
                  <button
                    className="admin-user-create-form__button__cancel"
                    type="button"
                    onClick={props.handleCancel}
                  >
                    {localization.cancelButton}
                  </button>
                </div>
                <div className="admin-user-create-form__button__container">
                  <input
                    type="submit"
                    className="admin-user-create-form__button__save"
                    disabled={isSubmitting}
                    value={localization.saveButton}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
export default AdminUserCreateForm
