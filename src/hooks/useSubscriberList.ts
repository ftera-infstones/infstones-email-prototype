import { useCallback, useEffect, useState } from 'react'
import { api } from '../api'
import type { Subscriber } from '../api'
import type { SubscriberStatus } from '../mock/data'

const useSubscriberList = (status?: SubscriberStatus, group?: string) => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)

  const getSubscribers = useCallback(async () => {
    setLoading(true)
    try {
      const data = await api.subscribers.list({ status, group })
      setSubscribers(data)
    } catch {
      setSubscribers([])
    } finally {
      setLoading(false)
    }
  }, [status, group])

  useEffect(() => {
    getSubscribers()
  }, [getSubscribers])

  return { subscribers, loading, refresh: getSubscribers }
}

export default useSubscriberList
