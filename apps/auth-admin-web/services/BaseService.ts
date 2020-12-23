import APIResponse from '../entities/common/APIResponse';
import api from './api';
import { ApiStatusStore } from '../store/ApiStatusStore';

export class BaseService {
  protected static async GET(path: string) {
    ApiStatusStore.getInstance().clearStatus();
    try {
      const response = await api.get(path);
      return BaseService.handleResponse(response);
    } catch (error) {
      return BaseService.handleError(error);
    }
  }

  protected static async DELETE(path: string, body: any = null) {
    if (!body) {
      ApiStatusStore.getInstance().clearStatus();
      try {
        const response = await api.delete(path);
        return BaseService.handleResponse(response);
      } catch (error) {
        return BaseService.handleError(error);
      }
    }

    try {
      const response = await api.delete(path, { data: body });
      return BaseService.handleResponse(response);
    } catch (error) {
      return BaseService.handleError(error);
    }
  }

  protected static async POST(path: string, body: any = null) {
    ApiStatusStore.getInstance().clearStatus();
    if (!body) {
      try {
        const response = await api.post(path);
        return BaseService.handleResponse(response);
      } catch (error) {
        return BaseService.handleError(error);
      }
    }

    try {
      const response = await api.post(path, body);
      return BaseService.handleResponse(response);
    } catch (error) {
      return BaseService.handleError(error);
    }
  }

  protected static async PUT(path: string, body: any) {
    ApiStatusStore.getInstance().clearStatus();
    try {
      const response = await api.put(path, body);
      return BaseService.handleResponse(response);
    } catch (error) {
      return BaseService.handleError(error);
    }
  }

  protected static async PATCH(path: string, body: any) {
    ApiStatusStore.getInstance().clearStatus();
    try {
      const response = await api.patch(path, body);
      return BaseService.handleResponse(response);
    } catch (error) {
      return BaseService.handleError(error);
    }
  }

  protected static handleResponse(response: any) {
    const res = new APIResponse();
    res.statusCode = response.request.status;
    res.message = response.request.statusText;
    ApiStatusStore.getInstance().setStatus(res);
    return response.data;
  }

  protected static handleError(error: any) {
    if (error?.response) {
      const res = new APIResponse();
      res.statusCode = error.request.status;
      res.message = error.request.statusText;
      ApiStatusStore.getInstance().setStatus(res);
    } else {
      ApiStatusStore.getInstance().setStatus({
        error: 'Custom',
        message: ['Could not connect to API'],
        statusCode: 525,
      });
    }
    return null;
  }
}
