import { useState } from 'react'
import { api } from '../api'
import type { AppSettings } from '../api'

const useUpdateSettings = () => {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const updateSettings = async (
    data: Partial<AppSettings>
  ): Promise<AppSettings | null> => {
    setSaving(true)
    try {
      const result = await api.settings.update(data)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      return result
    } catch {
      return null
    } finally {
      setSaving(false)
    }
  }

  return { updateSettings, saving, saved }
}

export default useUpdateSettings
