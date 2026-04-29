// ---------- ВАЛИДАЦИЯ ----------

function validateProjectName(name) {
  if (!name || name.length < 3) {
    return { valid: false, message: 'Не менее 3 символов в названии проекта' }
  }
  if (!/^[a-zA-Z0-9а-яА-Я\s]+$/.test(name)) {
    return { valid: false, message: 'Разрешены только буквы и цифры' }
  }
  return { valid: true, message: '' }
}

function validateCompanyName(name) {
  if (!name || name.length < 3) {
    return { valid: false, message: 'Не менее 3 символов в названии компании' }
  }
  if (!/^[a-zA-Z0-9а-яА-Я\s]+$/.test(name)) {
    return { valid: false, message: 'Разрешены только буквы и цифры' }
  }
  return { valid: true, message: '' }
}

function validateBudget(budget) {
  const num = parseInt(budget)
  if (isNaN(num) || num <= 0) {
    return { valid: false, message: 'Бюджет должен быть больше 0' }
  }
  return { valid: true, message: '' }
}

function validateCapacity(capacity) {
  const num = parseInt(capacity)
  if (isNaN(num) || num < 1) {
    return { valid: false, message: 'Число должно быть больше 0' }
  }
  return { valid: true, message: '' }
}

/* Add project */
function addProject(projectData) {
  const newProject = {
    id: `p${Date.now()}`,
    companyName: projectData.companyName,
    projectName: projectData.projectName,
    budget: parseInt(projectData.budget),
    employeeCapacity: parseInt(projectData.employeeCapacity),
    employees: [],
  }

  projectsData.push(newProject)
  saveProjects()
  fillProjectsTable()
}

// ---------- УПРАВЛЕНИЕ МОДАЛЬНЫМ ОКНОМ ----------
let currentFormData = {
  projectName: { valid: false, message: '' },
  companyName: { valid: false, message: '' },
  budget: { valid: false, message: '' },
  capacity: { valid: false, message: '' },
}

function updateSubmitButton() {
  const submitBtn = document.getElementById('submit-project-btn')
  const isValid =
    currentFormData.projectName.valid &&
    currentFormData.companyName.valid &&
    currentFormData.budget.valid &&
    currentFormData.capacity.valid
  submitBtn.disabled = !isValid
}

function validateField(field, value) {
  let validation
  switch (field) {
    case 'projectName':
      validation = validateProjectName(value)
      break
    case 'companyName':
      validation = validateCompanyName(value)
      break
    case 'budget':
      validation = validateBudget(value)
      break
    case 'capacity':
      validation = validateCapacity(value)
      break
    default:
      return
  }
  //console.log(field, value, validation)

  currentFormData[field] = { valid: validation.valid, message: validation.message }

  const errorDiv = document.getElementById(`${field}-error`)
  const input = document.getElementById(
    field === 'projectName'
      ? 'projectName'
      : field === 'companyName'
        ? 'companyName'
        : field === 'budget'
          ? 'budget'
          : 'employeeCapacity',
  )

  errorDiv.textContent = validation.message

  if (!validation.valid) {
    input.classList.add('error')
  } else {
    input.classList.remove('error')
  }

  updateSubmitButton()
}

function resetForm() {
  currentFormData = {
    projectName: { valid: false, message: '' },
    companyName: { valid: false, message: '' },
    budget: { valid: false, message: '' },
    capacity: { valid: false, message: '' },
  }

  const inputs = ['projectName', 'companyName', 'budget', 'employeeCapacity']
  inputs.forEach((id) => {
    const input = document.getElementById(id)
    if (input) {
      input.value = ''
      input.classList.remove('error')
    }
  })

  const errors = ['projectName-error', 'companyName-error', 'budget-error', 'capacity-error']
  errors.forEach((id) => {
    const errorDiv = document.getElementById(id)
    if (errorDiv) errorDiv.textContent = ''
  })

  updateSubmitButton()
}

function openProjectModal() {
  resetForm()
  const modal = document.getElementById('project-modal')
  modal.classList.add('active')
}

function closeProjectModal() {
  const modal = document.getElementById('project-modal')
  modal.classList.remove('active')
  resetForm()
}

function initProjectModal() {
  const addBtn = document.getElementById('add-project-btn')
  const closeBtn = document.getElementById('close-project-modal')
  const cancelBtn = document.getElementById('cancel-project-btn')
  const modal = document.getElementById('project-modal')
  const form = document.getElementById('project-form')

  addBtn.addEventListener('click', openProjectModal)
  closeBtn.addEventListener('click', closeProjectModal)
  cancelBtn.addEventListener('click', closeProjectModal)

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeProjectModal()
  })

  const projectNameInput = document.getElementById('projectName')
  const companyNameInput = document.getElementById('companyName')
  const budgetInput = document.getElementById('budget')
  const capacityInput = document.getElementById('employeeCapacity')

  projectNameInput.addEventListener('input', (e) => validateField('projectName', e.target.value))
  projectNameInput.addEventListener('blur', (e) => validateField('projectName', e.target.value))
  companyNameInput.addEventListener('input', (e) => validateField('companyName', e.target.value))
  companyNameInput.addEventListener('blur', (e) => validateField('companyName', e.target.value))
  budgetInput.addEventListener('input', (e) => validateField('budget', e.target.value))
  budgetInput.addEventListener('blur', (e) => validateField('budget', e.target.value))
  capacityInput.addEventListener('input', (e) => validateField('capacity', e.target.value))
  capacityInput.addEventListener('blur', (e) => validateField('capacity', e.target.value))

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const projectName = document.getElementById('projectName').value
    const companyName = document.getElementById('companyName').value
    const budget = document.getElementById('budget').value
    const capacity = document.getElementById('employeeCapacity').value

    const isProjectNameValid = validateProjectName(projectName).valid
    const isCompanyNameValid = validateCompanyName(companyName).valid
    const isBudgetValid = validateBudget(budget).valid
    const isCapacityValid = validateCapacity(capacity).valid

    if (isProjectNameValid && isCompanyNameValid && isBudgetValid && isCapacityValid) {
      addProject({
        projectName: projectName,
        companyName: companyName,
        budget: budget,
        employeeCapacity: capacity,
      })
      closeProjectModal()
    }
  })
}
