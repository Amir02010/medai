/* ============================================================
   Аптеки и больницы.

   ДЕМО-ДАННЫЕ. Названия и адреса правдоподобные, координаты
   настоящие, цены и наличие — примерные. Перед запуском
   замените на выгрузку из аптечной системы: структура полей
   боевая, интерфейс менять не придётся.

   stock: { идентификатор лекарства: цена в сумах }
   ============================================================ */

export const PHARMACIES = [
  /* ---------------- Самарканд ---------------- */
  {
    id: "ph1", region: "samarkand",
    name: "Dorixona Shifo",
    address: { ru: "ул. Амира Темура, 14, Самарканд", uz: "Amir Temur ko'chasi, 14, Samarqand", en: "14 Amir Temur St, Samarkand" },
    phone: "+998662331100", lat: 39.6543, lng: 66.9597,
    open24: true, rating: 4.8,
    stock: { "paracetamol-500": 6000, "ibuprofen-400": 12000, "amoxicillin": 24000,
             "cetirizine": 11000, "omeprazole-20": 19000, "enalapril": 13000,
             "metformin": 22000, "aspirin-cardio": 31000, "rehydron": 38000,
             "chlorhexidine": 6000, "activated-charcoal": 3500 },
  },
  {
    id: "ph2", region: "samarkand",
    name: "Oxymed Pharm",
    address: { ru: "пр-т Мустакиллик, 5, Самарканд", uz: "Mustaqillik shoh ko'chasi, 5, Samarqand", en: "5 Mustaqillik Ave, Samarkand" },
    phone: "+998662335577", lat: 39.6612, lng: 66.9751,
    open24: false, hours: [8, 22], rating: 4.6,
    stock: { "paracetamol-500": 5500, "nurofen": 27000, "loratadine": 10000,
             "vitamin-d3": 49000, "teraflu": 58000, "ambroxol": 21000,
             "mezim": 33000, "vitamin-c": 17000, "bandage": 4500 },
  },
  {
    id: "ph3", region: "samarkand",
    name: "Apteka 24 Registon",
    address: { ru: "ул. Регистан, 2, Самарканд", uz: "Registon ko'chasi, 2, Samarqand", en: "2 Registan St, Samarkand" },
    phone: "+998662340099", lat: 39.6547, lng: 66.9749,
    open24: true, rating: 4.9,
    stock: { "ibuprofen-400": 13500, "amoxicillin": 26000, "azithromycin": 35000,
             "aspirin-cardio": 29000, "omeprazole-20": 21000, "nitroglycerin": 11000,
             "glucometer-strips": 125000, "metformin": 24000, "smecta": 36000,
             "analgin": 4500, "rehydron": 41000 },
  },
  {
    id: "ph4", region: "samarkand",
    name: "Salomat Dorixona",
    address: { ru: "ул. Гагарина, 78, Самарканд", uz: "Gagarin ko'chasi, 78, Samarqand", en: "78 Gagarin St, Samarkand" },
    phone: "+998662311234", lat: 39.6704, lng: 66.9412,
    open24: false, hours: [9, 21], rating: 4.4,
    stock: { "paracetamol-500": 7000, "cetirizine": 12500, "vitamin-c": 19000,
             "suprastin": 24000, "folic-acid": 9000, "septefril": 9500,
             "chlorhexidine": 5500, "activated-charcoal": 4000 },
  },
  {
    id: "ph5", region: "samarkand",
    name: "Farmed Plus",
    address: { ru: "ул. Бустонсарой, 33, Самарканд", uz: "Bo'stonsaroy ko'chasi, 33, Samarqand", en: "33 Bustonsaroy St, Samarkand" },
    phone: "+998662366001", lat: 39.6461, lng: 66.9882,
    open24: false, hours: [8, 20], rating: 4.2,
    stock: { "ibuprofen-400": 15000, "loratadine": 11500, "omeprazole-20": 23000,
             "vitamin-d3": 55000, "amlodipine": 19000, "mezim": 35000 },
  },
  {
    id: "ph6", region: "samarkand",
    name: "Dori-Darmon Siyob",
    address: { ru: "ул. Ташкентская, 51, Самарканд", uz: "Toshkent ko'chasi, 51, Samarqand", en: "51 Tashkent St, Samarkand" },
    phone: "+998662318844", lat: 39.6672, lng: 66.9838,
    open24: false, hours: [8, 21], rating: 4.5,
    stock: { "paracetamol-500": 5000, "analgin": 3500, "enalapril": 11000,
             "amlodipine": 17000, "metformin": 20000, "glucometer-strips": 110000,
             "nitroglycerin": 9500, "aspirin-cardio": 27000 },
  },

  /* ---------------- Ташкент ---------------- */
  {
    id: "ph7", region: "tashkent-city",
    name: "Oxymed Chilonzor",
    address: { ru: "ул. Бунёдкор, 12, Ташкент", uz: "Bunyodkor ko'chasi, 12, Toshkent", en: "12 Bunyodkor St, Tashkent" },
    phone: "+998712001122", lat: 41.2755, lng: 69.2039,
    open24: true, rating: 4.7,
    stock: { "paracetamol-500": 5500, "ibuprofen-400": 11000, "nurofen": 24000,
             "amoxicillin": 22000, "azithromycin": 31000, "metformin": 19000,
             "glucometer-strips": 98000, "vitamin-d3": 44000, "smecta": 32000,
             "rehydron": 35000, "teraflu": 52000 },
  },
  {
    id: "ph8", region: "tashkent-city",
    name: "Apteka №1 Yunusobod",
    address: { ru: "ул. Амира Темура, 108, Ташкент", uz: "Amir Temur ko'chasi, 108, Toshkent", en: "108 Amir Temur St, Tashkent" },
    phone: "+998712334455", lat: 41.3400, lng: 69.2850,
    open24: true, rating: 4.6,
    stock: { "enalapril": 10000, "amlodipine": 16000, "aspirin-cardio": 26000,
             "nitroglycerin": 9000, "omeprazole-20": 17000, "cetirizine": 9500,
             "suprastin": 21000, "mezim": 30000, "vitamin-c": 15000 },
  },
  {
    id: "ph9", region: "tashkent-city",
    name: "Dori-Darmon Mirobod",
    address: { ru: "ул. Шота Руставели, 44, Ташкент", uz: "Shota Rustaveli ko'chasi, 44, Toshkent", en: "44 Shota Rustaveli St, Tashkent" },
    phone: "+998712556677", lat: 41.2820, lng: 69.2650,
    open24: false, hours: [8, 22], rating: 4.5,
    stock: { "paracetamol-500": 4500, "analgin": 3000, "ambroxol": 18000,
             "septefril": 7500, "folic-acid": 7000, "chlorhexidine": 4500,
             "bandage": 3500, "activated-charcoal": 2500, "loratadine": 8500 },
  },

  /* ---------------- Бухара ---------------- */
  {
    id: "ph10", region: "bukhara",
    name: "Buxoro Farm",
    address: { ru: "ул. Мустакиллик, 21, Бухара", uz: "Mustaqillik ko'chasi, 21, Buxoro", en: "21 Mustaqillik St, Bukhara" },
    phone: "+998652244556", lat: 39.7681, lng: 64.4556,
    open24: false, hours: [8, 21], rating: 4.4,
    stock: { "paracetamol-500": 6500, "ibuprofen-400": 14000, "cetirizine": 12000,
             "omeprazole-20": 22000, "amoxicillin": 27000, "vitamin-c": 20000,
             "glucometer-strips": 140000 },
  },
  {
    id: "ph11", region: "bukhara",
    name: "Shifo Dorixona Buxoro",
    address: { ru: "ул. Бахоуддина Накшбанда, 7, Бухара", uz: "Bahouddin Naqshband ko'chasi, 7, Buxoro", en: "7 Bahouddin Naqshband St, Bukhara" },
    phone: "+998652277889", lat: 39.7750, lng: 64.4280,
    open24: true, rating: 4.6,
    stock: { "enalapril": 14000, "amlodipine": 21000, "metformin": 25000,
             "nitroglycerin": 12000, "aspirin-cardio": 33000, "rehydron": 44000 },
  },

  /* ---------------- Фергана ---------------- */
  {
    id: "ph12", region: "fergana",
    name: "Farg'ona Dorixona",
    address: { ru: "ул. Мустакиллик, 30, Фергана", uz: "Mustaqillik ko'chasi, 30, Farg'ona", en: "30 Mustaqillik St, Fergana" },
    phone: "+998732441122", lat: 40.3894, lng: 71.7843,
    open24: false, hours: [8, 20], rating: 4.3,
    stock: { "paracetamol-500": 6000, "nurofen": 29000, "loratadine": 12000,
             "teraflu": 63000, "ambroxol": 23000, "smecta": 39000, "mezim": 37000 },
  },

  /* ---------------- Андижан ---------------- */
  {
    id: "ph13", region: "andijan",
    name: "Andijon Med",
    address: { ru: "ул. Навои, 18, Андижан", uz: "Navoiy ko'chasi, 18, Andijon", en: "18 Navoi St, Andijan" },
    phone: "+998742231144", lat: 40.7821, lng: 72.3442,
    open24: false, hours: [8, 21], rating: 4.4,
    stock: { "paracetamol-500": 6500, "amoxicillin": 28000, "azithromycin": 42000,
             "cetirizine": 13000, "vitamin-d3": 60000, "folic-acid": 11000 },
  },

  /* ---------------- Наманган ---------------- */
  {
    id: "ph14", region: "namangan",
    name: "Namangan Shifo",
    address: { ru: "ул. Уйчи, 9, Наманган", uz: "Uychi ko'chasi, 9, Namangan", en: "9 Uychi St, Namangan" },
    phone: "+998692265533", lat: 40.9983, lng: 71.6726,
    open24: true, rating: 4.5,
    stock: { "ibuprofen-400": 15500, "omeprazole-20": 24000, "enalapril": 15000,
             "metformin": 27000, "glucometer-strips": 155000, "rehydron": 47000 },
  },

  /* ---------------- Карши (Кашкадарья) ---------------- */
  {
    id: "ph15", region: "kashkadarya",
    name: "Qarshi Dorixona",
    address: { ru: "ул. Узбекистан, 41, Карши", uz: "O'zbekiston ko'chasi, 41, Qarshi", en: "41 Uzbekistan St, Karshi" },
    phone: "+998752212233", lat: 38.8600, lng: 65.7900,
    open24: false, hours: [8, 20], rating: 4.2,
    stock: { "paracetamol-500": 7000, "analgin": 4500, "suprastin": 26000,
             "chlorhexidine": 7000, "bandage": 5500, "activated-charcoal": 4500 },
  },

  /* ---------------- Ургенч (Хорезм) ---------------- */
  {
    id: "ph16", region: "khorezm",
    name: "Xorazm Farm",
    address: { ru: "ул. Аль-Хорезми, 3, Ургенч", uz: "Al-Xorazmiy ko'chasi, 3, Urganch", en: "3 Al-Khwarizmi St, Urgench" },
    phone: "+998622263344", lat: 41.5500, lng: 60.6314,
    open24: false, hours: [9, 21], rating: 4.3,
    stock: { "paracetamol-500": 7500, "ibuprofen-400": 16000, "amlodipine": 23000,
             "aspirin-cardio": 36000, "vitamin-c": 22000 },
  },

  /* ---------------- Нукус (Каракалпакстан) ---------------- */
  {
    id: "ph17", region: "karakalpakstan",
    name: "Nukus Dori",
    address: { ru: "ул. Дослык, 15, Нукус", uz: "Do'slik ko'chasi, 15, Nukus", en: "15 Doslyk St, Nukus" },
    phone: "+998612224455", lat: 42.4600, lng: 59.6100,
    open24: false, hours: [9, 20], rating: 4.1,
    stock: { "paracetamol-500": 8000, "amoxicillin": 31000, "metformin": 29000,
             "glucometer-strips": 170000, "rehydron": 50000 },
  },

  /* ---------------- Термез (Сурхандарья) ---------------- */
  {
    id: "ph18", region: "surkhandarya",
    name: "Termiz Shifo",
    address: { ru: "ул. Ат-Термизи, 22, Термез", uz: "At-Termiziy ko'chasi, 22, Termiz", en: "22 At-Termizi St, Termez" },
    phone: "+998762236677", lat: 37.2242, lng: 67.2783,
    open24: false, hours: [8, 21], rating: 4.3,
    stock: { "paracetamol-500": 7000, "cetirizine": 14000, "omeprazole-20": 25000,
             "nitroglycerin": 13000, "enalapril": 16000 },
  },
];

