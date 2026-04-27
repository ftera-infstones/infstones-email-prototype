import { useState } from 'react'
import { api } from '../api'
import type { Subscriber } from '../api'

const useCreateSubscriber = () => {
  const [saving, setSaving] = useState(false)

  const createSubscriber = async (
    data: Parameters<typeof api.subscribers.create>[0]
  ): Promise<Subscriber | null> => {
    setSaving(true)
    try {
      return await api.subscribers.create(data)
    } catch {
      return null
    } finally {
      setSaving(false)
    }
  }

  return { createSubscriber, saving }
}

export default useCreateSubscriber
