```markdown
# API Catalogue

This document provides an overview and description of available APIs, including their endpoints, methods, parameters, and expected responses. Each API entry is organized in a standardized format for clarity and ease of use.

## Table of Contents

1. [General Guidelines](#general-guidelines)
2. [API Endpoints](#api-endpoints)
   - [GET /items](#get-items)
   - [POST /items](#post-items)

---

## General Guidelines

This section outlines the general guidelines for using the APIs listed in this catalogue:

- **Base URL**: All endpoints are relative to the base URL `https://api.example.com/v1`.
- **Authentication**: APIs use token-based authentication. Include the token in the header as `Authorization: Bearer <token>`.
- **Request Headers**: All requests must include the `Content-Type: application/json` header.
- **Responses**: Responses are provided in JSON format.

Endpoints and their details are listed below. Each API is described with its method, endpoint URL, required parameters, and a sample response.

---

## API Endpoints

### GET /items

Retrieves a list of items.

- **Method**: GET
- **Endpoint**: `/items`
- **Description**: Fetches a list of all available items.
- **Query Parameters**: 
  - `page` (integer, optional): The page number for pagination.
  - `size` (integer, optional): Number of items per page.
- **Sample Request**:
  ```http
  GET /items?page=1&size=10 HTTP/1.1
  Host: api.example.com
  Authorization: Bearer <token>
  Content-Type: application/json
  ```
- **Sample Response**:
  ```json
  {
    "status": "success",
    "data": [
      {
        "id": 1,
        "name": "Item 1",
        "description": "Description of item 1"
      }
      ...
    ],
    "totalItems": 100,
    "totalPages": 10
  }
  ```

### POST /items

Creates a new item.

- **Method**: POST
- **Endpoint**: `/items`
- **Description**: Adds a new item to the database.
- **Request Body**:
  ```json
  {
    "name": "New Item",
    "description": "Description of the new item"
  }
  ```
- **Sample Request**:
  ```http
  POST /items HTTP/1.1
  Host: api.example.com
  Authorization: Bearer <token>
  Content-Type: application/json

  {
    "name": "New Item",
    "description": "Description of the new item"
  }
  ```
- **Sample Response**:
  ```json
  {
    "status": "success",
    "message": "Item created successfully",
    "data": {
      "id": 101,
      "name": "New Item",
      "description": "Description of the new item"
    }
  }
  ```

---

End of the API Catalogue.
```