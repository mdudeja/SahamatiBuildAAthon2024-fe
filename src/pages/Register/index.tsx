import { useEffect, useReducer } from "preact/hooks"
import "./style.css"
import { useUserContext } from "../../lib/hooks/useUserContext"
import { useLocation } from "preact-iso"

type formState = {
  username: string
  password: string
  confirmPassword: string
}

const reducer = (state: formState, action: any) => {
  switch (action.type) {
    case "username":
      return { ...state, username: action.value }
    case "password":
      return { ...state, password: action.value }
    case "confirmPassword":
      return { ...state, confirmPassword: action.value }
    default:
      return state
  }
}

export function Register() {
  const [formState, dispatch] = useReducer(reducer, {
    username: "",
    password: "",
    confirmPassword: "",
  })
  const { user, registerUser } = useUserContext()
  const { route } = useLocation()

  const handleSubmit = (e: any) => {
    if (formState.password !== formState.confirmPassword) {
      alert("Passwords do not match")
      return
    }

    registerUser(formState.username, formState.password)
  }

  useEffect(() => {
    if (user.value && user.value.username) {
      route("/login")
    }
  }, [user.value])

  return (
    <div class="form-container">
      <form>
        <input
          type="text"
          placeholder="Username"
          onChange={(e) => {
            dispatch({ type: "username", value: e.currentTarget.value })
          }}
          value={formState.username}
          autoComplete="username"
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => {
            dispatch({ type: "password", value: e.currentTarget.value })
          }}
          value={formState.password}
          autoComplete="new-password"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          onChange={(e) => {
            dispatch({ type: "confirmPassword", value: e.currentTarget.value })
          }}
          value={formState.confirmPassword}
          autoComplete="new-password"
        />
      </form>
      <div class="button-container">
        <button class="login-button">
          <a href="/login">Login</a>
        </button>
        <button onClick={handleSubmit}>Register</button>
      </div>
    </div>
  )
}
