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
