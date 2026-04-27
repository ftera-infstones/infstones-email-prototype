import { useState } from 'react'
import { api } from '../api'

const useDeleteSubscriber = () => {
  const [deleting, setDeleting] = useState(false)

  const deleteSubscriber = async (id: string): Promise<boolean> => {
    setDeleting(true)
    try {
      await api.subscribers.delete(id)
      return true
    } catch {
      return false
    } finally {
      setDeleting(false)
    }
  }

  return { deleteSubscriber, deleting }
}

export default useDeleteSubscriber
