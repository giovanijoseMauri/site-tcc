// ===== FormandoSabores — script.js (ULTRA BLINDADO / COMPATÍVEL COM SEU HTML) =====

// ✅ Coloque o número real quando tiver (somente dígitos com DDI 55)
// Exemplo: 5517999999999
const WHATSAPP_NUMBER = ""; // <- edite depois

// ---------- helpers ----------
const qs = (sel, root = document) => root.querySelector(sel);
const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const clean = (v) => String(v ?? "").replace(/\s+/g, " ").trim();
const enc = (s) => encodeURIComponent(String(s ?? ""));

// ---------- MENU MOBILE ----------
(function initMobileMenu() {
  const openBtn = qs("#openMenu");
  const closeBtn = qs("#closeMenu");
  const menu = qs("#mobileMenu");

  if (!openBtn || !menu) return;

  const setExpanded = (val) => {
    try { openBtn.setAttribute("aria-expanded", val ? "true" : "false"); } catch {}
  };

  const openMenu = () => {
    menu.hidden = false;
    setExpanded(true);
    // foca no primeiro link do menu
    setTimeout(() => {
      const firstLink = qs("a, button", menu);
      firstLink?.focus?.();
    }, 0);
  };

  const closeMenu = () => {
    menu.hidden = true;
    setExpanded(false);
    openBtn?.focus?.();
  };

  openBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (menu.hidden) openMenu();
    else closeMenu();
  });

  closeBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    closeMenu();
  });

  // fechar menu ao clicar em um link
  qsa("a", menu).forEach((a) => {
    a.addEventListener("click", () => closeMenu());
  });

  // ESC fecha menu
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu && menu.hidden === false) closeMenu();
  });
})();

// ---------- MODAL PEDIDO (usa #orderModal do HTML) ----------
(function initOrderModal() {
  const modal = qs("#orderModal");
  if (!modal) return; // se não existir, não quebra nada

  const itemEl = qs("#orderItem", modal);
  const qtyEl = qs("#orderQty", modal);
  const deliveryEl = qs("#orderDelivery", modal);
  const obsEl = qs("#orderObs", modal);
  const sendBtn = qs("#sendWhatsApp", modal);

  const closeTargets = () => qsa("[data-close-modal]", modal);

  let lastFocusEl = null;

  const isOpen = () => modal.hidden === false;

  const open = (opts = {}) => {
    const item = clean(opts.item || opts.product || "Pedido");

    lastFocusEl = document.activeElement;

    modal.hidden = false;
    modal.classList.add("is-open");
    document.body.classList.add("fs-lock"); // se tiver CSS pra travar scroll

    if (itemEl) itemEl.value = item;
    if (qtyEl) qtyEl.value = 1;
    if (deliveryEl) deliveryEl.value = "A combinar";
    if (obsEl) obsEl.value = "";

    setTimeout(() => itemEl?.focus?.(), 0);
  };

  const close = () => {
    modal.hidden = true;
    modal.classList.remove("is-open");
    document.body.classList.remove("fs-lock");

    try { lastFocusEl?.focus?.(); } catch {}
  };

  const buildMessage = () => {
    const item = clean(itemEl?.value) || "Pedido";
    const qtd = clean(qtyEl?.value) || "1";
    const entrega = clean(deliveryEl?.value) || "A combinar";
    const obs = clean(obsEl?.value);

    return `Olá! Quero fazer um pedido no FormandoSabores 😊
Item: ${item}
Quantidade: ${qtd}
Entrega: ${entrega}${obs ? `\nObs.: ${obs}` : ""}`;
  };

  const sendWhatsApp = () => {
    if (!WHATSAPP_NUMBER) {
      alert("WhatsApp ainda não definido. Quando vocês tiverem o número, coloque em WHATSAPP_NUMBER no script.js.");
      return;
    }

    const text = buildMessage();
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${enc(text)}`;
    window.open(url, "_blank");
    close();
  };

  // fechar: overlay, botão X, cancelar etc.
  closeTargets().forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      close();
    });
  });

  // ESC fecha modal
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen()) close();
  });

  // Enviar
  sendBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    sendWhatsApp();
  });

  // ---------- BOTÕES DO SITE ----------
  // Qualquer elemento com data-open-order abre o modal
  const bindOrderButtons = () => {
    const btns = qsa("[data-open-order]");
    btns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();

        const product = clean(btn.getAttribute("data-product") || btn.dataset.product || "");
        const type = clean(btn.getAttribute("data-type") || btn.dataset.type || "");
        const item = type ? `${product} (${type})` : product;

        open({ item: item || "Pedido" });
      });
    });
  };

  bindOrderButtons();

  // Botão flutuante do WhatsApp abre o modal também
  const waFloat = qs("#waFloat");
  waFloat?.addEventListener("click", (e) => {
    e.preventDefault();
    open({ item: "Pedido" });
  });

  // Compatibilidade: se alguém chamar openOrder('texto') no HTML
  window.openOrder = function (text) {
    open({ item: clean(text) || "Pedido" });
  };

  // Expor close se quiser usar manualmente
  window.closeOrderModal = close;
})();
