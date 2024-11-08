import { useEffect, useRef, useState } from "react"
import { io, Socket } from "socket.io-client"
import { v4 as uuidv4 } from "uuid"

export type OutgoingMessageEvent = {
  event:
    | "question-text"
    | "question-voice"
    | "translate"
    | "get-language"
    | "tts"
  content: any
  needsTTS?: boolean
  endUserDetails?: any
}

export type IncomingMessageEvent = {
  event:
    | "answer-text"
    | "answer-voice"
    | "translation"
    | "language"
    | "articulating"
    | "tts"
  content: any
  toUserLanguage?: boolean
  clearTrigger?: boolean
  needsTTS?: boolean
  endUserDetails?: any
}

export default function useWebSocket({
  url,
  onConnect,
  onDisconnect,
  onMessage,
  onError,
}: {
  url: string
  onMessage: (message: IncomingMessageEvent) => void
  onConnect?: () => void
  onDisconnect?: (reason: any, description?: any) => void
  onError?: (e: any) => void
}) {
  const [isConnected, setIsConnected] = useState(false)
  const socket = useRef<Socket | null>(null)

  useEffect(() => {
    let session_id = sessionStorage.getItem("session_id")

    if (!session_id) {
      sessionStorage.setItem("session_id", uuidv4())
      session_id = sessionStorage.getItem("session_id")
    }

    if (!socket.current) {
      ;(socket as any).current = io(`${url}?session_id=${session_id}`, {
        autoConnect: false,
      })
    }

    return () => {
      socket.current?.removeAllListeners()
      socket.current?.close()
    }
  }, [url])

  useEffect(() => {
    if (!socket.current) {
      return
    }

    socket.current.removeAllListeners()

    socket.current.on("connect", () => {
      console.log(`Socket Connected to ${url}`)
      setIsConnected(true)
      onConnect?.()
    })

    socket.current.on("disconnect", (reason, description) => {
      console.log(`Socket Disconnected from ${url}`)
      setIsConnected(false)
      onDisconnect?.(reason, description)
    })

    socket.current.on("message", (message) => {
      console.log(`Socket Message from ${url}`)
      onMessage(message)
    })

    socket.current.on("error", (e) => {
      console.log(`Socket Error from ${url}`)
      console.log(e)
      setIsConnected(false)
      onError?.(e)
    })
  }, [onConnect, onDisconnect, onMessage, onError, socket!])

  return {
    sendMessage: (message: OutgoingMessageEvent) => {
      console.log(
        `Message to send to socket: ${JSON.stringify(message, null, 2)}`
      )
      console.log(`Socket Connected: ${isConnected}`)
      socket.current?.emit("client-message", message)
    },
    closeConnection: () => {
      socket.current?.close()
    },
    connect: () => {
      socket.current?.connect()
    },
    getIsConnected: () => isConnected,
  }
}
