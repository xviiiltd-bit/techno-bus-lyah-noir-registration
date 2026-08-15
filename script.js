const eventConfig = window.EVENT_CONFIG || {};
const GOOGLE_SCRIPT_URL = eventConfig.googleScriptUrl || "";
const VISITOR_COUNTER_URL =
  "https://counterapi.com/api/techno-bus-20260828/lyah-noir-page-views";

const form = document.querySelector("#registration-form");
const paymentForm = document.querySelector("#payment-form");
const paymentModal = document.querySelector("#payment-modal");
const statusEl = document.querySelector("#form-status");
const submitButton = form.querySelector("button[type='submit']");
const paymentSubmitButton = paymentForm.querySelector("button[type='submit']");
const closeModalButton = document.querySelector(".modal-close");
const backButton = document.querySelector(".secondary-button");
const last5Input = paymentForm.querySelector("input[name='transferLast5']");
const languageButtons = document.querySelectorAll(".language-switch__button");
const registrationClosedMessage = document.querySelector("[data-registration-closed]");
const heroCta = document.querySelector(".hero__cta");
const visitorCount = document.querySelector("#visitor-count");
const heroMedia = document.querySelector(".hero__media");
const heroImage = heroMedia?.querySelector("img");
const heroVideo = heroMedia?.querySelector("video");
let pendingPayload = null;
let currentLanguage = localStorage.getItem("preferredLanguage") || "zh";
let registrationCloseTimer = null;
let heroTransitionTimer = null;

function switchHeroToVideo() {
  if (!heroMedia || !heroVideo) return;

  heroMedia.classList.add("is-switching");
  heroVideo.currentTime = 0;
  const playPromise = heroVideo.play();

  if (playPromise) {
    playPromise.catch(() => {
      heroVideo.controls = true;
    });
  }

  window.setTimeout(() => heroMedia.classList.add("is-video"), 180);
  window.setTimeout(() => heroMedia.classList.remove("is-switching"), 620);
}

function scheduleHeroVideo() {
  if (heroTransitionTimer) return;
  heroTransitionTimer = window.setTimeout(switchHeroToVideo, 4000);
}

function finishHeroImageLoading() {
  heroMedia?.classList.remove("is-loading");
  heroMedia?.classList.add("is-loaded");
  scheduleHeroVideo();
}

if (heroImage?.complete && heroImage.naturalWidth > 0) {
  finishHeroImageLoading();
} else {
  heroImage?.addEventListener("load", finishHeroImageLoading, { once: true });
  heroImage?.addEventListener("error", finishHeroImageLoading, { once: true });
}

