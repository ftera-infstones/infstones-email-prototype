import { useCallback, useEffect, useState } from 'react'
import { api } from '../api'
import type { Campaign } from '../api'
import type { CampaignStatus } from '../mock/data'

const useCampaignList = (status?: CampaignStatus) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)

  const getCampaigns = useCallback(async () => {
    setLoading(true)
    try {
      const data = await api.campaigns.list(status)
      setCampaigns(data)
    } catch {
      setCampaigns([])
    } finally {
      setLoading(false)
    }
  }, [status])

  useEffect(() => {
    getCampaigns()
  }, [getCampaigns])

  return { campaigns, loading, refresh: getCampaigns }
}

export default useCampaignList
