const personSelect = document.getElementById("personId");
const carSelect = document.getElementById("carId");
const personCarForm = document.getElementById("personCarForm");
const personCarList = document.getElementById("personCarList");

// 🔹 Carregar opções de pessoas
async function loadPersons() {
  const res = await fetch(`/persons/getPersons`);
  const persons = await res.json();

  personSelect.innerHTML = '<option value="">Selecione uma pessoa</option>';
  persons.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p.id;
    opt.textContent = p.nome;
    personSelect.appendChild(opt);
  });
}

// 🔹 Carregar opções de carros
async function loadCars() {
  const res = await fetch(`/cars/getCars`);
  const cars = await res.json();

  carSelect.innerHTML = '<option value="">Selecione um carro</option>';
  cars.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.textContent = `${c.modelo} (${c.marca})`;
    carSelect.appendChild(opt);
  });
}

// 🔹 Carregar associações
async function loadPersonCars() {
  const res = await fetch(`/personCar/getListPersonCars`);
  const list = await res.json();

  personCarList.innerHTML = "";

  list.forEach(assoc => {
    const li = document.createElement("li");
    li.textContent = `${assoc.pessoa.nome} → ${assoc.carro.modelo} [${assoc.carro.marca}]`;

    const delBtn = document.createElement("button");
    delBtn.textContent = "x";
    delBtn.onclick = async () => {
      await fetch(`/personCar/deletePersonCar/${assoc.id}`, {
        method: "DELETE",
      });
      loadPersonCars(); // recarrega a lista
    };

    li.appendChild(delBtn);
    personCarList.appendChild(li);
  });
}

personCarForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const personId = personSelect.value;
  const carId = carSelect.value;

  if (!personId || !carId) {
    alert("Selecione uma pessoa e um carro!");
    return;
  }

  try {
    const res = await fetch(`/personCar/createPersonCar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ personId, carId }),
    });

    const data = await res.json();

    if (!res.ok) {
      // Mostra a mensagem de erro do backend (como unique constraint)
      alert(data.error || "Erro ao criar associação");
      return;
    }

    // Se sucesso, atualiza a lista
    personCarForm.reset();
    loadPersonCars();

  } catch (err) {
    alert("Erro de conexão com o servidor");
    console.error(err);
  }
});

// 🔹 Inicialização
loadPersons();
loadCars();
loadPersonCars();
