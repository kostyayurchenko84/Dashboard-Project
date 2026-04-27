// ---------- ВАЛИДАЦИЯ СОТРУДНИКОВ ----------

function validateEmployeeName(name) {
  if (!name || name.length < 3) {
    return { valid: false, message: 'Не менее 3 букв в имени' }
  }
  if (!/^[a-zA-Zа-яА-Я]+$/.test(name)) {
    return { valid: false, message: 'Разрешены только буквы' }
  }
  return { valid: true, message: '' }
}

function validateEmployeeSurname(surname) {
  if (!surname || surname.length < 3) {
    return { valid: false, message: 'Не менее 3 букв в фамилии' }
  }
  if (!/^[a-zA-Zа-яА-Я]+$/.test(surname)) {
    return { valid: false, message: 'Разрешены только буквы' }
  }
  return { valid: true, message: '' }
}

function validateBirthDate(birthDate) {
  if (!birthDate) {
    return { valid: false, message: 'Дата рождения обязательна' }
  }
  const birth = new Date(birthDate)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }

  if (age < 18) {
    return { valid: false, message: 'Возраст должен быть 18 лет или старше' }
  }
  return { valid: true, message: '' }
}

function validatePosition(position) {
  if (!position) {
    return { valid: false, message: 'Выберите должность' }
  }
  return { valid: true, message: '' }
}

function validateEmployeeSalary(salary) {
  const num = parseFloat(salary)
  if (isNaN(num) || num <= 0) {
    return { valid: false, message: 'Зарплата должна быть больше 0' }
  }
  return { valid: true, message: '' }
}

function addEmployee(employeeData) {
  const newEmployee = {
    id: `e${Date.now()}`,
    name: employeeData.name,
    surname: employeeData.surname,
    birthDate: employeeData.birthDate,
    position: employeeData.position,
    salary: parseFloat(employeeData.salary),
    assignments: [],
  }

  employeesData.push(newEmployee)
  saveEmployees()
  fillEmployeesTable()
  return true
}

// ---------- УПРАВЛЕНИЕ МОДАЛЬНЫМ ОКНОМ ----------

let currentEmployeeFormData = {
  name: { valid: false, message: '' },
  surname: { valid: false, message: '' },
  birthDate: { valid: false, message: '' },
  position: { valid: false, message: '' },
  salary: { valid: false, message: '' },
}

function updateEmployeeSubmitButton() {
  const submitBtn = document.getElementById('submit-employee-btn')

  const isValid =
    currentEmployeeFormData.name.valid &&
    currentEmployeeFormData.surname.valid &&
    currentEmployeeFormData.birthDate.valid &&
    currentEmployeeFormData.position.valid &&
    currentEmployeeFormData.salary.valid

  submitBtn.disabled = !isValid
}

function validateEmployeeField(field, value) {
  let validation

  switch (field) {
    case 'name':
      validation = validateEmployeeName(value)
      break
    case 'surname':
      validation = validateEmployeeSurname(value)
      break
    case 'birthDate':
      validation = validateBirthDate(value)
      break
    case 'position':
      validation = validatePosition(value)
      break
    case 'salary':
      validation = validateEmployeeSalary(value)
      break
    default:
      return
  }

  currentEmployeeFormData[field] = { valid: validation.valid, message: validation.message }

  //const errorDiv = document.getElementById(`${field}-error`)
  //const input = document.getElementById(field === 'salary' ? 'employeeSalary' : field)
  let errorId
  if (field === 'name') errorId = 'employeeName-error'
  else if (field === 'surname') errorId = 'employeeSurname-error'
  else if (field === 'birthDate') errorId = 'birthDate-error'
  else if (field === 'position') errorId = 'position-error'
  else if (field === 'salary') errorId = 'employeeSalary-error'

  const errorDiv = document.getElementById(errorId)
  errorDiv.textContent = validation.message

  let inputId
  if (field === 'name') inputId = 'employeeName'
  else if (field === 'surname') inputId = 'employeeSurname'
  else if (field === 'birthDate') inputId = 'birthDate'
  else if (field === 'position') inputId = 'position'
  else if (field === 'salary') inputId = 'employeeSalary'

  const input = document.getElementById(inputId)
  if (!validation.valid) {
    input.classList.add('error')
  } else {
    input.classList.remove('error')
  }

  updateEmployeeSubmitButton()
}

