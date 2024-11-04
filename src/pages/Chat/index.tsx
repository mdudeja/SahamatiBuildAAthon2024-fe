import { useCallback, useReducer, useState } from "preact/hooks"
import Chatbox from "../../components/Chatbox"

import "./style.css"

export type ChatMessage = {
  text: string
  type: "user" | "bot" | "articulation"
  clearTrigger?: boolean
  isAudio?: boolean
  audioURI?: string
}

export type ReducerAction = {
  type: "add" | "clear" | "add-articulation" | "remove-articulation"
  message: ChatMessage
}

export type DetectedLanguage = {
  lang_code: string
  lang_name: string
}

function messagesReducer(state: ChatMessage[], action: ReducerAction) {
  switch (action.type) {
    case "add":
      return [...state, action.message]
    case "add-articulation":
      const stateWithoutArticulation = state.filter(
        (message) => message.type !== "articulation"
      )
      return [...stateWithoutArticulation, action.message]
    case "remove-articulation":
      return state.filter((message) => message.type !== "articulation")
    case "clear":
      return []
    default:
      return state
  }
}

export function Chat() {
  const [currentQuestion, setCurrentQuestion] = useState("")
  const [messages, dispatch] = useReducer(messagesReducer, [])
  const [detectedLanguage, setDetectedLanguage] =
    useState<DetectedLanguage | null>({
      lang_code: "en",
      lang_name: "English",
    })

  const updateMessageHistory = useCallback((messageToAdd: ChatMessage) => {
    const dispatchType =
      messageToAdd.type === "articulation"
        ? messageToAdd.clearTrigger
          ? "remove-articulation"
          : "add-articulation"
        : "add"

    dispatch({
      type: dispatchType,
      message: messageToAdd,
    })

    setCurrentQuestion("")
  }, [])

  return (
    <div class="chats">
      {messages.map((message, index) => (
        <div key={index} class="chat-message">
          {message.type === "user" ? (
            <div class="user-message">{message.text}</div>
          ) : message.type === "bot" ? (
            <div class="bot-message">{message.text}</div>
          ) : (
            <div class="articulation-message">{message.text}</div>
          )}
        </div>
      ))}
      <Chatbox
        currentQuestion={currentQuestion}
        setCurrentQuestion={setCurrentQuestion}
        updateMessageHistory={updateMessageHistory}
        detectedLanguage={detectedLanguage}
        setDetectedLanguage={setDetectedLanguage}
      />
    </div>
  )
}