/* ============================================================
   Больницы, поликлиники и приёмные отделения.
   Те же оговорки: данные демонстрационные.
   ============================================================ */

export const HOSPITAL_TYPES = [
  { id: "emergency", ru: "Скорая помощь", uz: "Tez yordam", en: "Emergency", icon: "🚑" },
  { id: "hospital", ru: "Больница", uz: "Shifoxona", en: "Hospital", icon: "🏥" },
  { id: "clinic", ru: "Поликлиника", uz: "Poliklinika", en: "Clinic", icon: "🩺" },
  { id: "maternity", ru: "Роддом", uz: "Tug'ruqxona", en: "Maternity", icon: "👶" },
  { id: "children", ru: "Детская", uz: "Bolalar", en: "Children's", icon: "🧒" },
];

export const HOSPITALS = [
  {
    id: "h1", region: "samarkand", type: "emergency",
    name: { ru: "Самаркандский филиал РНЦЭМП", uz: "RShTYoIM Samarqand filiali", en: "Samarkand Emergency Medicine Centre" },
    address: { ru: "ул. Амира Темура, 18, Самарканд", uz: "Amir Temur ko'chasi, 18, Samarqand", en: "18 Amir Temur St, Samarkand" },
    phone: "103", lat: 39.6562, lng: 66.9702, open24: true,
  },
  {
    id: "h2", region: "samarkand", type: "hospital",
    name: { ru: "Самаркандский областной многопрофильный медцентр", uz: "Samarqand viloyat ko'p tarmoqli tibbiyot markazi", en: "Samarkand Regional Medical Centre" },
    address: { ru: "ул. Дагбитская, 1, Самарканд", uz: "Dahbed ko'chasi, 1, Samarqand", en: "1 Dagbit St, Samarkand" },
    phone: "+998662330011", lat: 39.6801, lng: 66.9455, open24: true,
  },
  {
    id: "h3", region: "samarkand", type: "children",
    name: { ru: "Областная детская больница", uz: "Viloyat bolalar shifoxonasi", en: "Regional Children's Hospital" },
    address: { ru: "ул. Мирзо Улугбека, 60, Самарканд", uz: "Mirzo Ulug'bek ko'chasi, 60, Samarqand", en: "60 Mirzo Ulugbek St, Samarkand" },
    phone: "+998662334422", lat: 39.6620, lng: 66.9330, open24: true,
  },
  {
    id: "h4", region: "samarkand", type: "clinic",
    name: { ru: "Семейная поликлиника №5", uz: "5-son oilaviy poliklinika", en: "Family Clinic No. 5" },
    address: { ru: "ул. Гагарина, 102, Самарканд", uz: "Gagarin ko'chasi, 102, Samarqand", en: "102 Gagarin St, Samarkand" },
    phone: "+998662317755", lat: 39.6738, lng: 66.9388, open24: false, hours: [8, 18],
  },
  {
    id: "h5", region: "samarkand", type: "maternity",
    name: { ru: "Областной перинатальный центр", uz: "Viloyat perinatal markazi", en: "Regional Perinatal Centre" },
    address: { ru: "ул. Бустонсарой, 9, Самарканд", uz: "Bo'stonsaroy ko'chasi, 9, Samarqand", en: "9 Bustonsaroy St, Samarkand" },
    phone: "+998662339900", lat: 39.6490, lng: 66.9820, open24: true,
  },
  {
    id: "h6", region: "tashkent-city", type: "emergency",
    name: { ru: "РНЦЭМП", uz: "Respublika shoshilinch tibbiy yordam markazi", en: "Republican Emergency Medicine Centre" },
    address: { ru: "ул. Кичик халка йули, 2, Ташкент", uz: "Kichik halqa yo'li, 2, Toshkent", en: "2 Kichik Halqa Yuli, Tashkent" },
    phone: "103", lat: 41.3180, lng: 69.2360, open24: true,
  },
  {
    id: "h7", region: "tashkent-city", type: "hospital",
    name: { ru: "Городская клиническая больница №1", uz: "1-son shahar klinik shifoxonasi", en: "City Clinical Hospital No. 1" },
    address: { ru: "ул. Фароби, 2, Ташкент", uz: "Forobiy ko'chasi, 2, Toshkent", en: "2 Farobi St, Tashkent" },
    phone: "+998712776655", lat: 41.2880, lng: 69.2030, open24: true,
  },
  {
    id: "h8", region: "tashkent-city", type: "children",
    name: { ru: "Национальный детский медицинский центр", uz: "Milliy bolalar tibbiyot markazi", en: "National Children's Medical Centre" },
    address: { ru: "ул. Паркентская, 51, Ташкент", uz: "Parkent ko'chasi, 51, Toshkent", en: "51 Parkent St, Tashkent" },
    phone: "+998712681122", lat: 41.3070, lng: 69.3220, open24: true,
  },
  {
    id: "h9", region: "bukhara", type: "hospital",
    name: { ru: "Бухарский областной медцентр", uz: "Buxoro viloyat tibbiyot markazi", en: "Bukhara Regional Medical Centre" },
    address: { ru: "ул. Навои, 1, Бухара", uz: "Navoiy ko'chasi, 1, Buxoro", en: "1 Navoi St, Bukhara" },
    phone: "+998652213344", lat: 39.7720, lng: 64.4390, open24: true,
  },
  {
    id: "h10", region: "fergana", type: "hospital",
    name: { ru: "Ферганский областной медцентр", uz: "Farg'ona viloyat tibbiyot markazi", en: "Fergana Regional Medical Centre" },
    address: { ru: "ул. Бурхониддин Маргиноний, 8, Фергана", uz: "Burhoniddin Marg'inoniy ko'chasi, 8, Farg'ona", en: "8 Burhoniddin Marginoniy St, Fergana" },
    phone: "+998732445566", lat: 40.3810, lng: 71.7900, open24: true,
  },
  {
    id: "h11", region: "andijan", type: "hospital",
    name: { ru: "Андижанский областной медцентр", uz: "Andijon viloyat tibbiyot markazi", en: "Andijan Regional Medical Centre" },
    address: { ru: "ул. Ю. Отабекова, 2, Андижан", uz: "Yu. Otabekov ko'chasi, 2, Andijon", en: "2 Yu. Otabekov St, Andijan" },
    phone: "+998742239900", lat: 40.7740, lng: 72.3380, open24: true,
  },
  {
    id: "h12", region: "karakalpakstan", type: "hospital",
    name: { ru: "Республиканская больница Каракалпакстана", uz: "Qoraqalpog'iston respublika shifoxonasi", en: "Karakalpakstan Republican Hospital" },
    address: { ru: "ул. Каракалпакстан, 1, Нукус", uz: "Qoraqalpog'iston ko'chasi, 1, Nukus", en: "1 Karakalpakstan St, Nukus" },
    phone: "+998612221133", lat: 42.4530, lng: 59.6020, open24: true,
  },
];

