function fillProjectsTable() {
  const tbody = document.querySelector('#projects-table-container tbody')

  if (projectsData.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7">Нет данных</td></tr>'
    return
  }
  tbody.innerHTML = projectsData
    .map((project) => {
      const budgetFormatted = `$ ${project.budget}`

      const usedCapacity = project.employees.length
      const capacityDisplay = `${usedCapacity}/${project.employeeCapacity}`

      const estimatedIncome = `$ ${project.budget * 0.15}`
      return `
        <tr data-project-id="${project.id}">
          <td>${project.companyName}</td>
          <td>${project.projectName}</td>
          <td>${budgetFormatted}</td>
          <td>${capacityDisplay}</td>
          <td><button class="show-employees-btn" data-project-id="${project.id}">👥 Show Employees (${project.employees.length})</button></td>
          <td>${estimatedIncome}</td>
          <td><button class="delete-project-btn" data-project-id="${project.id}">🗑️</button></td>
        </tr>
      `
    })
    .join('')
}

function fillEmployeesTable() {
  const tbody = document.querySelector('#employees-table-container tbody')

  if (employeesData.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9">Нет данных</td></tr>'
    return
  }

  function calculateAge(birthDate) {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  tbody.innerHTML = employeesData
    .map((employee) => {
      const age = calculateAge(employee.birthDate)
      const salaryFormatted = `$ ${employee.salary}`

      const estimatedPayment = `$ ${employee.salary * 0.7}`

      const totalCapacity = employee.assignments.reduce((sum, a) => sum + a.capacity, 0) || 0
      const capacityDisplay = `${totalCapacity.toFixed(1)}/1.5`

      const projectedIncome = `$ ${employee.salary * 0.3}`

      return `
        <tr data-employee-id="${employee.id}">
          <td>${employee.name}</td>
          <td>${employee.surname}</td>
          <td>${age}</td>
          <td><span class="editable-position" data-employee-id="${employee.id}">${employee.position}</span></td>
          <td><span class="editable-salary" data-employee-id="${employee.id}">${salaryFormatted}</span></td>
          <td>${estimatedPayment}</td>
          <td><button class="show-assignments-btn" data-employee-id="${employee.id}">📋 Show Assignments (${employee.assignments.length}) ${capacityDisplay}</button></td>
          <td>${projectedIncome}</td>
          <td>
            <button class="availability-btn" data-employee-id="${employee.id}">📅</button>
            <button class="assign-btn" data-employee-id="${employee.id}">➕ Assign</button>
            <button class="delete-employee-btn" data-employee-id="${employee.id}">🗑️</button>
          </td>
        </tr>
      `
    })
    .join('')
}

function initSidebar() {
  //Кнопка боковой панели
  const sidebar = document.querySelector('.sidebar')
  const toggleBtn = document.querySelector('.sidebar-toggle-btn')
  const menuButton = document.querySelector('.menu-button')

  function hideSidebar() {
    sidebar.classList.add('hidden')
    menuButton.classList.add('visible')
  }

  function showSidebar() {
    sidebar.classList.remove('hidden')
    menuButton.classList.remove('visible')
  }

  toggleBtn.addEventListener('click', hideSidebar)
  menuButton.addEventListener('click', showSidebar)
}

function initTabs() {
  // Переключение вкладок
  const navTabs = document.querySelectorAll('.nav-tab')
  const projectsContainer = document.getElementById('projects-table-container')
  const employeesContainer = document.getElementById('employees-table-container')

  navTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const tabName = tab.getAttribute('data-tab')
      navTabs.forEach((t) => t.classList.remove('active'))
      tab.classList.add('active')

      if (tabName === 'projects') {
        projectsContainer.classList.remove('hidden')
        employeesContainer.classList.add('hidden')
      } else {
        projectsContainer.classList.add('hidden')
        employeesContainer.classList.remove('hidden')
      }
    })
  })
}

// ---------- Переключение месяцы года ----------

function initPeriodSelectors() {
  const monthSelect = document.getElementById('month-select')
  const yearSelect = document.getElementById('year-select')

  monthSelect.value = currentMonth.toString()
  yearSelect.value = currentYear.toString()

  monthSelect.addEventListener('change', (e) => {
    const newMonth = parseInt(e.target.value)
    if (newMonth !== currentMonth) {
      setCurrentPeriod(currentYear, newMonth)
    }
  })

  yearSelect.addEventListener('change', (e) => {
    const newYear = parseInt(e.target.value)
    if (newYear !== currentYear) {
      setCurrentPeriod(newYear, currentMonth)
    }
  })
}

