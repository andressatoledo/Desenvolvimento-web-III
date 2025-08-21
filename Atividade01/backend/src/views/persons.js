const personForm = document.getElementById("personForm");
const personList = document.getElementById("personsList");
const personIdField = document.getElementById("personId");
const cancelEditBtn = document.getElementById("cancelEdit");
const submitBtn = personForm.querySelector("button[type='submit']");

async function loadPerson() {
  const res = await fetch('/persons/getPersons');
  const persons = await res.json();
  
  personList.innerHTML = "";
  persons.forEach(person => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div>
        <strong>${person.nome}</strong> - ${person.email}
      </div>
      <div class="actions">
        <button onclick="editPerson(${person.id}, '${person.nome}', '${person.email}')">✏️ Editar</button>
        <button onclick="deletePerson(${person.id})">🗑 Excluir</button>
      </div>
    `;
    personList.appendChild(li);
  });
}

personForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = personIdField.value;
  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;

  if (!id) {
    // Criar
    await fetch('/persons/createPerson', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email })
    });
  } else {
    // Atualizar
    await fetch(`/persons/updatePerson/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email })
    });
  }

  resetForm();
  loadPerson();
});

async function deletePerson(id) {
  await fetch(`/persons/deletePerson/${id}`, { method: "DELETE" });
  loadPerson();
}


function editPerson(id, nome, email) {
  personIdField.value = id;
  document.getElementById("nome").value = nome;
  document.getElementById("email").value = email;

  submitBtn.textContent = "Salvar Alterações";
  cancelEditBtn.style.display = "inline-block";
}


cancelEditBtn.addEventListener("click", resetForm);


function resetForm() {
  personIdField.value = "";
  personForm.reset();
  submitBtn.textContent = "Adicionar";
  cancelEditBtn.style.display = "none";
}

// Inicializa
loadPerson();
