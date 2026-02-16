// ✅ Troque para o número real quando vocês definirem (somente dígitos com DDI 55)
// Exemplo: 5517999999999
const WHATSAPP_NUMBER = ""; // <- coloque aqui depois

const $ = (q) => document.querySelector(q);
const $$ = (q) => Array.from(document.querySelectorAll(q));

function openWhatsApp(message) {
  const msg = encodeURIComponent(message);

  if (!WHATSAPP_NUMBER) {
    alert("WhatsApp ainda não definido. Quando vocês tiverem o número, é só colocar em WHATSAPP_NUMBER no arquivo script.js.");
    return;
  }

  const url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + msg;
  window.open(url, "_blank");
}

/* ===== Mobile Menu ===== */
const mobileMenu = $("#mobileMenu");
const openMenuBtn = $("#openMenu");
const closeMenuBtn = $("#closeMenu");

function setMenu(open) {
  if (!mobileMenu) return;
  mobileMenu.hidden = !open;
  openMenuBtn?.setAttribute("aria-expanded", open ? "true" : "false");
}

openMenuBtn?.addEventListener("click", () => setMenu(true));
closeMenuBtn?.addEventListener("click", () => setMenu(false));
$$(".mobileLink").forEach(a => a.addEventListener("click", () => setMenu(false)));

/* ===== Modal Pedido ===== */
const modal = $("#orderModal");
const orderItem = $("#orderItem");
const orderQty = $("#orderQty");
const orderDelivery = $("#orderDelivery");
const orderObs = $("#orderObs");
const sendBtn = $("#sendWhatsApp");

let currentType = "geral";

function openModal({ item = "Pedido", type = "geral" } = {}) {
  currentType = type;
  orderItem.value = item;
  orderQty.value = 1;
  orderDelivery.value = "A combinar";
  orderObs.value = "";
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  orderQty.focus();
}

function closeModal() {
  modal.hidden = true;
  document.body.style.overflow = "";
}

$$("[data-open-order]").forEach(btn => {
  btn.addEventListener("click", () => {
    const item = btn.getAttribute("data-product") || "Pedido";
    const type = btn.getAttribute("data-type") || "geral";
    openModal({ item, type });
  });
});

$$("[data-close-modal]").forEach(el => el.addEventListener("click", closeModal));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal && !modal.hidden) closeModal();
});

sendBtn?.addEventListener("click", () => {
  const item = orderItem.value.trim();
  const qty = Math.max(1, Number(orderQty.value || 1));
  const delivery = orderDelivery.value;
  const obs = orderObs.value.trim();

  const base =
`Olá! 😊 Quero fazer um pedido no FormandoSabores.

• Item: ${item}
• Quantidade: ${qty}
• Entrega: ${delivery}${obs ? `\n• Obs.: ${obs}` : ""}

Pode me confirmar disponibilidade e valor?`;

  openWhatsApp(base);
});

/* ===== Floating WhatsApp ===== */
$("#waFloat")?.addEventListener("click", () => openModal({ item: "Pedido", type: "geral" }));
