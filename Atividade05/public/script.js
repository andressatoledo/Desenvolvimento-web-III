const discosForm = document.getElementById("discosForm");
const discosList = document.getElementById("discosList");
const cancelEditBtn = document.getElementById("cancelEdit");
const submitBtn = discosForm.querySelector("button[type='submit']");

async function loaddiscos() {
  const res = await fetch('http://localhost:3000/discos');
  const discos = await res.json();
  const tbody = document.querySelector("#discosList tbody");
  tbody.innerHTML = ""; // Limpa tabela

  discos.forEach(disco => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${disco.titulo}</td>
      <td>${disco.artista}</td>
      <td>${disco.ano}</td>
      <td>${disco.genero}</td>
      <td>${disco.formato}</td>
      <td>R$ ${disco.preco}</td>
      <td>
        <button onclick="editdisco('${disco._id}', '${disco.titulo}', '${disco.artista}','${disco.ano}','${disco.genero}','${disco.formato}','${disco.preco}')">✏️ Editar</button>
        <button onclick="deletedisco('${disco._id}')">🗑 Excluir</button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}


discosForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("discosId").value;
  const Item = {
    titulo: document.getElementById("titulo").value,
    artista: document.getElementById("artista").value,
    ano: document.getElementById("ano").value,
    genero: document.getElementById("genero").value,
    formato: document.getElementById("formato").value,
    preco: document.getElementById("preco").value
  };


  if (id) {

    await fetch(`http://localhost:3000/discos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Item)
    });

  } else {
    await fetch('http://localhost:3000/discos', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Item)
    });
  }
  discosForm.reset();
  loaddiscos();
});


async function deletedisco(id) {
  if (confirm("Deseja excluir esse disco?")) {
    await fetch(`http://localhost:3000/discos/${id}`, { method: "DELETE" });
    loaddiscos();
  }

}


function editdisco(id, titulo, artista, ano, genero, formato, preco) {
  document.getElementById("discosId").value = id;
  document.getElementById("titulo").value = titulo;
  document.getElementById("artista").value = artista;
  document.getElementById("ano").value = ano;
  document.getElementById("genero").value = genero;
  document.getElementById("formato").value = formato;
  document.getElementById("preco").value = preco;


  submitBtn.textContent = "Salvar alterações";
  cancelEditBtn.style.display = "inline-block";
}

cancelEditBtn.addEventListener("click", resetForm);

function resetForm() {
  document.getElementById("discosId").value = "";
  discosForm.reset();
  submitBtn.textContent = "Adicionar";
  cancelEditBtn.style.display = "none";
}


loaddiscos();