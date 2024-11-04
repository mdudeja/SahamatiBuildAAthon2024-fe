import SendIcon from "../assets/images/send.svg"
import { useCallback, useEffect, useState } from "react"
import useWebSocket, { IncomingMessageEvent } from "../lib/hooks/useWebSocket"
import { ChatMessage, DetectedLanguage } from "../pages/Chat"

import "./chatbox.style.css"
import { constants } from "../lib/constants"

export default function Chatbox({
  currentQuestion,
  setCurrentQuestion,
  updateMessageHistory,
  detectedLanguage,
  setDetectedLanguage,
}: {
  currentQuestion: string
  setCurrentQuestion: (question: string) => void
  updateMessageHistory: (message: ChatMessage) => void
  detectedLanguage: DetectedLanguage | null
  setDetectedLanguage: (language: DetectedLanguage | null) => void
}) {
  const [inputFocussed, setInputFocussed] = useState(false)
  const [inputHasThreeOrMoreWords, setInputHasThreeOrMoreWords] =
    useState(false)

  const socket = useWebSocket({
    url: constants.backendUrl + "/chat",
    onMessage: (message: IncomingMessageEvent) => {
      console.log(JSON.stringify(message, null, 2))
      switch (message.event) {
        case "answer-text":
          if (
            detectedLanguage &&
            detectedLanguage.lang_code &&
            detectedLanguage.lang_code !== "en"
          ) {
            socket.sendMessage({
              event: "translate",
              content: {
                text: message.content,
                targetLanguage: detectedLanguage.lang_code,
              },
              needsTTS: message.needsTTS,
            })
            return
          }

          if (message.needsTTS) {
            socket.sendMessage({
              event: "tts",
              content: message.content,
            })
            return
          }

          updateMessageHistory({
            text: message.content,
            type: "bot",
          })
          break

        case "language":
          setDetectedLanguage(message.content)
          break

        case "translation":
          if (!message.toUserLanguage) {
            socket.sendMessage({
              event: "question-text",
              content: message.content.trim(),
            })
            return
          }

          if (!message.needsTTS) {
            updateMessageHistory({
              text: message.content,
              type: "bot",
            })
            return
          }

          socket.sendMessage({
            event: "tts",
            content: message.content,
          })
          break

        case "articulating":
          updateMessageHistory({
            text: message.content,
            type: "articulation",
            clearTrigger: message.clearTrigger,
          })
          break

        case "answer-voice":
          setDetectedLanguage({
            lang_code: message.content.source_lang_code,
            lang_name: message.content.source_lang_name,
          })
          socket.sendMessage({
            event: "question-text",
            content: message.content.text,
            needsTTS: true,
          })
          break

        case "tts":
          updateMessageHistory({
            text: "Audio Response",
            type: "bot",
            isAudio: true,
            // audioURI: `${process.env.EXPO_PUBLIC_BACKEND_URL}/tts/${message.content.url}`,
          })
        default:
          break
      }
    },
  })

  useEffect(() => {
    if (currentQuestion && currentQuestion.length > 0 && !inputFocussed) {
      setInputFocussed(true)
    }
    setInputHasThreeOrMoreWords(currentQuestion.split(" ").length > 3)
  }, [currentQuestion, inputFocussed])

  useEffect(() => {
    if (inputHasThreeOrMoreWords && !detectedLanguage) {
      if (!socket.getIsConnected()) {
        socket.connect()
      }

      socket.sendMessage({
        event: "get-language",
        content: currentQuestion,
      })
    }
  }, [detectedLanguage, inputHasThreeOrMoreWords])

  const onSend = useCallback(() => {
    if (currentQuestion && currentQuestion.length > 0) {
      if (!socket.getIsConnected()) {
        socket.connect()
      }

      if (!detectedLanguage) {
        console.log("Detected language is null")
        return
      }

      const languageCode = detectedLanguage.lang_code

      if (languageCode !== "en") {
        socket.sendMessage({
          event: "translate",
          content: {
            text: currentQuestion,
            targetLanguage: "en",
          },
        })
      } else {
        socket.sendMessage({
          event: "question-text",
          content: currentQuestion,
        })
      }
    }

    updateMessageHistory({
      text: currentQuestion,
      type: "user",
    })
  }, [currentQuestion, socket])

  const onInputChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      setCurrentQuestion(ev.currentTarget.value)
    },
    [setCurrentQuestion, socket, detectedLanguage]
  )

  const onRecordingComplete = useCallback(
    (blob: Blob) => {
      if (!socket.getIsConnected()) {
        socket.connect()
      }

      socket.sendMessage({
        event: "question-voice",
        content: blob,
      })
    },
    [socket]
  )

  return (
    <div class="chatbox-container">
      <input type="text" value={currentQuestion} onChange={onInputChange} />
      <button onClick={onSend}>
        <img src={SendIcon} alt="Send" width={25} height={25} />
      </button>
    </div>
  )
}
