import { constants } from "./constants"

export function makeRequest(url: string, method: string, body?: any) {
  const baseUrl = constants.backendUrl
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  } as unknown as RequestInit

  if (body) {
    options.body = JSON.stringify(body)
  }

  return fetch(`${baseUrl}${url}`, options)
}
