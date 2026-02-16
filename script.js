// ===== FormandoSabores — Modal de Pedido (BLINDADO) =====

// ✅ coloque o número real quando tiver (somente dígitos com DDI 55)
// Exemplo: 5517999999999
const WHATSAPP_NUMBER = ""; // <- edite depois

// helpers
const qs = (sel, root = document) => root.querySelector(sel);
const qsa = (sel, root = document) => [...root.querySelectorAll(sel)];
const enc = (s) => encodeURIComponent(String(s ?? ""));

// Estado
let lastFocusEl = null;

// Cria modal (1x)
function ensureModal() {
  if (qs("#fsModal")) return;

  const modalHTML = `
  <div id="fsModal" class="fs-modal" aria-hidden="true">
    <div class="fs-backdrop" data-close="1"></div>

    <div class="fs-dialog" role="dialog" aria-modal="true" aria-labelledby="fsTitle">
      <div class="fs-dialog__head">
        <h3 id="fsTitle">Finalizar pedido</h3>
      </div>

      <form class="fs-dialog__body" id="fsForm">
        <label class="fs-field">
          <span>Item</span>
          <input id="fsItem" type="text" placeholder="Ex.: Combo 2 / Enroladinho / Refrigerante" />
        </label>

        <div class="fs-row">
          <label class="fs-field">
            <span>Quantidade</span>
            <input id="fsQtd" type="number" min="1" value="1" />
          </label>

          <label class="fs-field">
            <span>Entrega</span>
            <select id="fsEntrega">
              <option value="A combinar" selected>A combinar</option>
              <option value="Retirar">Retirar</option>
              <option value="Entregar">Entregar</option>
            </select>
          </label>
        </div>

        <label class="fs-field">
          <span>Observações</span>
          <textarea id="fsObs" rows="3" placeholder="Ex.: refri gelado, ponto de referência, etc."></textarea>
        </label>

        <div class="fs-actions">
          <button type="button" class="btn btn--ghost" id="fsCancel">Cancelar</button>
          <button type="button" class="btn" id="fsSend">Enviar no WhatsApp</button>
        </div>

        <p class="fs-hint muted tiny">
          *O WhatsApp ainda pode estar “em definição”. Quando tiverem o número, o botão abre direto.
        </p>
      </form>
    </div>
  </div>`;

  document.body.insertAdjacentHTML("beforeend", modalHTML);

  // Eventos de fechar
  const modal = qs("#fsModal");
  const cancelBtn = qs("#fsCancel");
  const backdrop = qs(".fs-backdrop", modal);

  cancelBtn.addEventListener("click", (e) => {
    e.preventDefault();
    closeModal();
  });

  backdrop.addEventListener("click", (e) => {
    e.preventDefault();
    closeModal();
  });

  // ESC fecha
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isModalOpen()) closeModal();
  });

  // Enviar
  qs("#fsSend").addEventListener("click", (e) => {
    e.preventDefault();
    sendWhatsApp();
  });
}

function isModalOpen() {
  const modal = qs("#fsModal");
  return modal && modal.getAttribute("aria-hidden") === "false";
}

function openModal({ item = "" } = {}) {
  ensureModal();

  lastFocusEl = document.activeElement;

  const modal = qs("#fsModal");
  modal.setAttribute("aria-hidden", "false");
  modal.classList.add("is-open");
  document.body.classList.add("fs-lock");

  // preencher
  qs("#fsItem").value = item || "";
  qs("#fsQtd").value = 1;
  qs("#fsEntrega").value = "A combinar";
  qs("#fsObs").value = "";

  // foco
  setTimeout(() => qs("#fsItem")?.focus(), 50);
}

function closeModal() {
  const modal = qs("#fsModal");
  if (!modal) return;

  modal.setAttribute("aria-hidden", "true");
  modal.classList.remove("is-open");
  document.body.classList.remove("fs-lock");

  // devolver foco
  try { lastFocusEl?.focus?.(); } catch {}
}

function sendWhatsApp() {
  if (!WHATSAPP_NUMBER) {
    alert("WhatsApp ainda não definido. Quando vocês tiverem o número, coloque em WHATSAPP_NUMBER no script.js.");
    return;
  }

  const item = qs("#fsItem").value.trim() || "Pedido";
  const qtd = qs("#fsQtd").value || "1";
  const entrega = qs("#fsEntrega").value || "A combinar";
  const obs = qs("#fsObs").value.trim();

  const text =
`Olá! Quero fazer um pedido no FormandoSabores 😊
Item: ${item}
Quantidade: ${qtd}
Entrega: ${entrega}${obs ? `\nObs.: ${obs}` : ""}`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${enc(text)}`;
  window.open(url, "_blank");

  // fecha depois de enviar
  closeModal();
}

// ===== Integração com botões do site =====
// Se você já chama openOrder('texto...') no HTML, mantemos compatível:
window.openOrder = function (text) {
  // transforma o texto em item “resumido”
  openModal({ item: String(text || "").replace(/\s+/g, " ").trim() });
};
