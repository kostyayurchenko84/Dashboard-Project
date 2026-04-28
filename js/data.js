const projectsData = []
const employeesData = []

// ---------- Localstorage ----------
const STORAGE_KEY = 'monthlyData'
//const CURRENT_MONTH = '2026-4'

// ---------- Переключение периода ----------
let currentYear = 2026
let currentMonth = 4

function getCurrentPeriodKey() {
  return `${currentYear}-${currentMonth}`
}

function setCurrentPeriod(year, month) {
  currentYear = year
  currentMonth = month
  loadAllData()
}

function loadAllData() {
  loadProjects()
  loadEmployees()
  fillProjectsTable()
  fillEmployeesTable()
}

function loadProjects() {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    const data = JSON.parse(saved)
    const periodKey = getCurrentPeriodKey()
    if (data[periodKey] && data[periodKey].projects) {
      projectsData.length = 0
      projectsData.push(...data[periodKey].projects)
    } else {
      projectsData.length = 0
    }
  } else {
    projectsData.length = 0
  }
  fillProjectsTable()
}

function saveProjects() {
  let saved = localStorage.getItem(STORAGE_KEY)
  let data = saved ? JSON.parse(saved) : {}
  const periodKey = getCurrentPeriodKey()

  if (!data[periodKey]) {
    data[periodKey] = { projects: [], employees: [] }
  }
  data[periodKey].projects = [...projectsData]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function loadEmployees() {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    const data = JSON.parse(saved)
    const periodKey = getCurrentPeriodKey()
    if (data[periodKey] && data[periodKey].employees) {
      employeesData.length = 0
      employeesData.push(...data[periodKey].employees)
    } else {
      employeesData.length = 0
    }
  } else {
    employeesData.length = 0
  }
  fillEmployeesTable()
}

function saveEmployees() {
  let saved = localStorage.getItem(STORAGE_KEY)
  let data = saved ? JSON.parse(saved) : {}
  const periodKey = getCurrentPeriodKey()

  if (!data[periodKey]) {
    data[periodKey] = { projects: [], employees: [] }
  }
  data[periodKey].employees = [...employeesData]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

// ---------- УДАЛЕНИЕ ПРОЕКТА ----------
function deleteProject(projectId) {
  const index = projectsData.findIndex((project) => project.id === projectId)
  if (index !== -1) {
    projectsData.splice(index, 1)

    saveProjects()
    fillProjectsTable()

    return true
  }
  return false
}

function initDeleteProject() {
  document.addEventListener('click', (e) => {
    const deleteBtn = e.target.closest('.delete-project-btn')
    if (!deleteBtn) return
    const projectId = deleteBtn.getAttribute('data-project-id')
    if (!projectId) return

    const project = projectsData.find((project) => project.id === projectId)
    const projectName = project ? project.projectName : 'проект'

    const isConfirmed = confirm(`Удалить проект "${projectName}"?`)

    if (isConfirmed) {
      deleteProject(projectId)
    }
  })
}

function deleteEmployee(employeeId) {
  const index = employeesData.findIndex((employee) => employee.id === employeeId)
  if (index !== -1) {
    employeesData.splice(index, 1)
    saveEmployees()
    fillEmployeesTable()

    return true
  }
  return false
}

function initDeleteEmployee() {
  document.addEventListener('click', (e) => {
    const deleteBtn = e.target.closest('.delete-employee-btn')
    if (!deleteBtn) return
    const employeeId = deleteBtn.getAttribute('data-employee-id')
    if (!employeeId) return

    const employee = employeesData.find((employee) => employee.id === employeeId)
    const employeeName = employee ? `${employee.name} ${employee.surname}` : 'сотрудника'

    const isConfirmed = confirm(`Вы уверены, что хотите удалить сотрудника "${employeeName}"?`)

    if (isConfirmed) {
      deleteEmployee(employeeId)
    }
  })
}