/** Аптеки, где есть препарат: [{ pharmacy, price }] */
export function pharmaciesWithMed(medId, regionId = null) {
  return PHARMACIES.filter((p) => p.stock && p.stock[medId] != null)
    .filter((p) => !regionId || p.region === regionId)
    .map((p) => ({ pharmacy: p, price: p.stock[medId] }))
    .sort((a, b) => a.price - b.price);
}


export const SPECIALTIES = [
  { id: "therapist", ru: "Терапевт", uz: "Terapevt", en: "GP / Therapist", icon: "🩺" },
  { id: "cardio", ru: "Кардиолог", uz: "Kardiolog", en: "Cardiologist", icon: "❤️" },
  { id: "neuro", ru: "Невролог", uz: "Nevrolog", en: "Neurologist", icon: "🧠" },
  { id: "gastro", ru: "Гастроэнтеролог", uz: "Gastroenterolog", en: "Gastroenterologist", icon: "🫀" },
  { id: "derma", ru: "Дерматолог", uz: "Dermatolog", en: "Dermatologist", icon: "🧴" },
  { id: "ent", ru: "ЛОР", uz: "LOR", en: "ENT", icon: "👂" },
  { id: "ortho", ru: "Травматолог", uz: "Travmatolog", en: "Orthopedist", icon: "🦴" },
  { id: "pediatric", ru: "Педиатр", uz: "Pediatr", en: "Pediatrician", icon: "🧒" },
  { id: "gyn", ru: "Гинеколог", uz: "Ginekolog", en: "Gynecologist", icon: "🌸" },
  { id: "uro", ru: "Уролог", uz: "Urolog", en: "Urologist", icon: "💧" },
  { id: "ophtha", ru: "Офтальмолог", uz: "Oftalmolog", en: "Ophthalmologist", icon: "👁️" },
  { id: "dentist", ru: "Стоматолог", uz: "Stomatolog", en: "Dentist", icon: "🦷" },
];