const translations = {
  zh: {
    cta: "立即報名",
    formTitle: "活動報名資訊",
    nameLabel: "姓名",
    phoneLabel: "電話",
    emailLabel: "Email",
    birthdayLabel: "生日",
    instagramLabel: "Instagram 帳號",
    visitorLabel: "網頁來客數",
    agreementLabel: "我已閱讀並同意 NOTICE 免責聲明與注意事項。",
    paymentButton: "付款",
    paymentNote: "填寫報名資料後點擊付款，系統會顯示銀行轉帳資訊，並請留下匯款帳號後 5 碼。",
    noticeTitle: "免責聲明與注意事項",
    notice1: "請勿破壞場地，請勿攜帶違禁品（尖銳品, 槍, 瓦斯罐, 毒品）。",
    notice2: "報到時請報登記的名字，因個人因素不克參加者恕不退票。",
    notice3: "未滿 18 歲、孕婦，或身心不適者請勿飲酒。酒後不開車，安全有保障。",
    notice4: "主辦單位保留活動變更及終止之權利，如有其他未盡事宜，依主辦單位相關規定或解釋為最後依據。",
    notice5: "本活動將進行影像錄製；完成報名並入場即表示知悉現場影像可能用於活動紀錄及宣傳。",
    closePayment: "關閉付款視窗",
    bankTitle: "銀行轉帳資訊",
    amountLabel: "金額",
    bankLabel: "銀行",
    modalPaymentNote: "請先匯款並填寫以下資料 Please make the payment first then fill in the following information.",
    last5Label: "下方留下匯款帳號後 5 碼",
    last5Help: "Please enter the last 5 digits of your transfer account number below.",
    last5Placeholder: "請輸入 5 位數字",
    backButton: "返回修改",
    confirmPayment: "確認付款並送出",
    sheetSkipped: "尚未設定 Google Apps Script URL，資料目前只在頁面端完成送出流程。",
    needFormFirst: "請先填寫報名資料。",
    submitting: "報名資料送出中...",
    success: "報名已送出。主辦方將依匯款帳號後 5 碼對帳確認名額，付款完成後提供集合地標。",
    submitError: "報名資料暫時無法送到 Google Sheet。請確認網路狀態後再試，或聯絡主辦方。",
    registrationClosedTitle: "報名已截止",
    registrationClosedMessage: "本活動報名已於 2026/07/17 20:00 截止，頁面資訊仍保留供查看。",
    registrationClosedStatus: "本活動報名已截止，頁面資訊仍保留供查看。",
  },
  en: {
    cta: "Register Now",
    formTitle: "Registration Info",
    nameLabel: "Name",
    phoneLabel: "Phone",
    emailLabel: "Email",
    birthdayLabel: "Birthday",
    instagramLabel: "Instagram Account",
    visitorLabel: "PAGE VISITS",
    agreementLabel: "I have read and agree to the NOTICE disclaimer and event notes.",
    paymentButton: "Payment",
    paymentNote: "Complete the form and select Payment to view the bank transfer details, then enter the last 5 digits of your transfer account.",
    noticeTitle: "Disclaimer & Notes",
    notice1: "Please do not damage the venue. Prohibited items are not allowed, including sharp objects, firearms, gas canisters, and drugs.",
    notice2: "Please check in using the name you registered with. Tickets are non-refundable if you are unable to attend due to personal reasons.",
    notice3: "Alcohol restrictions: Guests under 18, pregnant individuals, or anyone feeling unwell should not consume alcohol. Do not drink and drive. Safety first.",
    notice4: "The organizer reserves the right to modify or cancel the event. Any matters not covered above will be handled according to the organizer's final decision and relevant regulations.",
    notice5: "This event will be filmed. By registering and entering the event, you acknowledge that on-site footage may be used for event documentation and promotion.",
    closePayment: "Close payment window",
    bankTitle: "Bank Transfer Info",
    amountLabel: "Amount",
    bankLabel: "Bank",
    modalPaymentNote: "Please make the payment first, then fill in the following information.",
    last5Label: "Enter the last 5 digits of your transfer account",
    last5Help: "Please enter the last 5 digits of your transfer account number below.",
    last5Placeholder: "Enter 5 digits",
    backButton: "Back to Edit",
    confirmPayment: "Confirm Payment & Submit",
    sheetSkipped: "Google Apps Script URL is not configured yet. The submission flow is completed on the page only.",
    needFormFirst: "Please complete the registration form first.",
    submitting: "Submitting registration details...",
    success: "Registration submitted. The organizer will verify payment using the last 5 digits of your transfer account and provide the meeting pin after payment is completed.",
    submitError: "Unable to send registration details to Google Sheet right now. Please check your connection and try again, or contact the organizer.",
    registrationClosedTitle: "Registration Closed",
    registrationClosedMessage: "Registration closed at 20:00 on 2026/07/17. Event information remains available on this page.",
    registrationClosedStatus: "Registration is closed. Event information remains available on this page.",
  },
};

function getConfigValue(path) {
  return path.split(".").reduce((value, key) => {
    if (value && Object.prototype.hasOwnProperty.call(value, key)) {
      return value[key];
    }
    return undefined;
  }, eventConfig);
}

function localize(value) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value[currentLanguage] || value.zh || value.en || "";
  }
  return value ?? "";
}

async function updateVisitorCount() {
  if (!visitorCount) return;

  const sessionKey = "techno-bus-20260828-visitor-counted";
  const shouldIncrement = sessionStorage.getItem(sessionKey) !== "1";
  const url = `${VISITOR_COUNTER_URL}${shouldIncrement ? "?increment=1" : ""}`;

  try {
    const response = await fetch(url, { mode: "cors", cache: "no-store" });
    if (!response.ok) throw new Error(`Counter request failed: ${response.status}`);

    const data = await response.json();
    const value = Number(data.value);
    if (!Number.isFinite(value)) throw new Error("Counter response is invalid");

    visitorCount.textContent = new Intl.NumberFormat(
      currentLanguage === "zh" ? "zh-TW" : "en-US",
    ).format(value);

    if (shouldIncrement) sessionStorage.setItem(sessionKey, "1");
  } catch (error) {
    visitorCount.textContent = "—";
  }
}

function translate(key) {
  return translations[currentLanguage][key] || translations.zh[key] || key;
}

function applyTheme() {
  const theme = eventConfig.theme || {};
  const root = document.documentElement;
  const variables = {
    bg: "--bg",
    panel: "--panel",
    panelStrong: "--panel-strong",
    text: "--text",
    muted: "--muted",
    accent: "--acid",
    accentSoft: "--acid-soft",
    line: "--line",
    danger: "--danger",
    buttonText: "--button-text",
  };

  Object.entries(variables).forEach(([key, cssVariable]) => {
    if (theme[key]) {
      root.style.setProperty(cssVariable, theme[key]);
    }
  });
}

