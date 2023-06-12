/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import HelpBox from '../../common/HelpBox'
import NotFound from '../../common/NotFound'
import { UserService } from '../../../services/UserService'
import UserIdentity from '../../../entities/models/user-identity.model'
import { Claim } from '../../../entities/models/claim.model'
import ValidationUtils from '../../../utils/validation.utils'
import LocalizationUtils from '../../../utils/localization.utils'
import { ListControl } from '../../../entities/common/Localization'

interface ClaimShow {
  subjectId: string
  show: boolean
}

interface FormOutput {
  id: string
}

const UsersList: React.FC<React.PropsWithChildren<unknown>> = () => {
  const [users, setUsers] = useState<UserIdentity[]>([])
  const [id, setId] = useState<string>('')
  const [claimShow, setClaimShow] = useState<ClaimShow[]>([])
  const [showNotFound, setShowNotFound] = useState<boolean>(false)
  const { handleSubmit, register, formState } = useForm()
  const { isSubmitting, errors } = formState
  const [localization] = useState<ListControl>(
    LocalizationUtils.getListControl('UsersList'),
  )

  const getIndex = (subjectId: string): number => {
    for (let i = 0; i < claimShow.length; i++) {
      if (claimShow[i].subjectId === subjectId) {
        return i
      }
    }
    return -1
  }

  const getUser = async (data: FormOutput) => {
    setShowNotFound(false)
    const response = await UserService.findUser(data.id)
    if (response && response.length > 0) {
      setUsers(response)
    } else {
      setShowNotFound(true)
      setUsers([])
    }

    setId(data.id)
  }

  const toggleActive = async (user: UserIdentity) => {
    await UserService.toggleActive(user.subjectId, !user.active)
    getUser({ id: id })
  }

  const handleShowClaimsClicked = (
    user: UserIdentity,
    show = true,
  ): ClaimShow => {
    const index = getIndex(user.subjectId)
    let ret = { subjectId: user.subjectId, show: show }
    if (index === -1) {
      claimShow.push(ret)
    } else {
      claimShow[index].show = !claimShow[index].show
      ret = claimShow[index]
    }

    setClaimShow([...claimShow])
    return ret
  }

  const showClaims = (user: UserIdentity): boolean => {
    const index = getIndex(user.subjectId)
    if (index === -1) {
      return false
    } else {
      return claimShow[index].show
    }
  }

  return (
    <div className="users">
      <div className="users__wrapper">
        <div className="users__container">
          <h1>{localization.title}</h1>
          <div className="users__container__form">
            <form onSubmit={handleSubmit(getUser)}>
              <div className="users__container__fields">
                <div className="users__container__field">
                  <label className="users__label" htmlFor="search">
                    {localization.search.label}
                  </label>
                  <input
                    id="search"
                    type="text"
                    {...register('id', {
                      required: true,
                      validate: ValidationUtils.validateIdentifier,
                    })}
                    defaultValue={''}
                    className="users__search__input"
                    placeholder={localization.search.placeholder}
                  />
                  <HelpBox helpText={localization.search.helpText} />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="id"
                    message={localization.search.errorMessage}
                  />
                  <input
                    type="submit"
                    value={localization.buttons['search'].text}
                    title={localization.buttons['search'].helpText}
                    disabled={isSubmitting}
                    className="users__button__search"
                  />
                </div>
              </div>
            </form>
          </div>

          <div
            className={`users__container__table ${
              users && users.length > 0 ? 'show' : 'hidden'
            }`}
          >
            <h3>{localization.sections['usersList'].title}</h3>
            <table className="users__table">
              <thead>
                <tr>
                  <th>{localization.columns['subjectId'].headerText}</th>
                  <th>{localization.columns['name'].headerText}</th>
                  <th>{localization.columns['providerName'].headerText}</th>
                  <th>
                    {localization.columns['providerSubjectId'].headerText}
                  </th>
                  <th colSpan={2}></th>
                </tr>
              </thead>
              <tbody>
                {users.map((user: UserIdentity) => {
                  return (
                    <tr key={user.subjectId}>
                      <td>{user.subjectId}</td>
                      <td>{user.name}</td>
                      <td>{user.providerName}</td>
                      <td>{user.providerSubjectId}</td>
                      <td className="overlay-container">
                        <button
                          type="button"
                          className="users__button__view"
                          onClick={() => handleShowClaimsClicked(user)}
                          title={localization.buttons['view'].helpText}
                        >
                          {localization.buttons['view'].text}
                        </button>

                        <div
                          className={`users__claim__overlay users__container__list ${
                            showClaims(user) ? 'show' : 'hidden'
                          }`}
                        >
                          <a
                            className="users__container__button__close"
                            onClick={() => handleShowClaimsClicked(user)}
                          >
                            &times;
                          </a>
                          {user.claims?.map((claim: Claim) => {
                            return (
                              <div
                                className="users__container__list__item"
                                key={claim.type}
                              >
                                <div className="list-name">{claim.type}:</div>
                                <div className="list-value">{claim.value}</div>
                              </div>
                            )
                          })}
                        </div>
                      </td>
                      <td>
                        <button
                          type="button"
                          className={`users__button__delete ${
                            user.active === true
                              ? 'button__warning'
                              : 'button__ok'
                          }`}
                          onClick={() => toggleActive(user)}
                          title={
                            user.active
                              ? localization.buttons['deactivate'].helpText
                              : localization.buttons['activate'].helpText
                          }
                        >
                          {user.active
                            ? localization.buttons['deactivate'].text
                            : localization.buttons['activate'].text}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {showNotFound && (
            <NotFound title={localization.sections['notFound'].title}>
              {localization.sections['notFound'].title}: {id}
            </NotFound>
          )}
        </div>
      </div>
    </div>
  )
}

export default UsersList
