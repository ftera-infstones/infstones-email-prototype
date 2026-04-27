import { useState } from 'react'
import { api } from '../api'
import type { Template } from '../api'

const useCreateTemplate = () => {
  const [saving, setSaving] = useState(false)

  const createTemplate = async (
    data: Parameters<typeof api.templates.create>[0]
  ): Promise<Template | null> => {
    setSaving(true)
    try {
      return await api.templates.create(data)
    } catch {
      return null
    } finally {
      setSaving(false)
    }
  }

  return { createTemplate, saving }
}

export default useCreateTemplate
