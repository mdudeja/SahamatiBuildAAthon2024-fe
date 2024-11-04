import { useReducer } from "preact/hooks"
import { OfferingFormField } from "../lib/OfferingFormFields"
import "./appform.style.css"
import { useLocation } from "preact-iso"
import { makeRequest } from "../lib/utils"
import { useUserContext } from "../lib/hooks/useUserContext"

const reducer = (
  state: Record<string, any>,
  action: { type: "update"; payload: { id: string; value: any } }
) => {
  const newState = { ...state, [action.payload.id]: action.payload.value }
  return newState
}

export function AppForm({
  fields,
  title,
}: {
  fields: OfferingFormField[]
  title: string
}) {
  const { route } = useLocation()
  const [formData, dispatch] = useReducer(reducer, {})
  const { logoutUser } = useUserContext()

  const handleSubmit = async (e: Event) => {
    e.preventDefault()

    const response = await makeRequest("/fiuofferings/create", "POST", {
      offering_type: title,
      details: formData,
    })

    try {
      await response.json()
      route("/")
    } catch (error) {
      console.log({ error })
      logoutUser()
    }
  }

  const handleCancel = () => {
    route("/")
  }

  return (
    <div class="container">
      <h2>{`Create New ${title?.charAt(0).toUpperCase()}${title.substring(
        1
      )} Offering`}</h2>
      <form>
        {fields.map((field) => (
          <div class="form-field">
            <label for={field.id}>{field.label}</label>
            {field.fieldType === "select" ? (
              <select
                id={field.id}
                onChange={(e) =>
                  dispatch({
                    type: "update",
                    payload: { id: field.id, value: e.currentTarget.value },
                  })
                }
              >
                {field.options?.map((option) => (
                  <option value={option.value}>{option.label}</option>
                ))}
              </select>
            ) : (
              <input
                type={field.fieldType}
                id={field.id}
                onChange={(e) =>
                  dispatch({
                    type: "update",
                    payload: { id: field.id, value: e.currentTarget.value },
                  })
                }
              />
            )}
          </div>
        ))}
        <div class="btn-container">
          <button class="btn-cancel" onClick={handleCancel}>
            Cancel
          </button>
          <button onClick={handleSubmit}>Submit</button>
        </div>
      </form>
    </div>
  )
}
