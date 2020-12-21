import APIResponse from '../entities/common/APIResponse';

export class BaseService {
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

    if (error?.response) {
      const res = new APIResponse();
      res.statusCode = error.request.status;
      res.message = error.request.statusText;
      // TODO: Set Error in ( RxJs )
      console.log(res);
      // setResponse(error.response.data);
    } else {
      console.log(error);
      // TODO: Handle error object and set in RxJs
    }
  }
}