export const DOCTORS = [
  {
    id: "d1",
    name: "Dr. Nodira Karimova",
    specialty: "therapist",
    years: 14,
    rating: 4.9,
    reviews: 218,
    clinic: { ru: "Клиника «Шифо», Самарканд", uz: "«Shifo» klinikasi, Samarqand", en: "Shifo Clinic, Samarkand" },
    price: 120000,
    slots: ["09:00", "10:30", "14:00", "16:30"],
  },
  {
    id: "d2",
    name: "Dr. Jasur Rahimov",
    specialty: "cardio",
    years: 21,
    rating: 4.8,
    reviews: 341,
    clinic: { ru: "Кардиоцентр, Самарканд", uz: "Kardiomarkaz, Samarqand", en: "Cardio Center, Samarkand" },
    price: 250000,
    slots: ["11:00", "13:00", "15:30"],
  },
  {
    id: "d3",
    name: "Dr. Malika Yusupova",
    specialty: "pediatric",
    years: 9,
    rating: 5.0,
    reviews: 156,
    clinic: { ru: "Детская клиника «Nur»", uz: "«Nur» bolalar klinikasi", en: "Nur Children's Clinic" },
    price: 100000,
    slots: ["08:30", "12:00", "17:00"],
  },
  {
    id: "d4",
    name: "Dr. Aziz Tursunov",
    specialty: "neuro",
    years: 17,
    rating: 4.7,
    reviews: 203,
    clinic: { ru: "Медцентр «Avitsenna»", uz: "«Avitsenna» tibbiyot markazi", en: "Avicenna Medical Center" },
    price: 220000,
    slots: ["10:00", "14:30", "18:00"],
  },
  {
    id: "d5",
    name: "Dr. Dilnoza Saidova",
    specialty: "derma",
    years: 11,
    rating: 4.9,
    reviews: 287,
    clinic: { ru: "Клиника «Estetika»", uz: "«Estetika» klinikasi", en: "Estetika Clinic" },
    price: 180000,
    slots: ["09:30", "11:30", "16:00"],
  },
  {
    id: "d6",
    name: "Dr. Bekzod Ergashev",
    specialty: "gastro",
    years: 15,
    rating: 4.6,
    reviews: 174,
    clinic: { ru: "Медцентр «Salomatlik»", uz: "«Salomatlik» markazi", en: "Salomatlik Center" },
    price: 200000,
    slots: ["10:00", "13:30", "15:00"],
  },
];

