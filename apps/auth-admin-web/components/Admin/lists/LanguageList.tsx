/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react'
import Paginator from '../../common/Paginator'
import Link from 'next/link'
import ConfirmModal from '../../common/ConfirmModal'
import { Language } from './../../../entities/models/language.model'
import { TranslationService } from './../../../services/TranslationService'

class LanguageList extends Component {
  state = {
    languages: [],
    rowCount: 0,
    count: 1,
    page: 1,
    modalIsOpen: false,
    languageToRemove: '',
    searchString: '',
  }

  getLanguages = async (page: number, count: number): Promise<void> => {
    const response = await TranslationService.findAndCountAllLanguages(
      page,
      count,
    )

    if (response) {
      this.setState({
        languages: response.rows,
        rowCount: response.count,
      })
    }
  }

  handlePageChange = async (page: number, count: number): Promise<void> => {
    this.getLanguages(page, count)
    this.setState({ page: page, count: count })
  }

  deleteLanguage = async (): Promise<void> => {
    await TranslationService.deleteLanguage(this.state.languageToRemove)
    this.getLanguages(this.state.page, this.state.count)
    this.closeModal()
  }

  confirmDelete = async (name: string): Promise<void> => {
    this.setState({ languageToRemove: name })
    this.setState({ modalIsOpen: true })
  }

  closeModal = (): void => {
    this.setState({ modalIsOpen: false })
  }

  setHeaderElement = (): JSX.Element => {
    return (
      <p>
        Are you sure want to delete this Language:{' '}
        <span>{this.state.languageToRemove}</span>
      </p>
    )
  }

  render(): JSX.Element {
    return (
      <div>
        <div className="language-list">
          <div className="language-list__wrapper">
            <div className="language-list__container">
              <h1>Languages</h1>
              <div className="language-list__container__options">
                <div className="language-list__container__options__button">
                  <Link href={'/admin/language'}>
                    <a className="language-list__button__new">
                      <i className="icon__new"></i>Create a new language
                    </a>
                  </Link>
                </div>
              </div>
              <div className="language-list__container__table">
                <table className="language-list__table">
                  <thead>
                    <tr>
                      <th>Iso Key</th>
                      <th>Description</th>
                      <th>English Description</th>
                      <th colSpan={2}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.languages.map((language: Language) => {
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
                            >
                              <button
                                type="button"
                                className={`language-list__button__edit`}
                                title="Edit"
                              >
                                <i className="icon__edit"></i>
                                <span>Edit</span>
                              </button>
                            </Link>
                          </td>
                          <td className="language-list__table__button">
                            <button
                              type="button"
                              className={`language-list__button__delete`}
                              title="Delete"
                              onClick={() =>
                                this.confirmDelete(language.isoKey)
                              }
                            >
                              <i className="icon__delete"></i>
                              <span>Delete</span>
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <Paginator
                lastPage={Math.ceil(this.state.rowCount / this.state.count)}
                handlePageChange={this.handlePageChange}
              />
            </div>
          </div>
        </div>
        <ConfirmModal
          modalIsOpen={this.state.modalIsOpen}
          headerElement={this.setHeaderElement()}
          closeModal={this.closeModal}
          confirmation={this.deleteLanguage}
          confirmationText="Delete"
        ></ConfirmModal>
      </div>
    )
  }
}

export default LanguageList
