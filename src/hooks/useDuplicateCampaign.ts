import { useState } from 'react'
import { api } from '../api'
import type { Campaign } from '../api'

const useDuplicateCampaign = () => {
  const [duplicating, setDuplicating] = useState(false)

  const duplicateCampaign = async (id: string): Promise<Campaign | null> => {
    setDuplicating(true)
    try {
      return await api.campaigns.duplicate(id)
    } catch {
      return null
    } finally {
      setDuplicating(false)
    }
  }

  return { duplicateCampaign, duplicating }
}

export default useDuplicateCampaign
