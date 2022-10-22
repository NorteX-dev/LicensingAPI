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

  | Method | Route                        | Description                                            | Query Parameters                                   | Body                                 | Requires Authentication (refer to [Authentication](#authentication))|
    |------------------------------|--------------------------------------------------------|----------------------------------------------------|--------------------------------------|------|-----|
  | GET    | /                            | index route, displays version                          | none                                               | n/a                                  |     |
  | GET    | /licenses/validate/:key      | validate a license key                                 | key: string | n/a                                  |     |
  | GET    | /licenses/validate/:key/info | validate a license key and return extended information | key: string | n/a                                  |     |
  | GET    | /licenses                    | get all licenses                                       | none                                               | n/a                                  | ✅|
  | GET    | /licenses                    | get all licenses                                       | none                                               | n/a                                  | ✅|
  | GET    | /licenses/:id                | get license by id                                      | id: string                                         | n/a                                  | ✅|
  | POST   | /licenses                    | create new license                                     | none                                               | `{ label: string, exp?: timestamp }` | ✅|

## Authentication
<a id="authentication"></a>
To authenticate, you need to send a header with the key `X-API-KEY` and the value of your API key.

You can configure mutliple api keys in the `config.ts` file (`src/util/config.ts`).