function resetEmployeeForm() {
  currentEmployeeFormData = {
    name: { valid: false, message: '' },
    surname: { valid: false, message: '' },
    birthDate: { valid: false, message: '' },
    position: { valid: false, message: '' },
    salary: { valid: false, message: '' },
  }
  const inputs = ['employeeName', 'employeeSurname', 'birthDate', 'position', 'employeeSalary']
  inputs.forEach((id) => {
    const input = document.getElementById(id)
    if (input) {
      input.value = ''
      input.classList.remove('error')
    }
  })

  const errors = ['name-error', 'surname-error', 'birthDate-error', 'position-error', 'salary-error']
  errors.forEach((id) => {
    const errorDiv = document.getElementById(id)
    if (errorDiv) errorDiv.textContent = ''
  })

  updateEmployeeSubmitButton()
}

function openEmployeeModal() {
  resetEmployeeForm()
  const modal = document.getElementById('employee-modal')
  if (modal) modal.classList.add('active')
}

function closeEmployeeModal() {
  const modal = document.getElementById('employee-modal')
  if (modal) modal.classList.remove('active')
  resetEmployeeForm()
}

function initEmployeeModal() {
  const addBtn = document.getElementById('add-employee-btn')
  const closeBtn = document.getElementById('close-employee-modal')
  const cancelBtn = document.getElementById('cancel-employee-btn')
  const modal = document.getElementById('employee-modal')
  const form = document.getElementById('employee-form')

  if (!addBtn || !closeBtn || !cancelBtn || !modal || !form) return

  addBtn.addEventListener('click', openEmployeeModal)
  closeBtn.addEventListener('click', closeEmployeeModal)
  cancelBtn.addEventListener('click', closeEmployeeModal)

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeEmployeeModal()
  })

  const nameInput = document.getElementById('employeeName')
  const surnameInput = document.getElementById('employeeSurname')
  const birthDateInput = document.getElementById('birthDate')
  const positionSelect = document.getElementById('position')
  const salaryInput = document.getElementById('employeeSalary')

  if (nameInput) {
    nameInput.addEventListener('input', (e) => validateEmployeeField('name', e.target.value))
    nameInput.addEventListener('blur', (e) => validateEmployeeField('name', e.target.value))
  }

  if (surnameInput) {
    surnameInput.addEventListener('input', (e) => validateEmployeeField('surname', e.target.value))
    surnameInput.addEventListener('blur', (e) => validateEmployeeField('surname', e.target.value))
  }

  if (birthDateInput) {
    birthDateInput.addEventListener('input', (e) => validateEmployeeField('birthDate', e.target.value))
    birthDateInput.addEventListener('blur', (e) => validateEmployeeField('birthDate', e.target.value))
  }

  if (positionSelect) {
    positionSelect.addEventListener('change', (e) => validateEmployeeField('position', e.target.value))
    positionSelect.addEventListener('blur', (e) => validateEmployeeField('position', e.target.value))
  }

  if (salaryInput) {
    salaryInput.addEventListener('input', (e) => validateEmployeeField('salary', e.target.value))
    salaryInput.addEventListener('blur', (e) => validateEmployeeField('salary', e.target.value))
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault()

    const name = document.getElementById('employeeName')?.value || ''
    const surname = document.getElementById('employeeSurname')?.value || ''
    const birthDate = document.getElementById('birthDate')?.value || ''
    const position = document.getElementById('position')?.value || ''
    const salary = document.getElementById('employeeSalary')?.value || ''

    const isNameValid = validateEmployeeName(name).valid
    const isSurnameValid = validateEmployeeSurname(surname).valid
    const isBirthDateValid = validateBirthDate(birthDate).valid
    const isPositionValid = validatePosition(position).valid
    const isSalaryValid = validateEmployeeSalary(salary).valid

    if (isNameValid && isSurnameValid && isBirthDateValid && isPositionValid && isSalaryValid) {
      addEmployee({
        name,
        surname,
        birthDate,
        position,
        salary,
      })
      closeEmployeeModal()
    }
  })
}
