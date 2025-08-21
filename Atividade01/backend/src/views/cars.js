const carForm = document.getElementById("carForm");
const carList = document.getElementById("carsList");
const carIdField = document.getElementById("carId");
const cancelEditBtn = document.getElementById("cancelEdit");
const submitBtn = carForm.querySelector("button[type='submit']");


async function loadCar() {
  const res = await fetch('/cars/getCars');
  const cars = await res.json();
  
  carList.innerHTML = "";
  cars.forEach(car => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div>
        <strong>${car.modelo}</strong> - ${car.marca} (${car.ano})
      </div>
      <div class="actions">
        <button onclick="editCar(${car.id}, '${car.modelo}', '${car.marca}', ${car.ano})">✏️ Editar</button>
        <button onclick="deleteCar(${car.id})">🗑 Excluir</button>
      </div>
    `;
    carList.appendChild(li);
  });
}

carForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = carIdField.value;
  const modelo = document.getElementById("modelo").value;
  const marca = document.getElementById("marca").value;
  const ano = Number(document.getElementById("ano").value);

  if (!id) {
    // Criar
    await fetch('/cars/createCar', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ modelo, marca, ano })
    });
  } else {
    // Atualizar
    await fetch(`/cars/updateCar/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ modelo, marca, ano })
    });
  }

  resetForm();
  loadCar();
});

async function deleteCar(id) {
  await fetch(`/cars/deleteCar/${id}`, { method: "DELETE" });
  loadCar();
}


function editCar(id, modelo, marca, ano) {
  carIdField.value = id;
  document.getElementById("modelo").value = modelo;
  document.getElementById("marca").value = marca;
  document.getElementById("ano").value = ano;

  submitBtn.textContent = "Salvar Alterações";
  cancelEditBtn.style.display = "inline-block";
}

cancelEditBtn.addEventListener("click", resetForm);

function resetForm() {
  carIdField.value = "";
  carForm.reset();
  submitBtn.textContent = "Adicionar";
  cancelEditBtn.style.display = "none";
}

// Inicializa
loadCar();