/** Быстрые вопросы на старте чата */
export const QUICK_TOPICS = [
  {
    id: "q1",
    icon: "🤒",
    ru: "Третий день держится температура 38",
    uz: "Uchinchi kun 38 harorat ushlab turibdi",
    en: "I've had a 38°C fever for three days",
  },
  {
    id: "q2",
    icon: "🤕",
    ru: "Болит голова каждый вечер",
    uz: "Har oqshom boshim og'riydi",
    en: "I get a headache every evening",
  },
  {
    id: "q3",
    icon: "💊",
    ru: "Можно ли принимать эти лекарства вместе?",
    uz: "Bu dorilarni birga ichsa bo'ladimi?",
    en: "Can I take these medicines together?",
  },
  {
    id: "q4",
    icon: "😴",
    ru: "Плохо сплю уже две недели",
    uz: "Ikki haftadan beri yomon uxlayapman",
    en: "I've been sleeping badly for two weeks",
  },
  {
    id: "q5",
    icon: "🍽️",
    ru: "После еды тяжесть и изжога",
    uz: "Ovqatdan keyin og'irlik va jig'ildon",
    en: "Heaviness and heartburn after meals",
  },
  {
    id: "q6",
    icon: "🩹",
    ru: "На коже появилось раздражение",
    uz: "Terida qichishish paydo bo'ldi",
    en: "A rash appeared on my skin",
  },
];