function setText(element, value) {
  element.textContent = String(localize(value));
}

function applyConfigText() {
  document.querySelectorAll("[data-config-text]").forEach((element) => {
    setText(element, getConfigValue(element.dataset.configText));
  });

  document.querySelectorAll("[data-config-text-attr]").forEach((element) => {
    element.dataset.configTextAttr.split(",").forEach((entry) => {
      const [attribute, path] = entry.split(":").map((value) => value.trim());
      const value = getConfigValue(path);
      if (attribute && value !== undefined) {
        element.setAttribute(attribute, String(localize(value)));
      }
    });
  });

  document.querySelectorAll("[data-config-src]").forEach((element) => {
    const value = getConfigValue(element.dataset.configSrc);
    if (value) {
      element.setAttribute("src", value);
    }
  });

  document.querySelectorAll("[data-config-href]").forEach((element) => {
    const value = getConfigValue(element.dataset.configHref);
    if (value) {
      element.setAttribute("href", value);
    }
  });
}

function createLink(link, className) {
  const anchor = document.createElement("a");
  anchor.href = link.url;
  anchor.target = "_blank";
  anchor.rel = "noreferrer";
  anchor.textContent = link.label;
  if (className) {
    anchor.className = className;
  }
  return anchor;
}

function renderFollowLinks() {
  const panel = document.querySelector("[data-config-list='followLinks']");
  if (!panel) return;

  panel.replaceChildren();
  (eventConfig.followLinks || []).forEach((group) => {
    const row = document.createElement("div");
    const label = document.createElement("span");
    label.textContent = group.group;
    row.append(label);

    (group.links || []).forEach((link) => {
      row.append(createLink(link));
    });

    panel.append(row);
  });
}

function renderLineup() {
  const list = document.querySelector("[data-config-list='lineup']");
  if (!list) return;

  list.replaceChildren();
  (eventConfig.lineup || []).forEach((artist) => {
    const item = document.createElement("li");
    const time = document.createElement("time");
    const name = document.createElement("span");

    time.textContent = artist.time || "";
    name.textContent = artist.name || "";
    item.append(time, name);

    if (artist.instagram) {
      const instagramLink = createLink(
        {
          label: "IG",
          url: artist.instagram,
        },
        "social-icon",
      );
      instagramLink.setAttribute("aria-label", `${artist.name} Instagram`);
      item.append(instagramLink);
    }

    list.append(item);
  });
}

function renderPartners() {
  const logoList = document.querySelector("[data-config-list='partners']");
  if (!logoList) return;

  logoList.replaceChildren();
  (eventConfig.partners || []).forEach((partner) => {
    const name = String(localize(partner.name));

    if (partner.logo) {
      const image = document.createElement("img");
      image.src = partner.logo;
      image.alt = name;
      logoList.append(image);
      return;
    }

    if (partner.pending) {
      const placeholder = document.createElement("div");
      placeholder.className = "partner-placeholder";
      placeholder.textContent = name;
      logoList.append(placeholder);
    }
  });
}

function updatePageMeta() {
  if (eventConfig.event?.pageTitle) {
    document.title = eventConfig.event.pageTitle;
  }

  const description = document.querySelector("meta[name='description']");
  if (description && eventConfig.event?.description) {
    description.setAttribute("content", eventConfig.event.description);
  }
}

function renderEventConfig() {
  applyTheme();
  updatePageMeta();
  applyConfigText();
  renderFollowLinks();
  renderLineup();
  renderPartners();
}

function getRegistrationCloseDate() {
  const closesAt = eventConfig.event?.registration?.closesAt;
  if (!closesAt) return null;

  const closeDate = new Date(closesAt);
  return Number.isNaN(closeDate.getTime()) ? null : closeDate;
}

function isRegistrationClosed() {
  const closeDate = getRegistrationCloseDate();
  return closeDate ? Date.now() >= closeDate.getTime() : false;
}

function setRegistrationControlsDisabled(disabled) {
  form.querySelectorAll("input, button").forEach((control) => {
    control.disabled = disabled;
  });
}

function applyRegistrationState() {
  const closed = isRegistrationClosed();
  document.body.classList.toggle("is-registration-closed", closed);
  setRegistrationControlsDisabled(closed);

  if (heroCta) {
    heroCta.hidden = closed;
  }

  form.hidden = closed;

  if (registrationClosedMessage) {
    registrationClosedMessage.hidden = !closed;
  }

  if (closed) {
    pendingPayload = null;
    last5Input.value = "";
    if (paymentModal.open) {
      paymentModal.close();
    }
    setStatusKey("registrationClosedStatus", true);
  }
}

