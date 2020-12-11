import axios from 'axios';
import APIResponse from '../models/utils/APIResponse';
import { ClientRedirectUriDTO } from '../models/dtos/client-redirect-uri.dto';

export const AddRedirectUri = async (clientRedirect: ClientRedirectUriDTO) => {
  await axios
    .post(`/api/redirect-uri`, clientRedirect)
    .then((response) => {
      const res = new APIResponse();
      res.statusCode = response.request.status;
      res.message = response.request.statusText;
      return res;
    })
    .catch(function (error) {
      if (error.response) {
        return error.response.data;
      } else {
        // TODO: Handle and show error
      }
    });
};

export const RemoveRedirectUri = async (
  clientRedirect: ClientRedirectUriDTO
) => {
  await axios
    .delete(
      `/api/redirect-uri/${clientRedirect.clientId}/${clientRedirect.redirectUri}`
    )
    .then((response) => {
      const res = new APIResponse();
      res.statusCode = response.request.status;
      res.message = response.request.statusText;
      return res;
    })
    .catch(function (error) {
      if (error.response) {
        return error.response.data;
      } else {
        // TODO: Handle and show error
      }
    });
};
