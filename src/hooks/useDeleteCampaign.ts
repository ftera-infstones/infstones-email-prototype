import { useState } from 'react'
import { api } from '../api'

const useDeleteCampaign = () => {
  const [deleting, setDeleting] = useState(false)

  const deleteCampaign = async (id: string): Promise<boolean> => {
    setDeleting(true)
    try {
      await api.campaigns.delete(id)
      return true
    } catch {
      return false
    } finally {
      setDeleting(false)
    }
  }

  return { deleteCampaign, deleting }
}

export default useDeleteCampaign
