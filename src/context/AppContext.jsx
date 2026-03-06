import React, {
  createContext, useContext, useState,
  useEffect, useCallback, useRef, useMemo
} from 'react'
import axiosInstance from '../api/axiosInstance'

const AppContext = createContext(null)

const PAGE_SIZE = 10  // fixed globally — never changes

export function AppProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user,            setUser]            = useState(null)
  const [sidebarOpen,     setSidebarOpen]     = useState(true)

  // Raw API data — all fetched records before any client-side filter
  const [allFetched,    setAllFetched]    = useState([])   // holds full gender-filtered list
  const [apiTotal,      setApiTotal]      = useState(0)    // total from API (no gender filter)
  const [loading,       setLoading]       = useState(false)
  const [error,         setError]         = useState(null)

  const [currentPage,   setCurrentPage]   = useState(1)
  const [searchQuery,   setSearchQuery]   = useState('')
  const [genderFilter,  setGenderFilter]  = useState('')

  // useRef — abort controller to cancel in-flight requests
  const abortRef = useRef(null)

  // Core fetch — when gender is selected fetch ALL matching patients at once
  // so client-side pagination always gives exactly 10 per page
  const fetchPatients = useCallback(async ({ query, gender, page } = {}) =>  {
    abortRef.current?.abort()
    abortRef.current = new AbortController()

    setLoading(true)
    setError(null)

    try {
      if (gender) {
        // GENDER MODE — fetch ALL 100 users, filter client-side, paginate locally
        // dummyjson has no gender query param so we fetch max and filter
        const url  = query
          ? `/users/search?q=${query}&limit=100&skip=0`
          : `/users?limit=100&skip=0`
        const data = await axiosInstance.get(url)
        const all  = (data.users || []).filter(u => u.gender === gender)
        setAllFetched(all)
        setApiTotal(all.length)
      } else {
        // NORMAL MODE — server-side pagination, 10 per page
        const skip = ((page ?? currentPage) - 1) * PAGE_SIZE
        const url  = query
          ? `/users/search?q=${query}&limit=${PAGE_SIZE}&skip=${skip}`
          : `/users?limit=${PAGE_SIZE}&skip=${skip}`
        const data = await axiosInstance.get(url)
        setAllFetched(data.users || [])
        setApiTotal(data.total  || 0)
      }
    } catch (err) {
      if (err?.name !== 'AbortError') {
        setError(typeof err === 'string' ? err : 'Failed to load patients')
      }
    } finally {
      setLoading(false)
    }
  }, [currentPage])

  // useMemo — slice the correct 10 patients for current page (only in gender mode)
  // In normal mode allFetched already has exactly 10 from the API
  const patients = useMemo(() => {
    if (!genderFilter) return allFetched   // normal mode — already paginated by API

    // gender mode — paginate locally from the full filtered list
    const start = (currentPage - 1) * PAGE_SIZE
    const end   = start + PAGE_SIZE
    return allFetched.slice(start, end)
  }, [allFetched, genderFilter, currentPage])

  // Total patients count — used for pagination controls
  const totalPatients = useMemo(() => {
    if (genderFilter) return allFetched.length  // exact filtered total
    return apiTotal
  }, [genderFilter, allFetched, apiTotal])

  // useEffect — refetch when search or gender changes (page reset handled by setters below)
  useEffect(() => {
    if (!isAuthenticated) return
    fetchPatients({ query: searchQuery, gender: genderFilter })
  }, [searchQuery, genderFilter, isAuthenticated])

  // useEffect — refetch on page change ONLY in normal mode (gender mode is client-side)
  useEffect(() => {
    if (!isAuthenticated) return
    if (genderFilter) return   // gender mode: no refetch needed, useMemo handles slicing
    fetchPatients({ query: searchQuery, gender: '', page: currentPage })
  }, [currentPage])

  const login         = useCallback((u) => { setIsAuthenticated(true);  setUser(u)    }, [])
  const logout        = useCallback(()  => { setIsAuthenticated(false); setUser(null) }, [])
  const toggleSidebar = useCallback(()  => setSidebarOpen(prev => !prev),                 [])

  return (
    <AppContext.Provider value={{
      isAuthenticated,
      user,
      sidebarOpen,
      patients,
      totalPatients,
      loading,
      error,
      currentPage,  setCurrentPage,
      pageSize: PAGE_SIZE,
      searchQuery,  setSearchQuery,
      genderFilter, setGenderFilter,
      login, logout, toggleSidebar,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be inside AppProvider')
  return ctx
}