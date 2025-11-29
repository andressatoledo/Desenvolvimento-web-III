const eventoForm = document.getElementById("eventoForm");
const cancelEditBtn = document.getElementById("cancelEdit");
const submitBtn = eventoForm.querySelector("button[type='submit']");
const totalDisplay = document.getElementById("total");

async function loadEventos() {
  const tbody = document.querySelector("#eventoList tbody");
  tbody.innerHTML = "";

  try {
    const res = await fetch("http://localhost:3000/events");
    if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`);
    const events = await res.json();

    events.forEach((event) => {
      const formattedDate = new Date(event.Data).toLocaleDateString("pt-BR");

      const tr = document.createElement("tr");
      
      tr.innerHTML = `
      <td>
        <div class="conteudo">
          ${event.Titulo} - ${event.Descricao} - ${event.Local} - R$ ${event.Valor.toFixed(2)} - ${formattedDate}
        </div>
        <div class="alinhamento">
          <button class="edit-btn" onclick="editEvento('${event._id}', '${event.Titulo}','${event.Descricao}','${event.Local}', ${event.Valor}, '${event.Data}')">Alterar</button>
          <button class="delete-btn" onclick="deleteEvento('${event._id}')">Excluir</button>
        </div>
      </td>
    `;
      tbody.appendChild(tr);
    });

  } catch (err) {
    console.error("Erro ao carregar eventos:", err);
    tbody.innerHTML = "<tr><td colspan='4'>Erro ao carregar eventos. Verifique o servidor.</td></tr>";
    alert("Erro ao carregar eventos: " + (err.message || err));
  }
}

eventoForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.getElementById("eventoId").value;
  let Titulo = document.getElementById("Titulo").value.trim();
  let Descricao = document.getElementById("Descricao").value.trim();
  let Local = document.getElementById("Local").value.trim();
  let Valor = parseFloat(document.getElementById("Valor").value);
  let Data = document.getElementById("Data").value;

  
  const item = { Titulo, Descricao, Local, Valor, Data };
  console.log(item);
  submitBtn.disabled = true;
  try {
    if (id) {
      const res = await fetch(`http://localhost:3000/events/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`);
    } else {
      const res = await fetch("http://localhost:3000/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`);
    }

    resetForm();
    await loadEventos();
  } catch (err) {
    console.error("Erro ao salvar evento:", err);
    alert("Erro ao salvar evento: " + (err.message || err));
  } finally {
    submitBtn.disabled = false;
  }
});

async function deleteEvento(id) {
  if (!confirm("Deseja excluir este evento?")) return;

  try {
    const res = await fetch(`http://localhost:3000/events/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`);
    await loadEventos();
  } catch (err) {
    console.error("Erro ao excluir evento:", err);
    alert("Erro ao excluir evento: " + (err.message || err));
  }
}

function editEvento(id, Titulo, Descricao, Local, Valor, Data) {
  document.getElementById("eventoId").value = id;
  document.getElementById("Titulo").value = Titulo;
  document.getElementById("Descricao").value = Descricao;
  document.getElementById("Local").value = Local;
  document.getElementById("Valor").value = Valor;
  document.getElementById("Data").value = Data.split("T")[0];

  submitBtn.textContent = "Salvar alterações";
  cancelEditBtn.style.display = "inline-block";
}

cancelEditBtn.addEventListener("click", resetForm);

function resetForm() {
  
  document.getElementById("eventoId").value = "";
  document.getElementById("Titulo").value = "";
  document.getElementById("Descricao").value = "";
  document.getElementById("Local").value = "";
  document.getElementById("Valor").value = 0;
  document.getElementById("Data").value = new Date().toISOString().split("T")[0];
  submitBtn.textContent = "Cadastrar";
  cancelEditBtn.style.display = "none";
}


loadEventos();
