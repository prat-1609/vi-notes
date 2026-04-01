import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
})

export const startSession = async () => {
  const response = await api.post('/sessions/start')
  return response.data
}

export const getSessionById = async (sessionId: string) => {
  const response = await api.get(`/sessions/${sessionId}`)
  return response.data
}

export const updateSessionText = async (sessionId: string, text: string) => {
  const response = await api.post(`/sessions/${sessionId}/text`, { text })
  return response.data
}

export const recordPasteEvent = async (
  sessionId: string,
  payload: {
    timestamp: number
    charCount: number
    wordCount: number
    lineCount: number
    cursorStart?: number
    cursorEnd?: number
  }
) => {
  const response = await api.post(`/sessions/${sessionId}/paste-event`, payload)
  return response.data
}