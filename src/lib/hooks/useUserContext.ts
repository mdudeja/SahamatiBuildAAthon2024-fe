import { type User } from "../types/User.type"
import { signal, effect } from "@preact/signals"
import { makeRequest } from "../utils"
import { useEffect } from "preact/hooks"
import { constants } from "../constants"

export function useUserContext() {
  const storedUser = localStorage.getItem(constants.userKey)
  const user = signal<User | null>(storedUser ? JSON.parse(storedUser) : null)

  effect(() => {
    localStorage.setItem(constants.userKey, JSON.stringify(user.value))
  })

  const registerUser = async (username: string, password: string) => {
    const response = await makeRequest("/auth/register", "POST", {
      username,
      password,
      userType: "fiu",
    })

    try {
      const newUser = await response.json()
      user.value = newUser
    } catch (error) {
      console.log({ error })
      logoutUser()
    }
  }

  const loginUser = async (username: string, password: string) => {
    const response = await makeRequest("/auth/login", "POST", {
      username,
      password,
      userType: "fiu",
    })

    try {
      const loginResponse = await response.json()
      console.log({ loginResponse })

      if (!loginResponse || !loginResponse.success) {
        logoutUser()
        return
      }

      user.value = loginResponse.user
    } catch (error) {
      console.log({ error })
      logoutUser()
    }
  }

  const logoutUser = async () => {
    user.value = null
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
  }

  return { user, registerUser, loginUser, logoutUser }
}
