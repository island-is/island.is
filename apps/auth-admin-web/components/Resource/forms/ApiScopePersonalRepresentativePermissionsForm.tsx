import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import { FormControl } from '../../../entities/common/Localization'
import LocalizationUtils from '../../../utils/localization.utils'
import { ResourcesService } from '../../../services/ResourcesService'
import { PersonalRepresentativePermissionType } from '../../../entities/models/personal-representative-permission-type.model'
import HelpBox from '../../common/HelpBox'
import { ScopePermission } from '../../../entities/models/personal-representative-scope-permission.model'
import { PersonalRepresentativeScopePermissionDTO } from '../../../entities/dtos/personal-representative-scope-permission.dto'
import NoActiveConnections from '../../common/NoActiveConnections'

interface Inputs {
  permissionType: string
}

interface Props {
  apiScopeName: string
  handleNext?: () => void
  handleBack?: () => void
}

const ApiScopePersonalRepresentativePermissionsForm = (props: Props) => {
  const [permissionTypes, setPermissionTypes] = useState<
    PersonalRepresentativePermissionType[] | null
  >(null)
  const [scopePermissions, setScopePermissions] = useState<
    ScopePermission[] | null
  >(null)
  const [localization] = useState<FormControl>(
    LocalizationUtils.getFormControl(
      'ApiScopePersonalRepresentativePermissions',
    ),
  )
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>()
  const selectedItem = watch('permissionType')

  useEffect(() => {
    // Get list of available permissions
    async function fetchPermissionTypes() {
      const response =
        await ResourcesService.getPersonalRepresentativePermissionTypes()
      if (response) {
        setPermissionTypes(response.data)
      } else {
        setPermissionTypes(null)
      }
    }
    fetchPermissionTypes()
  }, [])

  useEffect(() => {
    // Get list of current scope's permissions
    async function fetchScopePermissions() {
      const response =
        await ResourcesService.getPersonalRepresentativeScopePermissions(
          props.apiScopeName,
        )
      if (response) {
        setScopePermissions(response)
      } else {
        setScopePermissions(null)
      }
    }
    fetchScopePermissions()
  }, [props.apiScopeName])

  const getScopePermissions = async () => {
    const response =
      await ResourcesService.getPersonalRepresentativeScopePermissions(
        props.apiScopeName,
      )
    if (response) {
      setScopePermissions(response)
    } else {
      setScopePermissions(null)
    }
  }

  const deleteScopePermission = async (id: string) => {
    await ResourcesService.deletePersonalRepresentativeScopePermission(id)
    getScopePermissions()
  }

  const save = async (data: Inputs) => {
    const scopePermission: PersonalRepresentativeScopePermissionDTO = {
      permission: data.permissionType,
      apiScopeName: props.apiScopeName,
    }
    await ResourcesService.createPersonalRepresentativeScopePermission(
      scopePermission,
    )

    getScopePermissions()
  }

  const scopePermissionContains = (value: string) => {
    const item =
      scopePermissions &&
      scopePermissions.find((x) => x.rightTypeCode === value)
    return !item ? false : true
  }

  return (
    <div className="personal-representative-permissions-form">
      <div className="personal-representative-permissions-form__wrapper">
        <div className="personal-representative-permissions-form__container">
          <h1>{localization.title}</h1>
          <div className="personal-representative-permissions-form__container__form">
            <div className="personal-representative-permissions-form__help">
              {localization.help}
            </div>
            <form onSubmit={handleSubmit(save)}>
              <div className="personal-representative-permissions-form__container__fields">
                <div className="personal-representative-permissions-form__container__field">
                  <label
                    className="personal-representative-permissions-form__label"
                    htmlFor="permissionType"
                  >
                    {localization.fields['permissionType'].label}
                  </label>
                  <select
                    id="permissionType"
                    className="personal-representative-permissions-form__select"
                    {...register('permissionType', {
                      required: 'Permission type is required',
                    })}
                    title={localization.fields['permissionType'].helpText}
                  >
                    {permissionTypes &&
                      permissionTypes.map((option) => {
                        return (
                          <option
                            value={option.code}
                            key={option.code}
                            title={option.description}
                          >
                            {option.code}
                          </option>
                        )
                      })}
                  </select>
                  <HelpBox
                    helpText={localization.fields['permissionType'].helpText}
                  />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="permissionType"
                  />
                  <input
                    type="submit"
                    className="personal-representative-permissions-form__button__add"
                    disabled={
                      selectedItem === null ||
                      scopePermissionContains(selectedItem)
                    }
                    value={localization.buttons['add'].text}
                    title={localization.buttons['add'].helpText}
                  />
                </div>
                <div className="personal-representative-permissions-form__selected__description">
                  {
                    permissionTypes?.find((pt) => pt.code === selectedItem)
                      ?.description
                  }
                </div>
              </div>
            </form>

            {scopePermissions && scopePermissions.length > 0 && (
              <div className="personal-representative-permissions-form__container__list show">
                <h3>Scope permissions</h3>
                {scopePermissions.map((permission) => (
                  <div
                    key={permission.rightTypeCode}
                    className="personal-representative-permissions-form__container__list__item"
                  >
                    <div className="list-name">{permission.rightTypeCode}</div>
                    <div className="list-value">
                      {permission.rightType.description}
                    </div>
                    <div className="list-remove">
                      <button
                        onClick={() => deleteScopePermission(permission.id)}
                        className="personal-representative-permissions-form__container__list__button__remove"
                        title={localization.buttons['remove'].helpText}
                      >
                        <i className="icon__delete"></i>
                        <span>{localization.buttons['remove'].text}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <NoActiveConnections
              title={localization.noActiveConnections.title}
              show={!scopePermissions || scopePermissions.length === 0}
              helpText={localization.noActiveConnections.helpText}
            />

            <div className="personal-representative-permissions-form__buttons__container">
              <div className="personal-representative-permissions-form__button__container">
                <button
                  type="button"
                  className="personal-representative-permissions-form__button__cancel"
                  title={localization.buttons['cancel'].helpText}
                  onClick={props.handleBack}
                >
                  {localization.buttons['cancel'].text}
                </button>
              </div>
              <div className="personal-representative-permissions-form__button__container">
                <button
                  type="button"
                  className="personal-representative-permissions-form__button__save"
                  onClick={props.handleNext}
                  title={localization.buttons['save'].helpText}
                >
                  {localization.buttons['save'].text}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApiScopePersonalRepresentativePermissionsForm
