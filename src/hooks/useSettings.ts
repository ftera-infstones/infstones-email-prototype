import { useEffect, useState } from 'react'
import { api } from '../api'
import type { AppSettings } from '../api'

const useSettings = () => {
  const [settings, setSettings] = useState<AppSettings | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.settings.get()
      .then(setSettings)
      .catch(() => setSettings(null))
      .finally(() => setLoading(false))
  }, [])

  return { settings, loading }
}

export default useSettings
