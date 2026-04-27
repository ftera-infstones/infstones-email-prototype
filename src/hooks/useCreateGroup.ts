import { useState } from 'react'
import { api } from '../api'
import type { Group } from '../api'

const useCreateGroup = () => {
  const [saving, setSaving] = useState(false)

  const createGroup = async (data: {
    name: string
    description: string
  }): Promise<Group | null> => {
    setSaving(true)
    try {
      return await api.groups.create(data)
    } catch {
      return null
    } finally {
      setSaving(false)
    }
  }

  return { createGroup, saving }
}

export default useCreateGroup
