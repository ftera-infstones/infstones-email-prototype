import { useState } from 'react'
import { api } from '../api'
import type { Subscriber } from '../api'

const useGroupMembers = () => {
  const [members, setMembers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(false)

  const getMembers = async (groupName: string): Promise<void> => {
    setLoading(true)
    try {
      const data = await api.subscribers.list({ group: groupName })
      setMembers(data)
    } catch {
      setMembers([])
    } finally {
      setLoading(false)
    }
  }

  return { members, loading, getMembers }
}

export default useGroupMembers
