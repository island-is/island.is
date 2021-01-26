import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import HelpBox from '../../common/HelpBox'
import { AdminAccessDTO } from './../../../entities/dtos/admin-acess.dto'
import { AdminAccess } from './../../../entities/models/admin-access.model'
import { AdminAccessService } from './../../../services/AdminAccessService'
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
          <h1>{isEditing ? 'Edit Admin User' : 'Create a new Admin User'}</h1>
          <div className="admin-user-create-form__container__form">
            <div className="admin-user-create-form__help">
              Add user for the Admin UI by filling out the form
            </div>
            <form onSubmit={handleSubmit(save)}>
              <div className="admin-user-create-form__container__fields">
                <div className="admin-user-create-form__container__field">
                  <label className="admin-user-create-form__label">
                    National Id (Kennitala)
                  </label>
                  <input
                    type="text"
                    name="admin.nationalId"
                    ref={register({
                      required: true,
                      maxLength: 10,
                      minLength: 10,
                      pattern: /\d+/,
                    })}
                    defaultValue={admin.nationalId}
                    className="admin-user-create-form__input"
                    placeholder="0123456789"
                    maxLength={10}
                    title="The nationalId (Kennitala) of the Admin User"
                    readOnly={isEditing}
                  />
                  <HelpBox helpText="The nationalId (Kennitala) of the Admin User" />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="admin.nationalId"
                    message="NationalId must be 10 numeric characters"
                  />
                </div>

                <div className="admin-user-create-form__container__field">
                  <label className="admin-user-create-form__label">
                    User email
                  </label>
                  <input
                    type="text"
                    ref={register({
                      required: true,
                      pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                    })}
                    name="admin.email"
                    defaultValue={admin.email ?? ''}
                    className="admin-user-create-form__input"
                    title="The email of the admin user"
                    placeholder="john@example.com"
                  />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="admin.email"
                    message="Email is required and needs to be in a right format"
                  />
                  <HelpBox helpText="The email of the admin user" />
                </div>

                <div className="admin-user-create-form__container__field">
                  <label className="admin-user-create-form__label">Scope</label>
                  <select
                    name="admin.scope"
                    ref={register({ required: true })}
                    title="Select the appropriate Scope for this Admin User"
                  >
                    <option value="auth-admin-api.full_control" selected>
                      Full control
                    </option>
                  </select>

                  <HelpBox helpText="Select the appropriate Scope for this Admin User" />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="admin.scope"
                    message="Select the appropriate Scope for this Admin User"
                  />
                </div>

                <div className="admin-user-create-formcontainer__checkbox__field hidden">
                  <label className="admin-user-create-formlabel">Active</label>
                  <input
                    type="checkbox"
                    name="admin.active"
                    className="admin-user-create-formcheckbox"
                    defaultChecked={true}
                    ref={register}
                  ></input>
                  <HelpBox helpText="Sets if user is active or not" />
                </div>
              </div>

              <div className="admin-user-create-form__buttons__container">
                <div className="admin-user-create-form__button__container">
                  <button
                    className="admin-user-create-form__button__cancel"
                    type="button"
                    onClick={props.handleCancel}
                  >
                    Cancel
                  </button>
                </div>
                <div className="admin-user-create-form__button__container">
                  <input
                    type="submit"
                    className="admin-user-create-form__button__save"
                    disabled={isSubmitting}
                    value="Save"
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
