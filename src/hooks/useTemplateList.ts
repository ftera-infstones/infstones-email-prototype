import { useEffect, useState } from 'react'
import { api } from '../api'
import type { Template } from '../api'

const useTemplateList = () => {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)

  function fetch() {
    setLoading(true)
    api.templates.list()
      .then(setTemplates)
      .catch(() => setTemplates([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetch() }, [])

  return { templates, loading, refresh: fetch }
}

export default useTemplateList
