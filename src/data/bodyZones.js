/* ============================================================
   Зоны тела для симптом-чекера.
   Для каждой: название на 3 языках, к какому специалисту,
   типовые направления разбора и «красные флаги» зоны.
   Это НЕ диагнозы — только навигация к нужному врачу.
   ============================================================ */

export const ZONES = {
  head: {
    ru: "Голова", uz: "Bosh", en: "Head",
    specialty: "neuro",
    common: {
      ru: ["Напряжение и усталость", "Мигрень", "Проблемы со зрением", "Давление"],
      uz: ["Zo'riqish va charchoq", "Migren", "Ko'rish muammolari", "Bosim"],
      en: ["Tension and fatigue", "Migraine", "Vision strain", "Blood pressure"],
    },
    urgent: {
      ru: "Внезапная очень сильная боль, спутанность речи, слабость в одной половине тела",
      uz: "To'satdan juda kuchli og'riq, nutqning chalkashishi, tananing bir tomonida holsizlik",
      en: "Sudden severe pain, slurred speech, weakness on one side",
    },
  },
  eyes: {
    ru: "Глаза", uz: "Ko'zlar", en: "Eyes",
    specialty: "ophtha",
    common: {
      ru: ["Перенапряжение от экрана", "Сухость", "Аллергия", "Воспаление"],
      uz: ["Ekrandan zo'riqish", "Quruqlik", "Allergiya", "Yallig'lanish"],
      en: ["Screen strain", "Dryness", "Allergy", "Inflammation"],
    },
    urgent: {
      ru: "Резкая потеря зрения, сильная боль, травма глаза",
      uz: "Ko'rishning keskin yo'qolishi, kuchli og'riq, ko'z jarohati",
      en: "Sudden vision loss, severe pain, eye injury",
    },
  },
  throat: {
    ru: "Горло и шея", uz: "Tomoq va bo'yin", en: "Throat & neck",
    specialty: "ent",
    common: {
      ru: ["Вирусная инфекция", "Тонзиллит", "Щитовидная железа", "Мышечное напряжение"],
      uz: ["Virusli infeksiya", "Tonzillit", "Qalqonsimon bez", "Mushak zo'riqishi"],
      en: ["Viral infection", "Tonsillitis", "Thyroid", "Muscle strain"],
    },
    urgent: {
      ru: "Трудно дышать или глотать, отёк языка или горла",
      uz: "Nafas olish yoki yutish qiyin, til yoki tomoq shishi",
      en: "Trouble breathing or swallowing, swelling of tongue or throat",
    },
  },
  chest: {
    ru: "Грудная клетка", uz: "Ko'krak qafasi", en: "Chest",
    specialty: "cardio",
    common: {
      ru: ["Мышечная или рёберная боль", "Бронхи и лёгкие", "Изжога", "Тревога"],
      uz: ["Mushak yoki qovurg'a og'rig'i", "Bronx va o'pka", "Jig'ildon", "Xavotir"],
      en: ["Muscle or rib pain", "Airways and lungs", "Heartburn", "Anxiety"],
    },
    urgent: {
      ru: "Давящая боль, отдающая в руку или челюсть, одышка, холодный пот — звоните 103",
      uz: "Qo'l yoki jag'ga uriladigan bosuvchi og'riq, nafas qisishi, sovuq ter — 103 ga qo'ng'iroq qiling",
      en: "Crushing pain radiating to arm or jaw, breathlessness, cold sweat — call 103",
    },
    alwaysUrgent: true,
  },
  abdomen: {
    ru: "Живот", uz: "Qorin", en: "Abdomen",
    specialty: "gastro",
    common: {
      ru: ["Гастрит и питание", "Кишечник", "Желчный пузырь", "Инфекция"],
      uz: ["Gastrit va ovqatlanish", "Ichak", "O't pufagi", "Infeksiya"],
      en: ["Gastritis and diet", "Bowel", "Gallbladder", "Infection"],
    },
    urgent: {
      ru: "Резкая боль справа внизу, доскообразный живот, рвота кровью, чёрный стул",
      uz: "O'ng pastda keskin og'riq, taxtadek qattiq qorin, qusishda qon, qora najas",
      en: "Sharp lower-right pain, rigid abdomen, vomiting blood, black stools",
    },
  },
  pelvis: {
    ru: "Таз и низ живота", uz: "Chanoq va qorinning pastki qismi", en: "Pelvis & lower abdomen",
    specialty: "uro",
    common: {
      ru: ["Мочевой пузырь", "Почки", "Гинекология", "Кишечник"],
      uz: ["Siydik pufagi", "Buyraklar", "Ginekologiya", "Ichak"],
      en: ["Bladder", "Kidneys", "Gynaecology", "Bowel"],
    },
    urgent: {
      ru: "Кровь в моче, температура с болью в пояснице, невозможность помочиться",
      uz: "Siydikda qon, bel og'rig'i bilan harorat, siya olmaslik",
      en: "Blood in urine, fever with flank pain, unable to pass urine",
    },
  },
  arm: {
    ru: "Рука и плечо", uz: "Qo'l va yelka", en: "Arm & shoulder",
    specialty: "ortho",
    common: {
      ru: ["Перегрузка и растяжение", "Сустав", "Защемление нерва", "Осанка"],
      uz: ["Ortiqcha zo'riqish va cho'zilish", "Bo'g'im", "Nerv qisilishi", "Qomat"],
      en: ["Overuse and strain", "Joint", "Pinched nerve", "Posture"],
    },
    urgent: {
      ru: "Онемение с одной стороны, деформация после травмы, левая рука вместе с болью в груди",
      uz: "Bir tomonlama uvishish, jarohatdan keyin deformatsiya, ko'krak og'rig'i bilan chap qo'l",
      en: "One-sided numbness, deformity after injury, left arm together with chest pain",
    },
  },
  leg: {
    ru: "Нога и колено", uz: "Oyoq va tizza", en: "Leg & knee",
    specialty: "ortho",
    common: {
      ru: ["Нагрузка и суставы", "Вены", "Мышцы", "Плоскостопие"],
      uz: ["Yuklama va bo'g'imlar", "Venalar", "Mushaklar", "Yassi oyoq"],
      en: ["Load and joints", "Veins", "Muscles", "Flat feet"],
    },
    urgent: {
      ru: "Односторонний отёк с болью в икре, нога холодная или синеет",
      uz: "Bir tomonlama shish va boldir og'rig'i, oyoq sovuq yoki ko'karib ketgan",
      en: "One-sided swelling with calf pain, leg cold or turning blue",
    },
  },
  skin: {
    ru: "Кожа", uz: "Teri", en: "Skin",
    specialty: "derma",
    common: {
      ru: ["Аллергия", "Раздражение", "Инфекция", "Реакция на лекарство"],
      uz: ["Allergiya", "Ta'sirlanish", "Infeksiya", "Doriga reaksiya"],
      en: ["Allergy", "Irritation", "Infection", "Drug reaction"],
    },
    urgent: {
      ru: "Сыпь с температурой, быстро растущая, с отёком лица или губ",
      uz: "Harorat bilan toshma, tez tarqalayotgan, yuz yoki lab shishi bilan",
      en: "Rash with fever, spreading fast, with face or lip swelling",
    },
  },
  back: {
    ru: "Спина и поясница", uz: "Bel va orqa", en: "Back & lower back",
    specialty: "neuro",
    common: {
      ru: ["Мышечное напряжение", "Позвоночник", "Почки", "Сидячая работа"],
      uz: ["Mushak zo'riqishi", "Umurtqa", "Buyraklar", "O'tirib ishlash"],
      en: ["Muscle tension", "Spine", "Kidneys", "Desk work"],
    },
    urgent: {
      ru: "Слабость в ногах, нарушение мочеиспускания, боль после падения",
      uz: "Oyoqlarda holsizlik, siyishning buzilishi, yiqilgandan keyingi og'riq",
      en: "Leg weakness, loss of bladder control, pain after a fall",
    },
  },
};

/** Порядок кнопок-подсказок под схемой */
export const ZONE_ORDER = [
  "head", "eyes", "throat", "chest", "abdomen", "pelvis", "back", "arm", "leg", "skin",
];
