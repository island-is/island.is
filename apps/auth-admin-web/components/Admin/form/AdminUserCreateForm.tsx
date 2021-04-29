import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import HelpBox from '../../common/HelpBox'
import { AdminAccessService } from './../../../services/AdminAccessService'
import ValidationUtils from './../../../utils/validation.utils'
import LocalizationUtils from '../../../utils/localization.utils'
import { FormControl } from '../../../entities/common/Localization'
import { ResourcesService } from './../../../services/ResourcesService'
import { ApiScope } from './../../../entities/models/api-scope.model'
import { ApiScopeUser } from './../../../entities/models/api-scope-user.model'
import { ApiScopeUserDTO } from './../../../entities/dtos/api-scope-user.dto'
import { ApiScopeUserAccess } from './../../../entities/models/api-scope-user-access.model'
import { ApiScopeUserAccessDTO } from './../../../entities/dtos/api-scope-user-access.dto'
interface Props {
  apiScopeUser: ApiScopeUserDTO
  handleSaveButtonClicked?: (apiScopeUser: ApiScopeUser) => void
  handleCancel?: () => void
}

interface FormOutput {
  apiScopeUser: ApiScopeUserDTO
}

const AdminUserCreateForm: React.FC<Props> = (props: Props) => {
  const { register, handleSubmit, errors, formState } = useForm<FormOutput>()
  const { isSubmitting } = formState
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [localization] = useState<FormControl>(
    LocalizationUtils.getFormControl('AdminUserCreateForm'),
  )
  const [accessControlledScopes, setAccessControlledScopes] = useState<
    ApiScope[]
  >([])
  const [activeScopes, setActiveScopes] = useState<string[]>([])
  const [showScopeInfo, setShowScopeInfo] = useState<boolean>(false)
  const [scopeInfo, setScopeInfo] = useState<JSX.Element>(<div></div>)

  const user = props.apiScopeUser

  useEffect(() => {
    const setScopes = async () => {
      const scopes = await ResourcesService.findAllAccessControlledApiScopes()
      console.log(scopes)
      if (scopes) {
        setAccessControlledScopes(scopes)
      }
    }
    if (props.apiScopeUser && props.apiScopeUser.nationalId) {
      setIsEditing(true)
    }

    setScopes()
    setActiveScopes(props.apiScopeUser.userAccess.map((x) => x.scope))
  }, [props.apiScopeUser])

  useEffect(() => {
    user.userAccess.find((x) => x.scope === 'isAccessControlled')

    // if (accessControlledScopes) {
    //   if (user.userAccess) {
    //     getScopeInfo(user.userAccess)
    //   } else {
    //     if (accessControlledScopes.length > 0) {
    //       getScopeInfo(accessControlledScopes[0].name)
    //     }
    //   }
    // }
  }, [accessControlledScopes])

  const pushEvent = (response: ApiScopeUser | null) => {
    if (response) {
      if (props.handleSaveButtonClicked) {
        props.handleSaveButtonClicked(response)
      }
      return response
    }
  }

  const create = async (data: ApiScopeUserDTO): Promise<void> => {
    if (isEditing) {
      const response = await AdminAccessService.update(
        props.apiScopeUser.nationalId,
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
    // console.log(props.apiScopeUser)
    console.log(data.apiScopeUser.nationalId)
    const user = new ApiScopeUserDTO()
    user.nationalId = data.apiScopeUser.nationalId
    user.email = data.apiScopeUser.email

    for (let i = 0; i < activeScopes.length; i++) {
      user.userAccess.push({
        nationalId: data.apiScopeUser.nationalId,
        scope: activeScopes[i],
      })
    }
    console.log(user)
    await create(user)
  }

  const getScopeInfo = (name: string): void => {
    const scope = accessControlledScopes.find((x) => x.name === name)
    setScopeInfo(getScopeHtml(scope))
  }

  const handleScopeChange = (scopeName: string, active: boolean) => {
    console.log(scopeName)
    console.log(active)
    const found = activeScopes.find((x) => x === scopeName)
    if (active) {
      if (!found) {
        activeScopes.push(scopeName)
      }
    } else {
      if (found) {
        const index = activeScopes.indexOf(found)
        activeScopes.splice(index, 1)
      }
    }
    setActiveScopes([...activeScopes])
  }

  const getScopeHtml = (scope: ApiScope): JSX.Element => {
    if (scope) {
      return (
        <div className="detail-container">
          <div className="detail-title">{scope.name}</div>
          {/* <div className="detail-description">{scope.displayName}</div> */}
          <div className="detail-description">{scope.description}</div>
        </div>
      )
    } else {
      return <div></div>
    }
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
                    name="apiScopeUser.nationalId"
                    ref={register({
                      required: true,
                      maxLength: 10,
                      minLength: 10,
                      validate: ValidationUtils.validateNationalId,
                    })}
                    defaultValue={user.nationalId}
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
                    name="apiScopeUser.nationalId"
                    message={localization.fields['nationalId'].errorMessage}
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
                    name="apiScopeUser.email"
                    defaultValue={user.email ?? ''}
                    className="admin-user-create-form__input"
                    title={localization.fields['email'].helpText}
                    placeholder={localization.fields['email'].placeholder}
                  />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="apiScopeUser.email"
                    message={localization.fields['email'].errorMessage}
                  />
                  <HelpBox helpText={localization.fields['email'].helpText} />
                </div>

                {accessControlledScopes &&
                  accessControlledScopes.map((scope: ApiScope) => {
                    let checked = activeScopes.some((x) => x === scope.name)

                    return (
                      <div className="admin-user-create-form__container__checkbox__field">
                        <label
                          className="admin-user-create-form__label"
                          htmlFor={scope.name}
                        >
                          {scope.name}
                        </label>

                        <input
                          id={scope.name}
                          type="checkbox"
                          name={`apiScopeUser.userAccess[${scope.name}]`}
                          className="admin-user-create-form__checkbox"
                          checked={checked}
                          ref={register}
                          title={scope.name}
                          onChange={(e) =>
                            handleScopeChange(scope.name, e.target.checked)
                          }
                        ></input>
                        <HelpBox helpText={scope.description} />
                      </div>
                    )
                  })}
              </div>

              <div className="admin-user-create-form__buttons__container">
                <div className="admin-user-create-form__button__container">
                  <button
                    className="admin-user-create-form__button__cancel"
                    type="button"
                    onClick={props.handleCancel}
                    title={localization.buttons['cancel'].helpText}
                  >
                    {localization.buttons['cancel'].text}
                  </button>
                </div>
                <div className="admin-user-create-form__button__container">
                  <input
                    type="submit"
                    className="admin-user-create-form__button__save"
                    disabled={isSubmitting}
                    title={localization.buttons['save'].helpText}
                    value={localization.buttons['save'].text}
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
