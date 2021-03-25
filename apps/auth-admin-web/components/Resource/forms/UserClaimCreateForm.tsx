import React, { useEffect, useState } from 'react'
import HelpBox from '../../common/HelpBox'
import { ErrorMessage } from '@hookform/error-message'
import { useForm } from 'react-hook-form'
import ValidationUtils from './../../../utils/validation.utils'
import { UserClaimDTO } from './../../../entities/dtos/user-claim-dto'

interface Props {
  resourceName: string
  handleSave: (claimName: string) => void
  existingClaims: string[]
}

const UserClaimCreateForm: React.FC<Props> = (props: Props) => {
  const { register, handleSubmit, errors, reset } = useForm<UserClaimDTO>()
  const [visible, setVisible] = useState<boolean>(false)
  const [isAvailable, setIsAvailable] = useState<boolean>(true)
  const [claimLength, setClaimLength] = useState<number>(0)

  useEffect(() => {}, [])

  const save = (data: UserClaimDTO): void => {
    props.handleSave(data.claimName)
    setVisible(false)
    setClaimLength(0)
    reset()
  }

  const checkAvailability = async (claimName: string) => {
    setClaimLength(claimName.length)
    const lowercaseArray = props.existingClaims.map((x) => x.toLowerCase())
    if (lowercaseArray.includes(claimName.toLowerCase())) {
      setIsAvailable(false)
    } else {
      setIsAvailable(true)
    }
  }

  return (
    <div className="user-claim-create-form">
      <div className="user-claim-create-form__button__show">
        <a
          className="user-claim__button__show"
          onClick={() => setVisible(!visible)}
          title={`Create new claim`}
        >
          <i className="icon__new"></i>
          <span>Create new Claim</span>
        </a>
      </div>

      <div
        className={`user-claim-create-form__wrapper ${
          visible ? 'show' : 'hidden'
        }`}
      >
        <div className="user-claim-create-form__container">
          <h1>Create new User Claim</h1>

          <div className="user-claim-create-form__container__form">
            <div className="user-claim-create-form__help">
              Create a new claim if needed for this resource
            </div>

            <form onSubmit={handleSubmit(save)}>
              <div className="user-claim-create-form__container__fields">
                <div className="user-claim-create-form__container__field">
                  <label
                    className="user-claim-create-form__label"
                    htmlFor="claimName"
                  >
                    Claim Name
                  </label>
                  <input
                    id="claimName"
                    type="text"
                    name="claimName"
                    className="user-claim-create-form__input"
                    title={`Write a name for the claim. It needs to be one word without special characters`}
                    onChange={(e) => checkAvailability(e.target.value)}
                    ref={register({
                      required: true,
                      validate: ValidationUtils.validateIdentifier,
                    })}
                  />
                  <div
                    className={`user-claim-create-form__container__field__available ${
                      isAvailable ? 'ok ' : 'taken '
                    } ${claimLength > 0 ? 'show' : 'hidden'}`}
                  >
                    {isAvailable ? 'Available' : 'Unavailable'}
                  </div>

                  <HelpBox
                    helpText={
                      'Write a name for the claim. It needs to be one word without special characters'
                    }
                  />

                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="claimName"
                    message="Claim name is required and needs to be in the right format"
                  />
                </div>
              </div>

              <div className="user-claim-create-form__buttons__container">
                <div className="user-claim-create-form__button__container">
                  <button
                    type="button"
                    className="user-claim-create-form__button__cancel"
                    value="Cancel"
                    onClick={(e) => setVisible(false)}
                  >
                    Cancel
                  </button>
                </div>
                <div className="user-claim-create-form__button__container">
                  <button
                    type="submit"
                    className="user-claim-create-form__button__save"
                    value="Save"
                    disabled={!isAvailable}
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
export default UserClaimCreateForm
