import { useState } from 'react'
import { api } from '../api'

const useDeleteTemplate = () => {
  const [deleting, setDeleting] = useState(false)

  const deleteTemplate = async (id: string): Promise<boolean> => {
    setDeleting(true)
    try {
      await api.templates.delete(id)
      return true
    } catch {
      return false
    } finally {
      setDeleting(false)
    }
  }

  return { deleteTemplate, deleting }
}

export default useDeleteTemplate