// ---------- Сортировка таблиц ----------

let projectsSortField = 'companyName'
let projectsSortDirection = 'asc'

let employeesSortField = 'name'
let employeesSortDirection = 'asc'

function sortProjects() {
  const sortField = projectsSortField
  const direction = projectsSortDirection

  projectsData.sort((a, b) => {
    let valueA, valueB
    switch (sortField) {
      case 'companyName':
        valueA = a.companyName || ''
        valueB = b.companyName || ''
        break
      case 'projectName':
        valueA = a.projectName || ''
        valueB = b.projectName || ''
        break
      case 'budget':
        valueA = a.budget || 0
        valueB = b.budget || 0
        break
      case 'employeeCapacity':
        valueA = a.employeeCapacity || 0
        valueB = b.employeeCapacity || 0
        break
      case 'estimatedIncome':
        valueA = (a.budget || 0) * 0.15
        valueB = (b.budget || 0) * 0.15
        break
      default:
        return 0
    }

    if (typeof valueA === 'string') {
      valueA = valueA.toLowerCase()
      valueB = valueB.toLowerCase()
    }

    if (valueA < valueB) return direction === 'asc' ? -1 : 1
    if (valueA > valueB) return direction === 'asc' ? 1 : -1
    return 0
  })

  fillProjectsTable()
  updateSortIcons('projects')
}

function sortEmployees() {
  const sortField = employeesSortField
  const direction = employeesSortDirection

  function calculateAge(birthDate) {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  employeesData.sort((a, b) => {
    let valueA, valueB

    switch (sortField) {
      case 'name':
        valueA = a.name || ''
        valueB = b.name || ''
        break
      case 'surname':
        valueA = a.surname || ''
        valueB = b.surname || ''
        break
      case 'age':
        valueA = calculateAge(a.birthDate)
        valueB = calculateAge(b.birthDate)
        break
      case 'position':
        const positions = { Junior: 1, Middle: 2, Senior: 3, Lead: 4, Architect: 5, BO: 6 }
        valueA = positions[a.position] || 0
        valueB = positions[b.position] || 0
        break
      case 'salary':
        valueA = a.salary || 0
        valueB = b.salary || 0
        break
      case 'estimatedPayment':
        valueA = (a.salary || 0) * 0.7
        valueB = (b.salary || 0) * 0.7
        break
      case 'projectedIncome':
        valueA = (a.salary || 0) * 0.3
        valueB = (b.salary || 0) * 0.3
        break
      default:
        return 0
    }

    if (typeof valueA === 'string') {
      valueA = valueA.toLowerCase()
      valueB = valueB.toLowerCase()
    }

    if (valueA < valueB) return direction === 'asc' ? -1 : 1
    if (valueA > valueB) return direction === 'asc' ? 1 : -1
    return 0
  })

  fillEmployeesTable()
  updateSortIcons('employees')
}

function updateSortIcons(tableType) {
  const isProjects = tableType === 'projects'
  const sortField = isProjects ? projectsSortField : employeesSortField
  const direction = isProjects ? projectsSortDirection : employeesSortDirection

  const headers = document.querySelectorAll(
    isProjects ? '#projects-table-container .sortable-header' : '#employees-table-container .sortable-header',
  )

  headers.forEach((header) => {
    const icon = header.querySelector('.sort-icon')
    if (!icon) return

    const field = header.getAttribute('data-sort')

    if (field === sortField) {
      icon.textContent = direction === 'asc' ? '↑' : '↓'
      icon.classList.add(direction === 'asc' ? 'asc' : 'desc')
    } else {
      icon.textContent = '⇅'
      icon.classList.remove('asc', 'desc')
    }
  })
}

function handleSortClick(event) {
  if (!event || !event.target) return
  const header = event.target.closest('.sortable-header')
  if (!header) return
  const tableContainer = header.closest('.table-container')
  const isProjects = tableContainer?.id === 'projects-table-container'
  const field = header.getAttribute('data-sort')
  if (!field) return

  if (isProjects) {
    if (projectsSortField === field) {
      projectsSortDirection = projectsSortDirection === 'asc' ? 'desc' : 'asc'
    } else {
      projectsSortField = field
      projectsSortDirection = 'asc'
    }
    sortProjects()
  } else {
    if (employeesSortField === field) {
      employeesSortDirection = employeesSortDirection === 'asc' ? 'desc' : 'asc'
    } else {
      employeesSortField = field
      employeesSortDirection = 'asc'
    }
    sortEmployees()
  }
}

function initSorting() {
  document.addEventListener('click', handleSortClick)
}
