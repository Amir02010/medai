/* ============================================================
   Справочник лекарств.

   ВНИМАНИЕ: это демонстрационные данные. Названия настоящие,
   но цены и наличие — примерные, для показа работы интерфейса.
   Перед запуском замените на выгрузку из аптечной системы:
   структура полей уже боевая, UI менять не придётся.

   rx: true  — рецептурный препарат. Такие не показываются
               как «можно заказать» и помечаются отдельно.
   price     — ориентир в сумах за упаковку.
   ============================================================ */

export const MED_CATEGORIES = [
  { id: "pain", ru: "Боль и температура", uz: "Og'riq va harorat", en: "Pain & fever", icon: "🤒" },
  { id: "cold", ru: "Простуда и горло", uz: "Shamollash va tomoq", en: "Cold & throat", icon: "🤧" },
  { id: "stomach", ru: "Желудок", uz: "Oshqozon", en: "Stomach", icon: "🫄" },
  { id: "allergy", ru: "Аллергия", uz: "Allergiya", en: "Allergy", icon: "🌿" },
  { id: "heart", ru: "Сердце и давление", uz: "Yurak va bosim", en: "Heart & pressure", icon: "❤️" },
  { id: "diabetes", ru: "Диабет", uz: "Diabet", en: "Diabetes", icon: "💉" },
  { id: "antibiotic", ru: "Антибиотики", uz: "Antibiotiklar", en: "Antibiotics", icon: "🦠" },
  { id: "vitamin", ru: "Витамины", uz: "Vitaminlar", en: "Vitamins", icon: "🍊" },
  { id: "first-aid", ru: "Первая помощь", uz: "Birinchi yordam", en: "First aid", icon: "🩹" },
];

