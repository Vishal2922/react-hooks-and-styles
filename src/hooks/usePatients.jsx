import { useState, useEffect, useRef, useMemo } from 'react'
import axiosInstance from '../api/axiosInstance'

// Custom hook — useEffect + useRef + useCallback + useMemo all mandatorily used
export function usePatientDetail(id) {
  const [patient, setPatient] = useState(null)
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const abortRef = useRef(null)   // useRef — holds AbortController without triggering re-render

  // useEffect — side effect: fetch on mount / id change
  useEffect(() => {
    if (!id) return
    abortRef.current?.abort()
    abortRef.current = new AbortController()

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const [p, posts] = await Promise.all([
          axiosInstance.get(`/users/${id}`),
          axiosInstance.get(`/posts?limit=5`),
        ])
        setPatient(p)
        setAppointments(posts.posts || [])
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }
    load()
    return () => abortRef.current?.abort()
  }, [id])

  // useMemo — compute vitals only when patient changes
  const vitals = useMemo(() => {
    if (!patient) return null
    const h = patient.height || 170
    const w = patient.weight || 70
    const bmi = parseFloat((w / ((h / 100) ** 2)).toFixed(1))
    const bmiStatus =
      bmi < 18.5 ? { label: 'Underweight', color: '#f59e0b' } :
        bmi < 25 ? { label: 'Normal', color: '#22c55e' } :
          bmi < 30 ? { label: 'Overweight', color: '#f59e0b' } :
            { label: 'Obese', color: '#ef4444' }
    const hr = 60 + (patient.id % 40)
    const hrStatus = hr > 90 ? { label: 'High', color: '#ef4444' } : hr < 65 ? { label: 'Low', color: '#f59e0b' } : { label: 'Normal', color: '#22c55e' }
    const bpSys = 100 + (patient.id % 40)
    const bpDia = 60 + (patient.id % 20)
    const bpStatus = bpSys > 130 ? { label: 'Elevated', color: '#f59e0b' } : { label: 'Normal', color: '#22c55e' }
    const o2 = 94 + (patient.id % 6)
    const o2Status = o2 < 96 ? { label: 'Low', color: '#ef4444' } : { label: 'Normal', color: '#22c55e' }
    return { bmi, bmiStatus, hr, hrStatus, bpSys, bpDia, bpStatus, o2, o2Status }
  }, [patient])

  return { patient, appointments, vitals, loading, error }
}




// useAllPatients — fetches all 100 for statistics (useEffect + useMemo)
export function useAllPatients() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axiosInstance.get('/users?limit=100&skip=0')
      .then(d => setData(d.users || []))
      .catch(() => { })
      .finally(() => setLoading(false))
  }, [])

  // useMemo — derive all chart datasets without recomputing on every render
  const stats = useMemo(() => {
    if (!data.length) return null

    const ageBuckets = { '0–17': 0, '18–30': 0, '31–45': 0, '46–60': 0, '60+': 0 }
    data.forEach(p => {
      if (p.age <= 17) ageBuckets['0–17']++
      else if (p.age <= 30) ageBuckets['18–30']++
      else if (p.age <= 45) ageBuckets['31–45']++
      else if (p.age <= 60) ageBuckets['46–60']++
      else ageBuckets['60+']++
    })
    const ageData = Object.entries(ageBuckets).map(([name, value]) => ({ name, value }))

    const males = data.filter(p => p.gender === 'male').length
    const females = data.filter(p => p.gender === 'female').length
    const genderData = [
      { name: 'Male', value: males, color: '#0ea5e9' },
      { name: 'Female', value: females, color: '#ec4899' },
    ]

    const bgMap = {}
    data.forEach(p => { if (p.bloodGroup) bgMap[p.bloodGroup] = (bgMap[p.bloodGroup] || 0) + 1 })
    const bloodData = Object.entries(bgMap).map(([name, count]) => ({ name, count }))

    const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const monthlyData = MONTHS.map((m, i) => ({
      month: m,
      admissions: 18 + Math.round(Math.sin(i * 0.9) * 9 + i * 0.7),
      discharges: 14 + Math.round(Math.cos(i * 0.8) * 7 + i * 0.5),
      critical: 2 + (i % 4),
    }))

    const bmiData = data.slice(0, 14).map(p => ({
      name: p.firstName,
      bmi: parseFloat((p.weight / ((p.height / 100) ** 2)).toFixed(1)),
    }))

    const radarData = [
      { subject: 'Heart Rate', A: 82, B: 75 },
      { subject: 'Blood Pressure', A: 68, B: 74 },
      { subject: 'BMI', A: 77, B: 63 },
      { subject: 'Oxygen Sat.', A: 95, B: 90 },
      { subject: 'Glucose', A: 60, B: 80 },
      { subject: 'Cholesterol', A: 72, B: 68 },
    ]

    return { ageData, genderData, bloodData, monthlyData, bmiData, radarData, total: data.length }
  }, [data])

  return { stats, loading }
}