document.addEventListener('DOMContentLoaded', function () {
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
})
