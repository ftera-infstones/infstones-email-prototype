import { useCallback, useEffect, useState } from 'react'
import { api } from '../api'
import type { TemplateDetail } from '../api'

const useTemplate = (id?: string) => {
  const [template, setTemplate] = useState<TemplateDetail | null>(null)
  const [loading, setLoading] = useState(!!id)

  const getTemplate = useCallback(async () => {
    if (!id) return
    setLoading(true)
    try {
      const data = await api.templates.getById(id)
      setTemplate(data)
    } catch {
      setTemplate(null)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    getTemplate()
  }, [getTemplate])

  return { template, loading }
}

export default useTemplate
