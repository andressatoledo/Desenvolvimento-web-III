const ordemForm = document.getElementById("ordemForm");
const cancelEditBtn = document.getElementById("cancelEdit");
const submitBtn = ordemForm.querySelector("button[type='submit']");
document.getElementById("btnFiltrar").addEventListener("click", filtrarOrdens);
document.getElementById("btnLimpar").addEventListener("click", () => {
  document.getElementById("filtroTitulo").value = "";
  document.getElementById("filtroStatus").value = "";
  document.getElementById("filtroPrioridade").value = "";
  document.getElementById("filtroSetor").value = "";
  loadOrdens(); 
});

function filtrarOrdens() {
  const titulo = document.getElementById("filtroTitulo").value.toLowerCase();
  const status = document.getElementById("filtroStatus").value;
  const prioridade = document.getElementById("filtroPrioridade").value;
  const setor = document.getElementById("filtroSetor").value.toLowerCase();

  const linhas = document.querySelectorAll("#ordemList tbody tr");

  linhas.forEach(linha => {
    const celTitulo = linha.children[0].textContent.toLowerCase();
    const celStatus = linha.children[1].textContent;
    const celPrioridade = linha.children[2].textContent;
    const celSetor = linha.children[4].textContent.toLowerCase();

    const condTitulo = titulo === "" || celTitulo.includes(titulo);
    const condStatus = status === "" || celStatus === status;
    const condPrioridade = prioridade === "" || celPrioridade === prioridade;
    const condSetor = setor === "" || celSetor.includes(setor);

    if (condTitulo && condStatus && condPrioridade && condSetor) {
      linha.style.display = "";
    } else {
      linha.style.display = "none";
    }
  });
}


async function loadOrdens() {
  const tbody = document.querySelector("#ordemList tbody");
  tbody.innerHTML = "";

  try {
    const res = await fetch("http://localhost:3000/ordemServico");
    if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`);
    const ordens = await res.json();

    ordens.forEach((os) => {
      const prazo = os.prazoEstimado
        ? new Date(os.prazoEstimado).toLocaleDateString("pt-BR")
        : "—";

      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${os.titulo}</td>
        <td>${os.status}</td>
        <td>${os.prioridade}</td>
        <td>${os.responsavel || "—"}</td>
        <td>${os.setorSolicitante}</td>
        <td>${prazo}</td>
        <td>R$ ${os.valorServico.toFixed(2)}</td>
        <td>
          <button class="edit-btn"
            onclick="editOrdem('${os._id}',
              '${os.titulo}',
              '${os.descricao}',
              '${os.status}',
              '${os.prioridade}',
              '${os.responsavel || ""}',
              '${os.setorSolicitante}',
              '${os.prazoEstimado || ""}',
              ${os.valorServico}
            )">Alterar</button>

          <button class="delete-btn" onclick="deleteOrdem('${os._id}')">Excluir</button>
        </td>
      `;

      tbody.appendChild(tr);
    });

  } catch (err) {
    console.error("Erro ao carregar ordens:", err);
    tbody.innerHTML = "<tr><td colspan='8'>Erro ao carregar dados. Verifique o servidor.</td></tr>";
    alert("Erro ao carregar ordens: " + (err.message || err));
  }
}

ordemForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("ordemId").value;

  const item = {
    titulo: document.getElementById("titulo").value.trim(),
    descricao: document.getElementById("descricao").value.trim(),
    status: document.getElementById("status").value,
    prioridade: document.getElementById("prioridade").value,
    responsavel: document.getElementById("responsavel").value.trim(),
    setorSolicitante: document.getElementById("setorSolicitante").value.trim(),
    prazoEstimado: document.getElementById("prazoEstimado").value || null,
    valorServico: parseFloat(document.getElementById("valorServico").value)
  };

  submitBtn.disabled = true;

  try {
    if (id) {
      // Atualizar
      const res = await fetch(`http://localhost:3000/ordemServico/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`);
    } else {
      // Criar
      const res = await fetch("http://localhost:3000/ordemServico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`);
    }

    resetForm();
    await loadOrdens();

  } catch (err) {
    console.error("Erro ao salvar ordem:", err);
    alert("Erro ao salvar ordem: " + (err.message || err));
  } finally {
    submitBtn.disabled = false;
  }
});

async function deleteOrdem(id) {
  if (!confirm("Deseja excluir esta ordem de serviço?")) return;

  try {
    const res = await fetch(`http://localhost:3000/ordemServico/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`);
    await loadOrdens();
  } catch (err) {
    console.error("Erro ao excluir ordem:", err);
    alert("Erro ao excluir ordem: " + (err.message || err));
  }
}

function editOrdem(id, titulo, descricao, status, prioridade, responsavel, setor, prazo, valor) {
  document.getElementById("ordemId").value = id;
  document.getElementById("titulo").value = titulo;
  document.getElementById("descricao").value = descricao;
  document.getElementById("status").value = status;
  document.getElementById("prioridade").value = prioridade;
  document.getElementById("responsavel").value = responsavel;
  document.getElementById("setorSolicitante").value = setor;
  document.getElementById("prazoEstimado").value = prazo ? prazo.split("T")[0] : "";
  document.getElementById("valorServico").value = valor;

  submitBtn.textContent = "Salvar alterações";
  cancelEditBtn.style.display = "inline-block";
}

cancelEditBtn.addEventListener("click", resetForm);

function resetForm() {
  document.getElementById("ordemId").value = "";
  document.getElementById("titulo").value = "";
  document.getElementById("descricao").value = "";
  document.getElementById("status").value = "";
  document.getElementById("prioridade").value = "";
  document.getElementById("responsavel").value = "";
  document.getElementById("setorSolicitante").value = "";
  document.getElementById("prazoEstimado").value = "";
  document.getElementById("valorServico").value = "";

  submitBtn.textContent = "Cadastrar";
  cancelEditBtn.style.display = "none";
}

loadOrdens();
