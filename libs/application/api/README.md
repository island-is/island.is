```python
# API Module

import requests

def fetch_data(endpoint, params=None):
    """
    Retrieve data from a given API endpoint with optional parameters.

    Parameters:
        endpoint (str): The API endpoint from which data is to be fetched.
        params (dict, optional): A dictionary of query string parameters to include in the request.

    Returns:
        dict: Parsed JSON response from the API.
    
    Raises:
        ValueError: If the response is not successful (Status code is not 2xx).
        ConnectionError: If there's an issue connecting to the endpoint.
    """
    try:
        response = requests.get(endpoint, params=params)
        response.raise_for_status()
    except requests.exceptions.HTTPError as http_err:
        raise ValueError(f"HTTP error occurred: {http_err}") from http_err
    except requests.exceptions.RequestException as err:
        raise ConnectionError(f"Error connecting to API: {err}") from err

    return response.json()

def post_data(endpoint, data, headers=None):
    """
    Send data to a specified API endpoint.

    Parameters:
        endpoint (str): The API endpoint to which data is to be posted.
        data (dict): The data to post to the API, in JSON format.
        headers (dict, optional): Additional headers to include in the request. Defaults to {'Content-Type': 'application/json'}.

    Returns:
        dict: Parsed JSON response from the API.

    Raises:
        ValueError: If the response is not successful (Status code is not 2xx).
        ConnectionError: If there's an issue connecting to the endpoint.
    """
    if headers is None:
        headers = {'Content-Type': 'application/json'}
    
    try:
        response = requests.post(endpoint, json=data, headers=headers)
        response.raise_for_status()
    except requests.exceptions.HTTPError as http_err:
        raise ValueError(f"HTTP error occurred: {http_err}") from http_err
    except requests.exceptions.RequestException as err:
        raise ConnectionError(f"Error connecting to API: {err}") from err

    return response.json()

def process_response(data, key):
    """
    Process the response data to extract a specific value using a given key.

    Parameters:
        data (dict): The response data from the API.
        key (str): The key whose associated value is to be extracted.

    Returns:
        any: The extracted value associated with the given key.

    Raises:
        KeyError: If the key is not present in the data.
    """
    try:
        return data[key]
    except KeyError as e:
        raise KeyError(f"Key '{key}' not found in the data.") from e
```