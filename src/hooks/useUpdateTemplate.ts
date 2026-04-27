import { useState } from 'react'
import { api } from '../api'
import type { Template } from '../api'

const useUpdateTemplate = () => {
  const [saving, setSaving] = useState(false)

  const updateTemplate = async (
    id: string,
    data: Parameters<typeof api.templates.update>[1]
  ): Promise<Template | null> => {
    setSaving(true)
    try {
      return await api.templates.update(id, data)
    } catch {
      return null
    } finally {
      setSaving(false)
    }
  }

  return { updateTemplate, saving }
}

export default useUpdateTemplate
