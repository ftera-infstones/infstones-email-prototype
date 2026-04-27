import { useEffect, useState } from 'react'
import { api } from '../api'
import type { DashboardMetrics } from '../api'

const useDashboardMetrics = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.dashboard.getMetrics()
      .then(setMetrics)
      .catch(() => setMetrics(null))
      .finally(() => setLoading(false))
  }, [])

  return { metrics, loading }
}

export default useDashboardMetrics
