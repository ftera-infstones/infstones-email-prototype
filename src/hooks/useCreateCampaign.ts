import { useState } from 'react'
import { api } from '../api'
import type { Campaign } from '../api'

const useCreateCampaign = () => {
  const [saving, setSaving] = useState(false)

  const createCampaign = async (
    data: Parameters<typeof api.campaigns.create>[0]
  ): Promise<Campaign | null> => {
    setSaving(true)
    try {
      return await api.campaigns.create(data)
    } catch {
      return null
    } finally {
      setSaving(false)
    }
  }

  return { createCampaign, saving }
}

export default useCreateCampaign
