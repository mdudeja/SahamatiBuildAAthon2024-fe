import { useLocation } from "preact-iso"
import { routes } from "../lib/routes"
import { useContext, useEffect, useState } from "preact/hooks"
import { useUserContext } from "../lib/hooks/useUserContext"

export function Header() {
  const { url, route } = useLocation()
  const { user, logoutUser } = useUserContext()

  useEffect(() => {
    if (!user.value && routes[url].protected) {
      route("/login", true)
    }
  }, [user.value, url])

  return (
    <header>
      <a href="/">AQM FIU</a>
      <nav>
        {Object.keys(routes)
          .filter((route) => routes[route].showInNav)
          .map((route) => {
            if (route === "/login" && user.value && user.value.username) {
              return (
                <a
                  href="/"
                  onClick={(e) => {
                    e.preventDefault()
                    logoutUser()
                  }}
                >
                  logout
                </a>
              )
            }
            return (
              <a
                href={routes[route].path}
                class={url === routes[route].path ? "active" : ""}
              >
                {route.replace("/", "")}
              </a>
            )
          })}
      </nav>
    </header>
  )
}
