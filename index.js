const form = document.querySelector('.add')
const transactionSection = document.querySelector('.transaction-history')
const incomeList = document.querySelector('ul.income-list')
const expenseList = document.querySelector('ul.expense-list')

const balance = document.getElementById("balance")
const income = document.getElementById("income")
const expense = document.getElementById("expense")

const emptyMessages = document.querySelector(".empty")

let transactions = localStorage.getItem("transactions") !== null ? JSON.parse(localStorage.getItem("transactions")) : []

function updateStatistics() {
    const updatedIncome = transactions
        .filter(transaction => transaction.amount > 0)
        .reduce((total, transaction) =>
            total += transaction.amount, 0);

    const updatedExpense = transactions
        .filter(transaction => transaction.amount < 0)
        .reduce((total, transaction) =>
            total += Math.abs(transaction.amount), 0);

    income.textContent = updatedIncome
    expense.textContent = updatedExpense
    balance.textContent = (updatedIncome - updatedExpense) < 0 ? 0 : updatedIncome - updatedExpense
}

updateStatistics()
updateEmptyMessage()

function fetchTransactions() {
    Array.from(transactions).forEach(data => {
        addTransactionDOM(data.id, data.source, data.amount, data.time)
    })
}

function updateEmptyMessage() {
    if (Array.from(transactions).length === 0) {
        transactionSection.querySelector('h3').textContent = 'Belum ada transaksi'
        transactionSection.querySelector('div').classList.add('hide')
        emptyMessages.style.display = 'block'

    } else {
        transactionSection.querySelector('h3').textContent = 'Catatan Transaksi'
        transactionSection.querySelector('div').classList.remove('hide')
        emptyMessages.style.display = 'none'
    }
}

fetchTransactions()

function addTransactionDOM(id, source, amount, time) {
    if (amount > 0) {
        incomeList.innerHTML += `<li data-id="${id}">
                                    <p>
                                        <span>${source}</span>
                                        <span id="time">${time}</span>
                                    </p>
                                    <span>$${amount}</span>
                                    <i class="bi bi-trash delete"></i>
                                </li>`
    } else {
        expenseList.innerHTML += `<li data-id="${id}">
                                    <p>
                                        <span>${source}</span>
                                        <span id="time">${time}</span>
                                    </p>
                                    <span>$${Math.abs(amount)}</span>
                                    <i class="bi bi-trash delete"></i>
                                </li>`
    }
}

function addTransaction(source, amount) {
    const time = new Date()
    const transaction = {
        id: Math.floor(Math.random() * 100000),
        source: source,
        amount: Number(amount),
        time: `${time.toLocaleTimeString()} ${time.toLocaleDateString()}`
    }
    transactions.push(transaction)
    localStorage.setItem("transactions", JSON.stringify(transactions))
    addTransactionDOM(transaction.id, source, amount, transaction.time)
}

form.addEventListener("submit", event => {
    event.preventDefault()
    if (form.source.value.trim() == "" || form.amount.value.trim() == "") {
        alert("Mohon isi semua field yang tersedia!")
        form.reset()
    } else {
        addTransaction(form.source.value.trim(), form.amount.value)
        form.reset()
        updateStatistics()
        updateEmptyMessage()
    }
})

incomeList.addEventListener('click', event => {
    if (event.target.classList.contains('delete')) {
        event.target.parentElement.remove()
        deleteTransaction(Number(event.target.parentElement.dataset.id))
        updateStatistics()
        updateEmptyMessage()
    }
})
expenseList.addEventListener('click', event => {
    if (event.target.classList.contains('delete')) {
        event.target.parentElement.remove()
        deleteTransaction(Number(event.target.parentElement.dataset.id))
        updateStatistics()
        updateEmptyMessage()
    }
})

function deleteTransaction(id) {
    transactions = transactions.filter(transaction => {
        return transaction.id !== id
    })
    localStorage.setItem("transactions", JSON.stringify(transactions))
    updateEmptyMessage()
}
