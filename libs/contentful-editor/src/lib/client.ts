import axios, { AxiosInstance } from 'axios'
import cloneDeep from 'lodash/cloneDeep'

import { extractLocale, injectLocale } from './locale'
import { ContentfulEditModel, ContentfulAdminModel } from './types'

class ManagementApi {
  private client: AxiosInstance
  private space: string
  private currentLocale: string

  deliveryApi: any

  constructor(space: string, accessToken: string) {
    this.space = space
    this.deliveryApi = null
    this.currentLocale = ''
    this.client = axios.create({
      baseURL: `https://api.contentful.com`,
      headers: {
        'Content-Type': 'application/vnd.contentful.management.v1+json',
        Authorization: `Bearer ${accessToken}`,
      },
    })
  }

  get(url: string, params?: object): Promise<any> {
    return this.client
      .get(url, { params })
      .then((result: { data: any }) => result.data) as Promise<any>
  }

  put(url: string, body: any, version: string): Promise<any> {
    return this.client
      .put(url, body, {
        headers: {
          'X-Contentful-Version': version,
        },
      })
      .then((result: { data: any }) => result.data) as Promise<any>
  }

  post(
    url: string,
    body: any,
    contentType: string,
    contentfulContentType?: string
  ) {
    const headers: { [header: string]: string } = {
      'Content-Type': contentType,
    }
    if (contentfulContentType) {
      headers['X-Contentful-Content-Type'] = contentfulContentType
    }
    return this.client
      .post(url, body, {
        headers,
      })
      .then((result: { data: any }) => result.data) as Promise<any>
  }

  getEntry(id: string): Promise<ContentfulEditModel> {
    return this._getEntity(id, 'entries')
  }

  getAsset(id: string) {
    return this._getEntity(id, 'assets')
  }

  async _getEntity(id: string, entityPath: string) {
    const entity = await this.get(`/spaces/${this.space}/${entityPath}/${id}`)
    return this._formatForTux(entity)
  }

  async createModel(model: any) {
    const type = model.sys.contentType.sys.id
    const url = `/spaces/${this.space}/entries/`
    const modelWithLocale = await this._formatForApi(model)
    const contentType = 'application/vnd.contentful.management.v1+json'
    const newModel = await this.post(
      url,
      { fields: modelWithLocale.fields },
      contentType,
      type
    )
    await this._publish(newModel, 'entries')
    return newModel
  }

  saveEntry(entry: any) {
    return this._save(entry, 'entries')
  }

  saveAsset(asset: any) {
    return this._save(asset, 'assets')
  }

  processAsset(id: string, version: any) {
    const url = `/spaces/${this.space}/assets/${id}/files/${this.currentLocale
      }/process`
    return this.put(url, null, version)
  }

  async _save(entity: any, entityPath: string) {
    const entityWithLocale = await this._formatForApi(entity)
    const { fields, sys: { id, version } } = entityWithLocale
    const url = `/spaces/${this.space}/${entityPath}/${id}`
    const newEntity = await this.put(url, { fields }, version)

    await this._publish(newEntity, entityPath)
    return newEntity
  }

  async _publish(entity: any, entityPath: string) {
    const { id, version } = entity.sys
    const url = `/spaces/${this.space}/${entityPath}/${id}/published`
    const savedEntity = await this.put(url, null, version)

    if (this.deliveryApi) {
      this.deliveryApi.override(this.formatForDelivery(savedEntity))
    }
    return savedEntity
  }

  createUpload(file: File): Promise<any> {
    const url = `https://upload.contentful.com/spaces/${this.space}/uploads`

    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest()
      request.open('POST', url, true)
      request.setRequestHeader('Content-Type', 'application/octet-stream')
      request.setRequestHeader(
        'Authorization',
        this.client.defaults.headers.Authorization
      )
      request.onload = () => {
        const data = JSON.parse(request.response)
        resolve(data)
      }

      request.onerror = () => {
        reject('Could not create upload')
      }

      request.send(file)
    })
  }

  async createAsset(body: any) {
    const url = `/spaces/${this.space}/assets`
    const bodyWithLocale = await this._formatForApi(body)
    const asset = await this.post(url, bodyWithLocale, 'application/json')
    await this.processAsset(asset.sys.id, asset.sys.version)
    asset.sys.version += 1
    await this._publish(asset, 'assets')
    return asset
  }

  async getTypeMeta(type: string) {
    const [contentType, editorInterface] = await Promise.all([
      this.get(`/spaces/${this.space}/content_types/${type}`),
      this.get(`/spaces/${this.space}/content_types/${type}/editor_interface`),
    ])

    contentType.fields.forEach((field: any) => {
      field.control = editorInterface.controls.find(
        (editor: any) => editor.fieldId === field.id
      )
    })
    return contentType
  }

  getUser() {
    return this.get('/users/me')
  }

  getSpace() {
    return this.get(`/spaces/${this.space}`)
  }

  getLocalesForSpace(spaceId: string) {
    return this.get(`/spaces/${this.space}/locales`)
  }

  async getDefaultLocaleForSpace(spaceId: string) {
    if (this.currentLocale) {
      return this.currentLocale
    }

    const locales = await this.getLocalesForSpace(spaceId)
    for (const locale of locales.items) {
      if (locale.default) {
        this.currentLocale = locale.internal_code
        return this.currentLocale
      }
    }
    return null
  }

  formatForDelivery(entry: any) {
    Object.keys(entry.fields).forEach(name => {
      const value = entry.fields[name]
      entry.fields[name] = value && value[this.currentLocale]
    })
    return entry
  }

  async _formatForTux(entity: any) {
    if (!this.currentLocale) {
      await this.getDefaultLocaleForSpace(this.space)
    }
    const clone = cloneDeep(entity)
    const withoutLocale = extractLocale(clone, this.currentLocale)
    return withoutLocale
  }

  async _formatForApi(entity: any) {
    if (!this.currentLocale) {
      await this.getDefaultLocaleForSpace(this.space)
    }
    const clone = cloneDeep(entity)
    const withFormattedAssets = this._formatAssetsIfFound(clone)
    const withFormattedAssetsAndLocale = injectLocale(clone, this.currentLocale)
    return withFormattedAssetsAndLocale
  }

  private _formatAssetsIfFound(model: any) {
    for (const fieldName of Object.keys(model.fields)) {
      const field = model.fields[fieldName]
      if (field.sys) {
        model.fields[fieldName] = this._formatAssetForLinking(field)
      }
    }
    return model
  }

  private _formatAssetForLinking(asset: any) {
    return {
      sys: {
        id: asset.sys.id,
        linkType: 'Asset',
        type: 'Link',
      },
    }
  }
}

export default ManagementApi