function scheduleRegistrationClose() {
  if (registrationCloseTimer) {
    clearTimeout(registrationCloseTimer);
  }

  const closeDate = getRegistrationCloseDate();
  if (!closeDate) return;

  const delay = closeDate.getTime() - Date.now();
  if (delay <= 0) {
    applyRegistrationState();
    return;
  }

  registrationCloseTimer = setTimeout(applyRegistrationState, Math.min(delay, 2147483647));
}

function applyLanguage(language) {
  currentLanguage = translations[language] ? language : "zh";
  localStorage.setItem("preferredLanguage", currentLanguage);
  document.documentElement.lang = currentLanguage === "zh" ? "zh-Hant" : "en";

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = translate(element.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-attr]").forEach((element) => {
    element.dataset.i18nAttr.split(",").forEach((entry) => {
      const [attribute, key] = entry.split(":").map((value) => value.trim());
      if (attribute && key) {
        element.setAttribute(attribute, translate(key));
      }
    });
  });

  languageButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.lang === currentLanguage);
  });

  renderEventConfig();
  applyRegistrationState();
}

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.classList.toggle("is-error", isError);
}

function setStatusKey(key, isError = false) {
  setStatus(translate(key), isError);
}

function normalizeInstagram(value) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
}

function isFreeEvent() {
  const amount = String(eventConfig.event?.price?.amount || "").trim();
  const display = String(localize(eventConfig.event?.price?.display)).trim().toUpperCase();
  return amount === "0" || display === "FREE";
}

async function submitToGoogleSheet(payload) {
  if (!GOOGLE_SCRIPT_URL) {
    return {
      skipped: true,
      messageKey: "sheetSkipped",
    };
  }

  const response = await fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify(payload),
  });

  return { skipped: false, response };
}

function getEventMeta() {
  const formDataset = form?.dataset || {};

  return {
    eventId: eventConfig.event?.eventId || formDataset.eventId || "",
    taskId: eventConfig.event?.taskId || formDataset.taskId || "registration",
    sourcePage: eventConfig.event?.sourcePage || formDataset.sourcePage || window.location.pathname || "",
    eventName: eventConfig.event?.nameForSheet || document.title,
    price: eventConfig.event?.price?.amount || "",
    currency: eventConfig.event?.price?.currency || "TWD",
  };
}

async function submitRegistrationPayload(payload) {
  submitButton.disabled = true;
  paymentSubmitButton.disabled = true;
  setStatusKey("submitting");

  try {
    const result = await submitToGoogleSheet(payload);
    form.reset();
    pendingPayload = null;

    if (paymentModal.open) {
      closePaymentModal();
    }

    if (result.skipped) {
      setStatusKey(result.messageKey, true);
      return;
    }

    setStatusKey("success");
  } catch (error) {
    setStatusKey("submitError", true);
  } finally {
    submitButton.disabled = false;
    paymentSubmitButton.disabled = false;
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (isRegistrationClosed()) {
    applyRegistrationState();
    return;
  }

  const formData = new FormData(form);
  pendingPayload = {
    ...getEventMeta(),
    name: String(formData.get("name") || "").trim(),
    phone: String(formData.get("phone") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    birthday: String(formData.get("birthday") || "").trim(),
    instagram: normalizeInstagram(String(formData.get("instagram") || "")),
    submittedAt: new Date().toISOString(),
    paymentStatus: isFreeEvent() ? "FREE" : "待填後五碼",
  };

  setStatus("");
  if (isFreeEvent()) {
    await submitRegistrationPayload({
      ...pendingPayload,
      transferLast5: "",
      submittedAt: new Date().toISOString(),
      paymentStatus: "FREE",
    });
    return;
  }

  paymentModal.showModal();
  last5Input.focus();
});

function closePaymentModal() {
  paymentModal.close();
  last5Input.value = "";
}

closeModalButton.addEventListener("click", closePaymentModal);
backButton.addEventListener("click", closePaymentModal);

paymentForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (isRegistrationClosed()) {
    applyRegistrationState();
    return;
  }

  if (!pendingPayload) {
    setStatusKey("needFormFirst", true);
    closePaymentModal();
    return;
  }

  if (!last5Input.validity.valid) {
    last5Input.reportValidity();
    return;
  }

  const payload = {
    ...pendingPayload,
    transferLast5: last5Input.value.trim(),
    submittedAt: new Date().toISOString(),
    paymentStatus: last5Input.value.trim(),
  };

  await submitRegistrationPayload(payload);
});

languageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyLanguage(button.dataset.lang);
    setStatus("");
  });
});

applyLanguage(currentLanguage);
updateVisitorCount();
scheduleRegistrationClose();
