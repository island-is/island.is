/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react'
import Paginator from '../../common/Paginator'
import Link from 'next/link'
import ConfirmModal from '../../common/ConfirmModal'
import { TranslationService } from './../../../services/TranslationService'
import { IdpProvider } from './../../../entities/models/IdpProvider.model'
import { TranslationDTO } from './../../../entities/dtos/translation.dto'
import { Translation } from 'apps/auth-admin-web/entities/models/translation.model'

class TranslationList extends Component {
  state = {
    translations: [],
    rowCount: 0,
    count: 1,
    page: 1,
    modalIsOpen: false,
    translationToRemove: new TranslationDTO(),
    searchString: '',
  }

  getTranslations = async (
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
      this.setState({
        translations: response.rows,
        rowCount: response.count,
      })
    }
  }

  handlePageChange = async (page: number, count: number): Promise<void> => {
    this.getTranslations(this.state.searchString, page, count)
    this.setState({ page: page, count: count })
  }

  deleteTranslation = async (): Promise<void> => {
    await TranslationService.deleteTranslation(this.state.translationToRemove)
    this.getTranslations(
      this.state.searchString,
      this.state.page,
      this.state.count,
    )
    this.closeModal()
  }

  confirmDelete = async (translation: TranslationDTO): Promise<void> => {
    this.setState({ translationToRemove: translation })
    this.setState({ modalIsOpen: true })
  }

  closeModal = (): void => {
    this.setState({ modalIsOpen: false })
  }

  setHeaderElement = (): JSX.Element => {
    return (
      <p>
        Are you sure want to delete this Translation:{' '}
        <span>{this.state.translationToRemove.language} </span>
      </p>
    )
  }

  search = (event) => {
    this.getTranslations(
      this.state.searchString,
      this.state.page,
      this.state.count,
    )
    event.preventDefault()
  }

  handleSearchChange = (event) => {
    this.setState({ searchString: event.target.value })
  }

  render(): JSX.Element {
    return (
      <div>
        <div className="translation-list">
          <div className="translation-list__wrapper">
            <div className="translation-list__container">
              <h1>Translations</h1>
              <div className="translation-list__container__options">
                <div className="translation-list__container__options__button">
                  <Link href={'/admin/translation'}>
                    <a className="translation-list__button__new">
                      <i className="icon__new"></i>Create new Translation
                    </a>
                  </Link>
                </div>
                <form onSubmit={this.search}>
                  <div className="translation-list__container__options__search">
                    <label htmlFor="search" className="translation-list__label">
                      Text value
                    </label>
                    <input
                      id="search"
                      className="translation-list__input__search"
                      value={this.state.searchString}
                      onChange={this.handleSearchChange}
                    ></input>
                    <button
                      type="submit"
                      className="translation-list__button__search"
                    >
                      Search
                    </button>
                  </div>
                </form>
              </div>
              <div className="translation-list__container__table">
                <table className="translation-list__table">
                  <thead>
                    <tr>
                      <th>Language</th>
                      <th>Key</th>
                      <th>Class Name</th>
                      <th>Property</th>
                      <th>Value</th>
                      <th colSpan={2}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.translations.map((translation: Translation) => {
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
                            >
                              <button
                                type="button"
                                className={`translation-list__button__edit`}
                                title="Edit"
                              >
                                <i className="icon__edit"></i>
                                <span>Edit</span>
                              </button>
                            </Link>
                          </td>
                          <td className="translation-list__table__button">
                            <button
                              type="button"
                              className={`translation-list__button__delete`}
                              title="Delete"
                              onClick={() => this.confirmDelete(translation)}
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
          confirmation={this.deleteTranslation}
          confirmationText="Delete"
        ></ConfirmModal>
      </div>
    )
  }
}

export default TranslationList