export const CHRONIC_OPTIONS = [
  { id: "hypertension", ru: "Гипертония", uz: "Gipertoniya", en: "Hypertension" },
  { id: "diabetes", ru: "Диабет", uz: "Diabet", en: "Diabetes" },
  { id: "asthma", ru: "Астма", uz: "Astma", en: "Asthma" },
  { id: "gastritis", ru: "Гастрит", uz: "Gastrit", en: "Gastritis" },
  { id: "thyroid", ru: "Щитовидная железа", uz: "Qalqonsimon bez", en: "Thyroid" },
  { id: "kidney", ru: "Почки", uz: "Buyrak", en: "Kidney" },
  { id: "heart", ru: "Сердце", uz: "Yurak", en: "Heart" },
  { id: "migraine", ru: "Мигрень", uz: "Migren", en: "Migraine" },
];

export const TIPS = [
  {
    ru: "Взрослому достаточно 30–35 мл воды на кг веса в день. При 70 кг — примерно 2,2 литра.",
    uz: "Kattalarga kuniga har kg vazniga 30–35 ml suv yetarli. 70 kg bo'lsa — taxminan 2,2 litr.",
    en: "Adults need roughly 30–35 ml of water per kg of body weight a day. At 70 kg that's about 2.2 litres.",
  },
  {
    ru: "Антибиотики не действуют на вирусы. При обычной простуде они не ускоряют выздоровление.",
    uz: "Antibiotiklar viruslarga ta'sir qilmaydi. Oddiy shamollashda ular tuzalishni tezlashtirmaydi.",
    en: "Antibiotics don't work on viruses. For a common cold they won't speed up recovery.",
  },
  {
    ru: "Давление лучше мерить сидя, после 5 минут покоя, и записывать — врачу нужна динамика, а не одно число.",
    uz: "Bosimni 5 daqiqa dam olgach o'tirgan holda o'lchang va yozib boring — shifokorga bitta raqam emas, dinamika kerak.",
    en: "Measure blood pressure seated after 5 minutes of rest, and write it down — your doctor needs the trend, not one number.",
  },
  {
    ru: "Курс антибиотика допивают до конца, даже если стало легче на третий день.",
    uz: "Antibiotik kursini oxirigacha ichish kerak — uchinchi kuni yaxshi bo'lsa ham.",
    en: "Finish the full antibiotic course, even if you feel better on day three.",
  },
  {
    ru: "Экран перед сном сдвигает засыпание в среднем на 30–60 минут. Помогает убрать телефон за час.",
    uz: "Uxlashdan oldin ekran uyquni o'rtacha 30–60 daqiqaga suradi. Telefonni bir soat oldin qo'ying.",
    en: "Screens before bed delay sleep onset by 30–60 minutes on average. Put the phone away an hour earlier.",
  },
];
