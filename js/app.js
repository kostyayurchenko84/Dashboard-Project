document.addEventListener('DOMContentLoaded', () => {
  initSidebar()
  initTabs()
  initPeriodSelectors()
  initSorting()

  loadProjects()
  loadEmployees()

  fillProjectsTable()
  fillEmployeesTable()

  initProjectModal()
  initEmployeeModal()

  initDeleteProject()
  initDeleteEmployee()
})
