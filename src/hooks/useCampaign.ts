import { useCallback, useEffect, useState } from 'react'
import { api } from '../api'
import type { Campaign } from '../api'

const useCampaign = (id?: string) => {
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [loading, setLoading] = useState(!!id)

  const getCampaign = useCallback(async () => {
    if (!id) return
    setLoading(true)
    try {
      const data = await api.campaigns.getById(id)
      setCampaign(data)
    } catch {
      setCampaign(null)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    getCampaign()
  }, [getCampaign])

  return { campaign, loading }
}

export default useCampaign
