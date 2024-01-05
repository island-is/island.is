/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'
import Paginator from '../../common/Paginator'
import Link from 'next/link'
import ConfirmModal from '../../common/ConfirmModal'
import { Language } from './../../../entities/models/language.model'
import { TranslationService } from './../../../services/TranslationService'
import LocalizationUtils from '../../../utils/localization.utils'
import { ListControl } from '../../../entities/common/Localization'

const LanguageList: React.FC<React.PropsWithChildren<unknown>> = () => {
  const [languages, setLanguages] = useState<Language[]>([])
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [languageToRemove, setLanguageToRemove] = useState('')
  const [count, setCount] = useState(0)
  const [modalIsOpen, setIsOpen] = React.useState(false)
  const [searchString, setSearchString] = useState<string>('')
  const [localization] = useState<ListControl>(
    LocalizationUtils.getListControl('LanguageList'),
  )

  const getLanguages = async (page: number, count: number): Promise<void> => {
    const response = await TranslationService.findAndCountAllLanguages(
      page,
      count,
    )

    if (response) {
      setLanguages(response.rows)
      setLastPage(Math.ceil(response.count / count))
    }
  }

  const handlePageChange = async (
    page: number,
    count: number,
  ): Promise<void> => {
    getLanguages(page, count)
    setPage(page)
    setCount(count)
  }

  const deleteLanguage = async (): Promise<void> => {
    const response = await TranslationService.deleteLanguage(languageToRemove)
    if (response) {
      getLanguages(page, count)
    }

    closeModal()
  }

  const confirmDelete = async (name: string): Promise<void> => {
    setLanguageToRemove(name)
    setIsOpen(true)
  }

  const closeModal = (): void => {
    setIsOpen(false)
  }

  const setHeaderElement = (): JSX.Element => {
    return (
      <p>
        {localization.removeConfirmation}
        <span>{languageToRemove}</span>
      </p>
    )
  }

  return (
    <div>
      <div className="language-list">
        <div className="language-list__wrapper">
          <div className="language-list__container">
            <h1>{localization.title}</h1>
            <div className="language-list__container__options">
              <div className="language-list__container__options__button">
                <Link
                  href={'/admin/language'}
                  className="language-list__button__new"
                  title={localization.buttons['new'].helpText}
                >
                  <i className="icon__new"></i>
                  {localization.buttons['new'].text}
                </Link>
              </div>
            </div>
            <div className="language-list__container__table">
              <table className="language-list__table">
                <thead>
                  <tr>
                    <th>{localization.columns['isoKey'].headerText}</th>
                    <th>{localization.columns['description'].headerText}</th>
                    <th>
                      {localization.columns['englishDescription'].headerText}
                    </th>
                    <th colSpan={2}></th>
                  </tr>
                </thead>
                <tbody>
                  {languages.map((language: Language) => {
                    return (
                      <tr key={language.isoKey}>
                        <td>{language.isoKey}</td>
                        <td>{language.description}</td>
                        <td>{language.englishDescription}</td>
                        <td className="language-list__table__button">
                          <Link
                            href={`admin/language/${encodeURIComponent(
                              language.isoKey,
                            )}`}
                            legacyBehavior
                          >
                            <button
                              type="button"
                              className={`language-list__button__edit`}
                              title={localization.buttons['edit'].helpText}
                            >
                              <i className="icon__edit"></i>
                              <span>{localization.buttons['edit'].text}</span>
                            </button>
                          </Link>
                        </td>
                        <td className="language-list__table__button">
                          <button
                            type="button"
                            className={`language-list__button__delete`}
                            title={localization.buttons['remove'].helpText}
                            onClick={() => confirmDelete(language.isoKey)}
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
        confirmation={deleteLanguage}
        confirmationText={localization.buttons['remove'].text}
      ></ConfirmModal>
    </div>
  )
}

export default LanguageList
