import APIResponse from '../entities/common/APIResponse';
import api from './api';

export class BaseService {
  protected static async GET(path: string) {
    try {
      const response = await api.get(path);
      return BaseService.handleResponse(response);
    } catch (error) {
      return BaseService.handleError(error);
    }
  }

  protected static async DELETE(path: string, body: any = null) {
    if (!body) {
      try {
        const response = await api.delete(path);
        return BaseService.handleResponse(response);
      } catch (error) {
        return BaseService.handleError(error);
      }
    } else {
      try {
        const response = await api.delete(path, { data: body });
        return BaseService.handleResponse(response);
      } catch (error) {
        return BaseService.handleError(error);
      }
    }
  }

  protected static async POST(path: string, body: any) {
    try {
      const response = await api.post(path, body);
      return BaseService.handleResponse(response);
    } catch (error) {
      return BaseService.handleError(error);
    }
  }

  protected static async PUT(path: string, body: any) {
    try {
      const response = await api.put(path, body);
      return BaseService.handleResponse(response);
    } catch (error) {
      return BaseService.handleError(error);
    }
  }

  protected static async PATCH(path: string, body: any) {
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
    // TODO: Set Response ( RxJs)
    // setResponse(res);
    // TODO: Set status to store
    console.log(response.data);
    return response.data;
  }

  protected static handleError(error: any) {
    console.log('handle error');
    console.log(error);

    if (error?.response) {
      const res = new APIResponse();
      res.statusCode = error.request.status;
      res.message = error.request.statusText;
      // TODO: Set Error in ( RxJs )
      console.log(res);
      console.log(error);
      // setResponse(error.response.data);
    } else {
      console.log(error);
      // TODO: Handle error object and set in RxJs
    }
    return null;
  }
}
