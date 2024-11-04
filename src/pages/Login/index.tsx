import { useEffect, useReducer } from "preact/hooks"
import "./style.css"
import { useUserContext } from "../../lib/hooks/useUserContext"
import { useLocation } from "preact-iso"

type formState = {
  username: string
  password: string
}

const reducer = (state: formState, action: any) => {
  switch (action.type) {
    case "username":
      return { ...state, username: action.value }
    case "password":
      return { ...state, password: action.value }
    default:
      return state
  }
}

export function Login() {
  const [formState, dispatch] = useReducer(reducer, {
    username: "",
    password: "",
  })
  const { user, loginUser } = useUserContext()
  const { route } = useLocation()

  const handleSubmit = (e: any) => {
    if (!formState.username || !formState.password) {
      alert("Please enter a username and password")
      return
    }

    loginUser(formState.username, formState.password)
  }

  useEffect(() => {
    if (user.value && user.value.username) {
      route("/")
    }
  }, [user.value])

  return (
    <div class="form-container">
      <form>
        <input
          autoComplete="username"
          type="text"
          placeholder="Username"
          onChange={(e) => {
            dispatch({ type: "username", value: e.currentTarget.value })
          }}
          value={formState.username}
        />
        <input
          autoComplete="current-password"
          type="password"
          placeholder="Password"
          onChange={(e) => {
            dispatch({ type: "password", value: e.currentTarget.value })
          }}
          value={formState.password}
        />
      </form>
      <div class="button-container">
        <button class="register-button">
          <a href="/register">Register</a>
        </button>
        <button onClick={handleSubmit}>Login</button>
      </div>
    </div>
  )
}
