# Licensing API
### Version 1.0

----
## Main features:

- generate unique license keys
- intuative REST API to create, edit, delete and validate licenses
- define own API keys that allow admin control over the application
- easily validate existing keys
- set expiration times on licenses
- add labels on licenses for easy identification
- soon: graphical user interface to manage licenses

This API was made with the intention to use in 3rd party applications, like desktop software or websites.

## Routes documentation:
| Method | Route                        | Description                                            | Query Parameters | Body                                  | Requires Authentication? (refer to [Authentication](#authentication)) |
|--------|------------------------------|--------------------------------------------------------|------------------|---------------------------------------|-----------------------------------------------------------------------|
| GET    | /                            | Index route, displays version                          | none             |                                       |                                                                       |
| GET    | /licenses/validate/:key      | Validate a license key                                 | key: string      |                                       |                                                                       |
| GET    | /licenses/validate/:key/info | Validate a license key and return extended information | key: string      |                                       | ✅                                                                     |
| GET    | /licenses                    | Get all licenses                                       | none             |                                       | ✅                                                                     |
| GET    | /licenses/:id                | Get license by id                                      | id: string       |                                       | ✅                                                                     |
| POST   | /licenses                    | Create new license                                     | none             | `{ label: string, exp?: timestamp }`  | ✅                                                                     |
| PATCH  | /licenses/:id                | Fully edit by id                                       | id: string       | `{ label: string, exp: timestamp }`   | ✅                                                                     |
| PUT    | /licenses/:id                | Partially edit by id                                   | id: string       | `{ label?: string, exp?: timestamp }` | ✅                                                                     |

## Authentication
<a id="authentication"></a>
To authenticate, you need to send a header with the key `X-API-KEY` and the value of your API key.

You can configure mutliple api keys in the `config.ts` file (`src/util/config.ts`).
