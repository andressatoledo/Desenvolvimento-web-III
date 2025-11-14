const expenseForm = document.getElementById("expenseForm");
const cancelEditBtn = document.getElementById("cancelEdit");
const submitBtn = expenseForm.querySelector("button[type='submit']");
const totalDisplay = document.getElementById("total");

async function loadExpenses() {
  const tbody = document.querySelector("#expenseList tbody");
  tbody.innerHTML = "";

  try {
    const res = await fetch("http://localhost:3000/expenses");
    if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`);
    const expenses = await res.json();

    let total = 0;

    expenses.forEach((expense) => {
      total += expense.amount;
      const formattedDate = new Date(expense.date).toLocaleDateString("pt-BR");

      const tr = document.createElement("tr");
      
      tr.innerHTML = `
      <td>
        <div class="conteudo">
          ${expense.description} - R$ ${expense.amount.toFixed(2)} - ${formattedDate}
        </div>
        <div class="alinhamento">
          <button class="edit-btn" onclick="editExpense('${expense._id}', '${expense.description}', ${expense.amount}, '${expense.date}')">Alterar</button>
          <button class="delete-btn" onclick="deleteExpense('${expense._id}')">Excluir</button>
        </div>
      </td>
    `;
      tbody.appendChild(tr);
    });

    totalDisplay.textContent = `Total das Despesas: R$ ${total.toFixed(2)}`;
  } catch (err) {
    console.error("Erro ao carregar despesas:", err);
    tbody.innerHTML = "<tr><td colspan='4'>Erro ao carregar despesas. Verifique o servidor.</td></tr>";
    totalDisplay.textContent = `Total das Despesas: R$ 0,00`;
    alert("Erro ao carregar despesas: " + (err.message || err));
  }
}

expenseForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.getElementById("expenseId").value;
  let description = document.getElementById("description").value.trim();
  let amount = parseFloat(document.getElementById("amount").value);
  let date = document.getElementById("date").value;

  if (!description)
     description = "Sorvete";

  if (isNaN(amount) || amount <= 0) 
    amount = 240;

  if (!date) 
    date = new Date().toISOString().split("T")[0];

  const item = { description, amount, date };
  console.log(item);
  submitBtn.disabled = true;
  try {
    if (id) {
      const res = await fetch(`http://localhost:3000/expenses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`);
    } else {
      const res = await fetch("http://localhost:3000/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`);
    }

    resetForm();
    await loadExpenses();
  } catch (err) {
    console.error("Erro ao salvar despesa:", err);
    alert("Erro ao salvar despesa: " + (err.message || err));
  } finally {
    submitBtn.disabled = false;
  }
});

async function deleteExpense(id) {
  if (!confirm("Deseja excluir esta despesa?")) return;

  try {
    const res = await fetch(`http://localhost:3000/expenses/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`);
    await loadExpenses();
  } catch (err) {
    console.error("Erro ao excluir despesa:", err);
    alert("Erro ao excluir despesa: " + (err.message || err));
  }
}

function editExpense(id, description, amount, date) {
  document.getElementById("expenseId").value = id;
  document.getElementById("description").value = description;
  document.getElementById("amount").value = amount;
  document.getElementById("date").value = date.split("T")[0];

  submitBtn.textContent = "Salvar alterações";
  cancelEditBtn.style.display = "inline-block";
}

cancelEditBtn.addEventListener("click", resetForm);

function resetForm() {
  document.getElementById("expenseId").value = "";
  
  expenseForm.reset();
  document.getElementById("description").value = "Sorvete";
  document.getElementById("amount").value = 240;
  document.getElementById("date").value = new Date().toISOString().split("T")[0];

  submitBtn.textContent = "Cadastrar despesa";
  cancelEditBtn.style.display = "none";
}

loadExpenses();
