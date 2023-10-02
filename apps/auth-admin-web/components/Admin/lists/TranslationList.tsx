/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'
import Paginator from '../../common/Paginator'
import Link from 'next/link'
import ConfirmModal from '../../common/ConfirmModal'
import { TranslationService } from './../../../services/TranslationService'
import { TranslationDTO } from './../../../entities/dtos/translation.dto'
import { Translation } from './../../../entities/models/translation.model'
import LocalizationUtils from '../../../utils/localization.utils'
import { ListControl } from '../../../entities/common/Localization'

const TranslationList: React.FC<React.PropsWithChildren<unknown>> = () => {
  const [translations, setTranslations] = useState<Translation[]>([])
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [translationToRemove, setTranslationToRemove] =
    useState<TranslationDTO>(new TranslationDTO())
  const [count, setCount] = useState(0)
  const [modalIsOpen, setIsOpen] = React.useState(false)
  const [searchString, setSearchString] = useState<string>('')
  const [localization] = useState<ListControl>(
    LocalizationUtils.getListControl('TranslationList'),
  )

  const getTranslations = async (
    searchString: string,
    page: number,
    count: number,
  ): Promise<void> => {
    const response = await TranslationService.findAndCountAllTranslations(
      searchString,
      page,
      count,
    )
    if (response) {
      setTranslations(response.rows)
      setLastPage(Math.ceil(response.count / count))
    }
  }

  const handlePageChange = async (
    page: number,
    count: number,
  ): Promise<void> => {
    getTranslations(searchString, page, count)
    setPage(page)
    setCount(count)
  }

  const deleteTranslation = async (): Promise<void> => {
    const translationObj = new TranslationDTO()
    translationObj.className = translationToRemove.className
    translationObj.key = translationToRemove.key
    translationObj.language = translationToRemove.language
    translationObj.property = translationToRemove.property
    const response = await TranslationService.deleteTranslation(translationObj)
    if (response) {
      getTranslations(searchString, page, count)
    }

    closeModal()
  }

  const confirmDelete = async (translation: TranslationDTO): Promise<void> => {
    setTranslationToRemove(translation)
    setIsOpen(true)
  }

  const closeModal = (): void => {
    setIsOpen(false)
  }

  const setHeaderElement = (): JSX.Element => {
    return (
      <p>
        {localization.removeConfirmation}
        <span>{translationToRemove.language} </span>
      </p>
    )
  }

  const search = (event) => {
    getTranslations(searchString, page, count)
    event.preventDefault()
  }

  const handleSearchChange = (event) => {
    setSearchString(event.target.value)
  }

  return (
    <div>
      <div className="translation-list">
        <div className="translation-list__wrapper">
          <div className="translation-list__container">
            <h1>{localization.title}</h1>
            <div className="translation-list__container__options">
              <div className="translation-list__container__options__button">
                <Link
                  href={'/admin/translation'}
                  className="translation-list__button__new"
                  title={localization.buttons['new'].helpText}
                >
                  <i className="icon__new"></i>
                  {localization.buttons['new'].text}
                </Link>
              </div>
              <form onSubmit={search}>
                <div className="translation-list__container__options__search">
                  <label htmlFor="search" className="translation-list__label">
                    {localization.search.label}
                  </label>
                  <input
                    id="search"
                    className="translation-list__input__search"
                    value={searchString}
                    onChange={handleSearchChange}
                  ></input>
                  <button
                    type="submit"
                    className="translation-list__button__search"
                    title={localization.buttons['search'].helpText}
                  >
                    {localization.buttons['search'].text}
                  </button>
                </div>
              </form>
            </div>
            <div className="translation-list__container__table">
              <table className="translation-list__table">
                <thead>
                  <tr>
                    <th>{localization.columns['language'].headerText}</th>
                    <th>{localization.columns['key'].headerText}</th>
                    <th>{localization.columns['className'].headerText}</th>
                    <th>{localization.columns['property'].headerText}</th>
                    <th>{localization.columns['value'].headerText}</th>
                    <th colSpan={2}></th>
                  </tr>
                </thead>
                <tbody>
                  {translations.map((translation: Translation) => {
                    return (
                      <tr
                        key={
                          translation.language +
                          translation.className +
                          translation.property +
                          translation.key
                        }
                      >
                        <td>{translation.language}</td>
                        <td>{translation.key}</td>
                        <td>{translation.className}</td>
                        <td>{translation.property}</td>
                        <td>{translation.value}</td>
                        <td className="translation-list__table__button">
                          <Link
                            href={`admin/translation/${encodeURIComponent(
                              translation.language +
                                '$' +
                                translation.className +
                                '$' +
                                translation.property +
                                '$' +
                                translation.key,
                            )}`}
                            legacyBehavior
                          >
                            <button
                              type="button"
                              className={`translation-list__button__edit`}
                              title={localization.buttons['edit'].helpText}
                            >
                              <i className="icon__edit"></i>
                              <span>{localization.buttons['edit'].text}</span>
                            </button>
                          </Link>
                        </td>
                        <td className="translation-list__table__button">
                          <button
                            type="button"
                            className={`translation-list__button__delete`}
                            title={localization.buttons['remove'].helpText}
                            onClick={() => confirmDelete(translation)}
                          >
                            <i className="icon__delete"></i>
                            <span>{localization.buttons['remove'].text}</span>
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <Paginator
              lastPage={lastPage}
              handlePageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
      <ConfirmModal
        modalIsOpen={modalIsOpen}
        headerElement={setHeaderElement()}
        closeModal={closeModal}
        confirmation={deleteTranslation}
        confirmationText={localization.buttons['remove'].text}
      ></ConfirmModal>
    </div>
  )
}

export default TranslationList
