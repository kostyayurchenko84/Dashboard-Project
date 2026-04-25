const projectsData = []
const employeesData = []

// ---------- Localstorage ----------
const STORAGE_KEY = 'monthlyData'
const CURRENT_MONTH = '2026-4'

function loadProjects() {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    const data = JSON.parse(saved)
    if (data[CURRENT_MONTH] && data[CURRENT_MONTH].projects) {
      projectsData.length = 0
      projectsData.push(...data[CURRENT_MONTH].projects)
    }
  }
  fillProjectsTable()
}

function saveProjects() {
  let saved = localStorage.getItem(STORAGE_KEY)
  let data = saved ? JSON.parse(saved) : {}

  if (!data[CURRENT_MONTH]) {
    data[CURRENT_MONTH] = { projects: [], employees: [] }
  }

  data[CURRENT_MONTH].projects = [...projectsData]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}
