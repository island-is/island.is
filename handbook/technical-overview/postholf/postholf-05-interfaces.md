# Interfaces

## Skjalatilkynning OpenApi

Test http://test-skjalatilkynning-island-is.azurewebsites.net/swagger/ui/index 

Production: https://skjalatilkynning-island-is.azurewebsites.net/swagger/ui/index 

##	Skjalaveita OpenApi

```json
{
  "openapi": "3.0.1",
  "info": {
    "title": "Skjalaveita API",
    "version": "v1"
  },
  "paths": {
    "/api/v1/customer/{kennitala}/documents/{documentId}": {
      "get": {
        "tags": [
          "Documents"
        ],
        "parameters": [
          {
            "name": "kennitala",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "documentId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "authenticationType",
            "in": "query",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "text/plain": {
                "schema": {
                  "$ref": "#/components/schemas/Document"
                }
              },
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Document"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/Document"
                }
              }
            }
          },
          "400": {
            "description": "Bad Request",
            "content": {
              "text/plain": {
                "schema": {
                  "$ref": "#/components/schemas/Error"
                }
              },
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Error"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/Error"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized"
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "Document": {
        "type": "object",
        "properties": {
          "type": {
            "type": "string",
            "nullable": true
          },
          "content": {
            "type": "string",
            "nullable": true
          }
        },
        "additionalProperties": false
      },
      "Error": {
        "type": "object",
        "properties": {
          "errorMessage": {
            "type": "string",
            "nullable": true
          }
        },
        "additionalProperties": false
      }
    }
  }
}

```

Also available here:

https://test-skjalaveita-island-is.azurewebsites.net/swagger/v1/swagger.json
