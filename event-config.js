window.EVENT_CONFIG = {
  // Add the newly deployed protected Apps Script URL after its GET response
  // lists techno-bus-20260828:registration in the task whitelist.
  googleScriptUrl: "",
  theme: {
    bg: "#02060a",
    panel: "rgba(2, 12, 20, 0.92)",
    panelStrong: "rgba(1, 8, 14, 0.98)",
    text: "#eaf9ff",
    muted: "#6fc9ee",
    accent: "#00c8ff",
    accentSoft: "rgba(0, 200, 255, 0.16)",
    line: "rgba(0, 200, 255, 0.46)",
    danger: "#ff5b78",
    buttonText: "#00131c",
  },
  event: {
    title: {
      zh: "TARGET: LYAH NOIR",
      en: "TARGET: LYAH NOIR",
    },
    eyebrow: "TECHNO BUS ｜VG , JOJI",
    nameForSheet: "2026/08/28 TARGET: TECHNO BUS — LYAH NOIR",
    eventId: "techno-bus-20260828",
    taskId: "registration",
    sourcePage: "publish/techno-bus-20260828/index.html",
    pageTitle: "TARGET: LYAH NOIR | TECHNO BUS",
    description: "2026/08/28 Techno Bus with Lyah Noir 錄影表演活動報名頁",
    poster: {
      src: "assets/techno-bus-lyah-noir-20260828-v2.png",
      alt: {
        zh: "TARGET: LYAH NOIR 活動主視覺",
        en: "TARGET: LYAH NOIR event poster",
      },
    },
    lead: {
      zh: "這是一場錄影形式的表演活動，參加僅限報名制。",
      en: "This is a filmed performance event. Attendance is by registration only.",
    },
    date: { label: "DATE", display: "08.28.2026 FRI" },
    time: { label: "TIME", display: "22:00-02:00" },
    price: {
      label: "PRICE",
      amount: "400",
      currency: "TWD",
      display: { zh: "$400", en: "TWD 400" },
    },
    location: {
      label: "LOCATION",
      title: { zh: "台北大客車停車場", en: "Taipei Bus Parking Lot" },
      note: {
        zh: "（付款完成會給地標）",
        en: "(The map pin will be provided after payment is completed.)",
      },
    },
    contact: {
      label: { zh: "CONTACT 聯繫方式:", en: "CONTACT:" },
      text: "techno.bus.tw",
      url: "https://www.instagram.com/techno.bus.tw/",
    },
    registration: { closesAt: null },
  },
  followLinks: [
    {
      group: "IG",
      links: [
        { label: "techno.bus.tw", url: "https://www.instagram.com/techno.bus.tw/" },
        { label: "Event Post", url: "https://www.instagram.com/p/DW4UHbODfhs/?img_index=1" },
      ],
    },
  ],
  lineup: [
    { time: "22:00-23:00", name: "VG", instagram: "https://www.instagram.com/vg_virgillin/" },
    { time: "23:00-01:00", name: "LYAH NOIR", instagram: "https://www.instagram.com/lyahnoir/" },
    { time: "01:00-02:00", name: "JOJI", instagram: "https://www.instagram.com/j0ji_chan/" },
  ],
  partners: [
    { name: "Techno Bus TW", logo: "assets/techno-bus-logo.png" },
  ],
  bank: {
    name: "中國信託商業銀行 / CTBC BANK",
    code: "822",
    account: "108540394356",
  },
};
