document.addEventListener('DOMContentLoaded', () => {
  initSidebar()
  initTabs()

  loadProjects()
  loadEmployees()

  fillProjectsTable()
  fillEmployeesTable()

  initProjectModal()
  initEmployeeModal()

  initDeleteProject()
  initDeleteEmployee()
})
