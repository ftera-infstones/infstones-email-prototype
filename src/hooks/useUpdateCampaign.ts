import { useState } from 'react'
import { api } from '../api'
import type { Campaign } from '../api'

const useUpdateCampaign = () => {
  const [saving, setSaving] = useState(false)

  const updateCampaign = async (
    id: string,
    data: Parameters<typeof api.campaigns.update>[1]
  ): Promise<Campaign | null> => {
    setSaving(true)
    try {
      return await api.campaigns.update(id, data)
    } catch {
      return null
    } finally {
      setSaving(false)
    }
  }

  return { updateCampaign, saving }
}

export default useUpdateCampaign
