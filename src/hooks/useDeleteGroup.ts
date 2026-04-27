import { useState } from 'react'
import { api } from '../api'

const useDeleteGroup = () => {
  const [deleting, setDeleting] = useState(false)

  const deleteGroup = async (id: string): Promise<boolean> => {
    setDeleting(true)
    try {
      await api.groups.delete(id)
      return true
    } catch {
      return false
    } finally {
      setDeleting(false)
    }
  }

  return { deleteGroup, deleting }
}

export default useDeleteGroup