export const MEDICINES = [
  /* ---------- боль и температура ---------- */
  {
    id: "paracetamol-500",
    name: "Парацетамол",
    nameUz: "Paratsetamol",
    inn: "Paracetamol",
    form: { ru: "таблетки", uz: "tabletkalar", en: "tablets" },
    dose: "500 мг · 20 шт",
    category: "pain",
    rx: false,
    price: [4000, 9000],
    note: {
      ru: "Жаропонижающее и обезболивающее. Не превышайте дозу на упаковке.",
      uz: "Harorat tushiruvchi va og'riq qoldiruvchi. Qadoqdagi dozadan oshirmang.",
      en: "Reduces fever and pain. Do not exceed the dose on the package.",
    },
  },
  {
    id: "ibuprofen-400",
    name: "Ибупрофен",
    nameUz: "Ibuprofen",
    inn: "Ibuprofen",
    form: { ru: "таблетки", uz: "tabletkalar", en: "tablets" },
    dose: "400 мг · 20 шт",
    category: "pain",
    rx: false,
    price: [9000, 18000],
    note: {
      ru: "Обезболивающее и противовоспалительное. Принимать после еды.",
      uz: "Og'riq qoldiruvchi va yallig'lanishga qarshi. Ovqatdan keyin.",
      en: "Pain relief and anti-inflammatory. Take after food.",
    },
  },
  {
    id: "nurofen",
    name: "Нурофен",
    nameUz: "Nurofen",
    inn: "Ibuprofen",
    form: { ru: "таблетки", uz: "tabletkalar", en: "tablets" },
    dose: "200 мг · 12 шт",
    category: "pain",
    rx: false,
    price: [22000, 34000],
  },
  {
    id: "analgin",
    name: "Анальгин",
    nameUz: "Analgin",
    inn: "Metamizole sodium",
    form: { ru: "таблетки", uz: "tabletkalar", en: "tablets" },
    dose: "500 мг · 10 шт",
    category: "pain",
    rx: false,
    price: [3000, 7000],
  },

  /* ---------- простуда и горло ---------- */
  {
    id: "teraflu",
    name: "ТераФлю",
    nameUz: "TeraFlyu",
    inn: "Paracetamol + pheniramine",
    form: { ru: "порошок", uz: "kukun", en: "powder" },
    dose: "10 пакетиков",
    category: "cold",
    rx: false,
    price: [45000, 72000],
  },
  {
    id: "septefril",
    name: "Септефрил",
    nameUz: "Septefril",
    inn: "Decamethoxine",
    form: { ru: "таблетки для рассасывания", uz: "so'riladigan tabletkalar", en: "lozenges" },
    dose: "0,2 мг · 20 шт",
    category: "cold",
    rx: false,
    price: [6000, 13000],
  },
  {
    id: "ambroxol",
    name: "Амброксол",
    nameUz: "Ambroksol",
    inn: "Ambroxol",
    form: { ru: "сироп", uz: "sirop", en: "syrup" },
    dose: "100 мл",
    category: "cold",
    rx: false,
    price: [15000, 27000],
  },

  /* ---------- желудок ---------- */
  {
    id: "omeprazole-20",
    name: "Омепразол",
    nameUz: "Omeprazol",
    inn: "Omeprazole",
    form: { ru: "капсулы", uz: "kapsulalar", en: "capsules" },
    dose: "20 мг · 30 шт",
    category: "stomach",
    rx: false,
    price: [14000, 28000],
    note: {
      ru: "Снижает кислотность. При длительном приёме нужна консультация врача.",
      uz: "Kislotalilikni kamaytiradi. Uzoq qabulda shifokor maslahati kerak.",
      en: "Reduces stomach acid. Long-term use needs medical advice.",
    },
  },
  {
    id: "smecta",
    name: "Смекта",
    nameUz: "Smekta",
    inn: "Diosmectite",
    form: { ru: "порошок", uz: "kukun", en: "powder" },
    dose: "3 г · 10 пакетиков",
    category: "stomach",
    rx: false,
    price: [28000, 45000],
  },
  {
    id: "mezim",
    name: "Мезим форте",
    nameUz: "Mezim forte",
    inn: "Pancreatin",
    form: { ru: "таблетки", uz: "tabletkalar", en: "tablets" },
    dose: "10 000 ЕД · 20 шт",
    category: "stomach",
    rx: false,
    price: [26000, 42000],
  },
  {
    id: "rehydron",
    name: "Регидрон",
    nameUz: "Regidron",
    inn: "Oral rehydration salts",
    form: { ru: "порошок", uz: "kukun", en: "powder" },
    dose: "18,9 г · 20 пакетиков",
    category: "stomach",
    rx: false,
    price: [30000, 52000],
    note: {
      ru: "Восполняет потерю жидкости при рвоте и диарее. Особенно важен для детей.",
      uz: "Qusish va ich ketishda suyuqlik yo'qotishini to'ldiradi. Bolalar uchun ayniqsa muhim.",
      en: "Replaces fluids lost to vomiting and diarrhoea. Especially important for children.",
    },
  },

  /* ---------- аллергия ---------- */
  {
    id: "cetirizine",
    name: "Цетиризин",
    nameUz: "Setirizin",
    inn: "Cetirizine",
    form: { ru: "таблетки", uz: "tabletkalar", en: "tablets" },
    dose: "10 мг · 10 шт",
    category: "allergy",
    rx: false,
    price: [8000, 16000],
  },
  {
    id: "loratadine",
    name: "Лоратадин",
    nameUz: "Loratadin",
    inn: "Loratadine",
    form: { ru: "таблетки", uz: "tabletkalar", en: "tablets" },
    dose: "10 мг · 10 шт",
    category: "allergy",
    rx: false,
    price: [7000, 14000],
  },
  {
    id: "suprastin",
    name: "Супрастин",
    nameUz: "Suprastin",
    inn: "Chloropyramine",
    form: { ru: "таблетки", uz: "tabletkalar", en: "tablets" },
    dose: "25 мг · 20 шт",
    category: "allergy",
    rx: false,
    price: [18000, 30000],
  },

  /* ---------- сердце и давление ---------- */
  {
    id: "enalapril",
    name: "Эналаприл",
    nameUz: "Enalapril",
    inn: "Enalapril",
    form: { ru: "таблетки", uz: "tabletkalar", en: "tablets" },
    dose: "10 мг · 20 шт",
    category: "heart",
    rx: true,
    price: [9000, 19000],
    note: {
      ru: "Снижает давление. Дозу подбирает только врач, самостоятельно не меняйте.",
      uz: "Bosimni tushiradi. Dozani faqat shifokor belgilaydi, o'zingiz o'zgartirmang.",
      en: "Lowers blood pressure. Only a doctor sets the dose — never change it yourself.",
    },
  },
  {
    id: "amlodipine",
    name: "Амлодипин",
    nameUz: "Amlodipin",
    inn: "Amlodipine",
    form: { ru: "таблетки", uz: "tabletkalar", en: "tablets" },
    dose: "5 мг · 30 шт",
    category: "heart",
    rx: true,
    price: [12000, 25000],
  },
  {
    id: "aspirin-cardio",
    name: "Аспирин Кардио",
    nameUz: "Aspirin Kardio",
    inn: "Acetylsalicylic acid",
    form: { ru: "таблетки", uz: "tabletkalar", en: "tablets" },
    dose: "100 мг · 30 шт",
    category: "heart",
    rx: false,
    price: [24000, 40000],
  },
  {
    id: "nitroglycerin",
    name: "Нитроглицерин",
    nameUz: "Nitrogliserin",
    inn: "Glyceryl trinitrate",
    form: { ru: "таблетки под язык", uz: "til ostiga tabletkalar", en: "sublingual tablets" },
    dose: "0,5 мг · 40 шт",
    category: "heart",
    rx: true,
    price: [8000, 16000],
  },

  /* ---------- диабет ---------- */
  {
    id: "metformin",
    name: "Метформин",
    nameUz: "Metformin",
    inn: "Metformin",
    form: { ru: "таблетки", uz: "tabletkalar", en: "tablets" },
    dose: "850 мг · 30 шт",
    category: "diabetes",
    rx: true,
    price: [16000, 32000],
  },
  {
    id: "glucometer-strips",
    name: "Тест-полоски для глюкометра",
    nameUz: "Glyukometr uchun test-chiziqlar",
    inn: "—",
    form: { ru: "полоски", uz: "chiziqlar", en: "strips" },
    dose: "50 шт",
    category: "diabetes",
    rx: false,
    price: [90000, 180000],
  },

  /* ---------- антибиотики ---------- */
  {
    id: "amoxicillin",
    name: "Амоксициллин",
    nameUz: "Amoksitsillin",
    inn: "Amoxicillin",
    form: { ru: "капсулы", uz: "kapsulalar", en: "capsules" },
    dose: "500 мг · 20 шт",
    category: "antibiotic",
    rx: true,
    price: [18000, 34000],
    note: {
      ru: "Только по назначению врача. Курс допивают до конца, даже если стало легче.",
      uz: "Faqat shifokor tayinlovi bilan. Kursni oxirigacha iching, yaxshi bo'lsangiz ham.",
      en: "Prescription only. Finish the full course even if you feel better.",
    },
  },
  {
    id: "azithromycin",
    name: "Азитромицин",
    nameUz: "Azitromitsin",
    inn: "Azithromycin",
    form: { ru: "таблетки", uz: "tabletkalar", en: "tablets" },
    dose: "500 мг · 3 шт",
    category: "antibiotic",
    rx: true,
    price: [26000, 48000],
  },

  /* ---------- витамины ---------- */
  {
    id: "vitamin-d3",
    name: "Витамин D3",
    nameUz: "D3 vitamini",
    inn: "Cholecalciferol",
    form: { ru: "капли", uz: "tomchilar", en: "drops" },
    dose: "10 мл",
    category: "vitamin",
    rx: false,
    price: [35000, 68000],
  },
  {
    id: "vitamin-c",
    name: "Витамин C",
    nameUz: "C vitamini",
    inn: "Ascorbic acid",
    form: { ru: "таблетки", uz: "tabletkalar", en: "tablets" },
    dose: "500 мг · 30 шт",
    category: "vitamin",
    rx: false,
    price: [12000, 26000],
  },
  {
    id: "folic-acid",
    name: "Фолиевая кислота",
    nameUz: "Foliy kislotasi",
    inn: "Folic acid",
    form: { ru: "таблетки", uz: "tabletkalar", en: "tablets" },
    dose: "1 мг · 50 шт",
    category: "vitamin",
    rx: false,
    price: [6000, 14000],
  },

  /* ---------- первая помощь ---------- */
  {
    id: "chlorhexidine",
    name: "Хлоргексидин",
    nameUz: "Xlorgeksidin",
    inn: "Chlorhexidine",
    form: { ru: "раствор", uz: "eritma", en: "solution" },
    dose: "0,05% · 100 мл",
    category: "first-aid",
    rx: false,
    price: [4000, 9000],
  },
  {
    id: "bandage",
    name: "Бинт стерильный",
    nameUz: "Steril bint",
    inn: "—",
    form: { ru: "бинт", uz: "bint", en: "bandage" },
    dose: "5 м × 10 см",
    category: "first-aid",
    rx: false,
    price: [3000, 7000],
  },
  {
    id: "activated-charcoal",
    name: "Уголь активированный",
    nameUz: "Faollashtirilgan ko'mir",
    inn: "Activated charcoal",
    form: { ru: "таблетки", uz: "tabletkalar", en: "tablets" },
    dose: "250 мг · 20 шт",
    category: "first-aid",
    rx: false,
    price: [2000, 6000],
  },
];

export const medById = (id) => MEDICINES.find((m) => m.id === id) || null;

/** Название препарата на языке интерфейса */
export function medName(med, lang) {
  if (!med) return "";
  return lang === "uz" && med.nameUz ? med.nameUz : med.name;
}

/** Ориентировочная цена строкой */
export function priceRange(med, lang) {
  if (!med?.price) return "—";
  const [a, b] = med.price;
  const fmt = (n) => n.toLocaleString("ru-RU");
  const unit = lang === "uz" ? "so'm" : lang === "en" ? "UZS" : "сум";
  return a === b ? `${fmt(a)} ${unit}` : `${fmt(a)}–${fmt(b)} ${unit}`;
}
