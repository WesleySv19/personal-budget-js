// Função que basicamente ira fazer o registro dos dados inseridos pelo usuário.
const year = document.getElementById('year')
const month = document.getElementById('mes')
const day = document.getElementById('dia')
const type = document.getElementById('tipo')
const description = document.getElementById('descricao')
const val = document.getElementById('valor')


class Register {
    constructor(year, month, day, type, description, val) {
        this.year = year
        this.month = month
        this.day = day
        this.type = type
        this.description = description
        this.val = val
    }

    validate() {
        for (let i in this) {
            if (this[i] === null || this[i] === undefined || this[i] === '') {
                return false
            }
        }

        return true
    }
}

const clean = () => {
    year.value = ''
    month.value = ''
    day.value = ''
    type.value = ''
    description.value = ''
    val.value = ''
}

class Bd {

    constructor() {

        const id = localStorage.getItem('id')

        if (id === null) {
            localStorage.setItem('id', 0)
        }
    }

    getNextId() {
        const nextId = localStorage.getItem('id')
        return (parseInt(nextId) + 1)
    }

    ToRecorder(rec) {
        let id = this.getNextId()
        localStorage.setItem(id, JSON.stringify(rec))
        localStorage.setItem('id', id)
    }

    retrieveAllRecords() {

        const expenses = []
        // Recuperar todas as despesas cadastradas em localStorage
        const id = localStorage.getItem('id')
        for (let i = 1; i <= id; i++) {
            const expense = JSON.parse(localStorage.getItem(i))
            if (expense === null) {
                continue
            }
            expense.id = i
            expenses.push(expense)
        } return expenses
    }

    search(expense) {
        let filteredExpenses = []
        filteredExpenses = this.retrieveAllRecords()

        if (expense.year != '') {
            filteredExpenses = (filteredExpenses.filter(d => d.year == expense.year))
        }

        if (expense.month != '') {
            filteredExpenses = (filteredExpenses.filter(d => d.month == expense.month))
        }

        if (expense.day != '') {
            filteredExpenses = (filteredExpenses.filter(d => d.day == expense.day))
        }

        if (expense.type != '') {
            filteredExpenses = (filteredExpenses.filter(d => d.type == expense.type))
        }

        if (expense.description != '') {
            filteredExpenses = (filteredExpenses.filter(d => d.description == expense.description))
        }

        if (expense.val != '') {
            filteredExpenses = (filteredExpenses.filter(d => d.val == expense.val))
        }
        
        return filteredExpenses
    }

    remove(id) {
        localStorage.removeItem(id)
    }
}

const bd = new Bd()
const expenseRecord = document.getElementById('register')


expenseRecord.addEventListener('click', () => {

    const register = new Register(year.value, month.value, day.value, type.value, description.value, val.value)

    const titleModal = document.getElementById('titleModal')
    const descriptionModal = document.getElementById('descriptionModal')
    const closeBtn = document.getElementById('close')
    document.getElementById('notice').addEventListener('click', () => {
        window.location.href = 'consulta.html'
    })
    
    if (register.validate()) {
        bd.ToRecorder(register)
        $('#modalExpenseRecord').modal('show')
        titleModal.innerHTML = 'Registro inserido com sucesso!'
        titleModal.className = 'text-success'
        descriptionModal.innerHTML = 'Despesa cadastrada com sucesso!'
        closeBtn.className = 'btn-success'
        closeBtn.innerHTML = 'Voltar'
        clean()

        setTimeout(() => {
            document.getElementById('notice').style.display = 'flex'
        }, 2000)

     
    } else {
        $('#modalExpenseRecord').modal('show')
        titleModal.innerHTML = 'Erro!'
        titleModal.className = 'text-danger'
        descriptionModal.innerHTML = 'Alguns campos não foram preenchidos!'
        closeBtn.className = 'btn-danger'
        closeBtn.innerHTML = 'Voltar e corrigir'

    }
})

function loadExpenseList(expenses = [], filt = false) {
    if (expenses.length === 0 && filt == false) {
        expenses = bd.retrieveAllRecords()
    }
    // /selecionando o tbody no index.html
    let expenseList = document.getElementById('expenseList')
    expenseList.innerHTML = ''
    // clean()
    expenses.forEach(function (expen) {
        const row = expenseList.insertRow()
        row.insertCell(0).innerHTML = `${expen.day}/${expen.month}/${expen.year}`

        switch (expen.type) {
            case '1': expen.type = '(Alimentação)'
                break
            case '2': expen.type = '(Educação)'
                break
            case '3': expen.type = '(Lazer)'
                break
            case '4': expen.type = '(Saúde)'
                break
            case '5': expen.type = '(Transporte)'
        }
        row.insertCell(1).innerHTML = expen.type
        row.insertCell(2).innerHTML = expen.description
        row.insertCell(3).innerHTML = expen.val

        // Criar botão
        let btn = document.createElement('button')
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-times"</i>'
        btn.id = `id_expense_${expen.id}`
        btn.onclick = function () {
            $('#modalConfirm').modal('show')

            const btnConfirm = document.getElementById('deleteRecord')

            if (btnConfirm) {
                const id = this.id.replace('id_expense_', '')
                document.getElementById('descriptionModal').innerHTML = `Você tem certeza que deseja excluir ${expen.type}/${expen.description} ?`
                btnConfirm.onclick = () => {
                    bd.remove(id)
                    window.location.reload()

                }
            }


        }
        row.insertCell(4).append(btn)


    })
}

const searchExpense = () => {
    const expense = new Register(year.value, month.value, day.value, type.value, description.value, val.value)
    let expenses = bd.search(expense)
    let expenseList = document.getElementById('expenseList')
    expenseList.innerHTML = ''
    loadExpenseList(expenses, true)

}       