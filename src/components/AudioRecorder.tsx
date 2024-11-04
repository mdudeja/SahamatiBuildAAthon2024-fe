import { Button } from 'react-aria-components'
import MicrophoneIcon from '@/assets/images/icons/microphone.svg'
import { useState } from 'react'
import { Audio } from 'expo-av'
import { Recording } from 'expo-av/build/Audio'
import { ChatMessage } from '@/app'

export default function AudioRecorder({
  onRecordingComplete,
  updateMessageHistory,
}: {
  onRecordingComplete: (blob: Blob) => void
  updateMessageHistory: (message: ChatMessage) => void
}) {
  const [recording, setRecording] = useState<Recording>()
  const [permissionResponse, requestPermissions] = Audio.usePermissions()

  async function startRecording() {
    try {
      if (!permissionResponse?.granted) {
        console.log('Requesting permissions..')
        await requestPermissions()
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      })

      console.log('starting recording..')
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      )

      setRecording(recording)
    } catch (error) {
      console.error(error)
    }
  }

  async function stopRecording() {
    console.log('stopping recording..')

    if (!recording) {
      return
    }

    await recording.stopAndUnloadAsync()
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    })

    const uri = recording.getURI()

    if (!uri) {
      return
    }

    const res = await fetch(uri)
    const blob = await res.blob()

    setRecording(undefined)
    onRecordingComplete(blob)

    updateMessageHistory({
      text: 'Audio Message',
      type: 'user',
      isAudio: true,
      audioURI: uri,
    })
  }

  return (
    <Button
      className="p-2"
      aria-label="microphone button"
      onPress={recording ? stopRecording : startRecording}
    >
      <MicrophoneIcon
        className={`w-6 h-6 ${recording ? 'text-green-700' : 'text-black'}`}
      />
    </Button>
  )
}
