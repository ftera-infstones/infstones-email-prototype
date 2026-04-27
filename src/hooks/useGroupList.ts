import { useEffect, useState } from 'react'
import { api } from '../api'
import type { Group } from '../api'

const useGroupList = () => {
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    api.groups.list()
      .then(setGroups)
      .catch(() => setGroups([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  return { groups, loading, refresh: load }
}

export default useGroupList
