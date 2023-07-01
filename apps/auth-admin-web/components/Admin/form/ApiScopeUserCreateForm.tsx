import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import HelpBox from '../../common/HelpBox'
import { AccessService } from '../../../services/AccessService'
import ValidationUtils from '../../../utils/validation.utils'
import LocalizationUtils from '../../../utils/localization.utils'
import { FormControl } from '../../../entities/common/Localization'
import { ResourcesService } from '../../../services/ResourcesService'
import { ApiScope } from '../../../entities/models/api-scope.model'
import { ApiScopeUser } from '../../../entities/models/api-scope-user.model'
import { ApiScopeUserDTO } from '../../../entities/dtos/api-scope-user.dto'

interface Props {
  apiScopeUser: ApiScopeUserDTO
  handleSaveButtonClicked?: (apiScopeUser: ApiScopeUser) => void
  handleCancel?: () => void
}

interface FormOutput {
  apiScopeUser: ApiScopeUserDTO
}

const ApiScopeUserCreateForm: React.FC<React.PropsWithChildren<Props>> = (
  props: Props,
) => {
  const { register, handleSubmit, formState } = useForm<FormOutput>()
  const { isSubmitting, errors } = formState
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [localization] = useState<FormControl>(
    LocalizationUtils.getFormControl('ApiScopeUserCreateForm'),
  )
  const [accessControlledScopes, setAccessControlledScopes] = useState<
    ApiScope[]
  >([])
  const [activeScopes, setActiveScopes] = useState<string[]>([])

  const user = props.apiScopeUser

  useEffect(() => {
    const setScopes = async () => {
      const scopes = await ResourcesService.findAllAccessControlledApiScopes()
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

  const pushEvent = (response: ApiScopeUser | null) => {
    if (response) {
      if (props.handleSaveButtonClicked) {
        props.handleSaveButtonClicked(response)
      }
      return response
    }
  }

  const create = async (data: ApiScopeUserDTO): Promise<void> => {
    let response: ApiScopeUser | undefined = undefined

    if (isEditing) {
      response = await AccessService.update(props.apiScopeUser.nationalId, data)
    } else {
      response = await AccessService.create(data)
    }

    if (response) {
      pushEvent(response)
    }
  }

  const save = async ({ apiScopeUser }: FormOutput) => {
    const user = new ApiScopeUserDTO()
    user.nationalId = apiScopeUser.nationalId
    user.email = apiScopeUser.email
    user.name = apiScopeUser.name

    for (let i = 0; i < activeScopes.length; i++) {
      user.userAccess.push({
        nationalId: apiScopeUser.nationalId,
        scope: activeScopes[i],
      })
    }

    await create(user)
  }

  const handleScopeChange = (scopeName: string, active: boolean) => {
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

  return (
    <div className="api-scope-user-create-form">
      <div className="api-scope-user-create-form__wrapper">
        <div className="api-scope-user-create-form__container">
          <h1>{isEditing ? localization.editTitle : localization.title}</h1>
          <div className="api-scope-user-create-form__container__form">
            <div className="api-scope-user-create-form__help">
              {localization.help}
            </div>
            <form onSubmit={handleSubmit(save)}>
              <div className="api-scope-user-create-form__container__fields">
                <div className="api-scope-user-create-form__container__field">
                  <label
                    className="api-scope-user-create-form__label"
                    htmlFor="name"
                  >
                    {localization.fields['name'].label}
                  </label>
                  <input
                    id="name"
                    type="text"
                    {...register('apiScopeUser.name', {
                      minLength: 1,
                      validate: (value) => value.trim().length > 1,
                    })}
                    defaultValue={user.name}
                    className="api-scope-user-create-form__input"
                    placeholder={localization.fields['name'].placeholder}
                    title={localization.fields['name'].helpText}
                  />
                  <HelpBox helpText={localization.fields['name'].helpText} />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="apiScopeUser.name"
                    message={localization.fields['name'].errorMessage}
                  />
                </div>
                <div className="api-scope-user-create-form__container__field">
                  <label
                    className="api-scope-user-create-form__label"
                    htmlFor="nationalId"
                  >
                    {localization.fields['nationalId'].label}
                  </label>
                  <input
                    id="nationalId"
                    type="text"
                    {...register('apiScopeUser.nationalId', {
                      required: true,
                      maxLength: 10,
                      minLength: 10,
                      validate: ValidationUtils.validateNationalId,
                    })}
                    defaultValue={user.nationalId}
                    className="api-scope-user-create-form__input"
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

                <div className="api-scope-user-create-form__container__field">
                  <label
                    className="api-scope-user-create-form__label"
                    htmlFor="email"
                  >
                    {localization.fields['email'].label}
                  </label>
                  <input
                    id="email"
                    type="text"
                    {...register('apiScopeUser.email', {
                      required: true,
                      validate: ValidationUtils.validateEmail,
                    })}
                    defaultValue={user.email ?? ''}
                    className="api-scope-user-create-form__input"
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
                    const checked = activeScopes.some((x) => x === scope.name)

                    return (
                      <div
                        className="api-scope-user-create-form__container__checkbox__field"
                        key={scope.name}
                      >
                        <label
                          className="api-scope-user-create-form__label"
                          htmlFor={scope.name}
                        >
                          {scope.displayName} <i>({scope.name})</i>
                        </label>

                        <input
                          id={scope.name}
                          type="checkbox"
                          {...register(
                            `apiScopeUser.userAccess[${scope.name}]` as any,
                            {
                              onChange: (e) =>
                                handleScopeChange(scope.name, e.target.checked),
                            },
                          )}
                          className="api-scope-user-create-form__checkbox"
                          checked={checked}
                          title={scope.name}
                        ></input>
                        <HelpBox helpText={scope.description} />
                      </div>
                    )
                  })}
              </div>

              <div className="api-scope-user-create-form__buttons__container">
                <div className="api-scope-user-create-form__button__container">
                  <button
                    className="api-scope-user-create-form__button__cancel"
                    type="button"
                    onClick={props.handleCancel}
                    title={localization.buttons['cancel'].helpText}
                  >
                    {localization.buttons['cancel'].text}
                  </button>
                </div>
                <div className="api-scope-user-create-form__button__container">
                  <input
                    type="submit"
                    className="api-scope-user-create-form__button__save"
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
export default ApiScopeUserCreateForm
