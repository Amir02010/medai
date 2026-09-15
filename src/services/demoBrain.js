/* ============================================================
   Демо-режим.
   Нужен, чтобы приложение можно было показывать инвесторам и
   партнёрам до подключения ключа модели. Отвечает по шаблонам,
   честно помечается как демо в интерфейсе.
   ============================================================ */

const T = {
  ru: {
    intro: "Разберём по порядку.",
    ask: "Чтобы сузить круг, ответьте на пару вопросов:",
    care: "Когда обязательно к врачу",
    self: "Что можно сделать сейчас",
    who: "К какому специалисту",
    tail:
      "Это не диагноз. MedAI помогает разобраться в симптомах, но решение принимает врач.",
    demoNote:
      "_Демо-режим: ключ модели не подключён. Подключите переменную окружения — и ответы станут настоящими._",
    generic: [
      "Опишите, пожалуйста, подробнее: как давно это началось, что усиливает и что облегчает симптом.",
      "Есть ли температура, и если да — какая максимальная за последние сутки?",
      "Принимали ли вы что-то по этому поводу? Помогло ли?",
    ],
  },
  uz: {
    intro: "Keling, tartib bilan ko'rib chiqamiz.",
    ask: "Aniqroq aytish uchun bir-ikki savolga javob bering:",
    care: "Qachon albatta shifokorga",
    self: "Hozir nima qilish mumkin",
    who: "Qaysi mutaxassisga",
    tail:
      "Bu tashxis emas. MedAI simptomlarni tushunishga yordam beradi, qaror esa shifokorniki.",
    demoNote:
      "_Demo rejim: model kaliti ulanmagan. Muhit o'zgaruvchisini qo'shsangiz, javoblar haqiqiy bo'ladi._",
    generic: [
      "Iltimos, batafsilroq yozing: qachon boshlangan, nima kuchaytiradi va nima yengillashtiradi.",
      "Harorat bormi? Bo'lsa, oxirgi bir kunda eng yuqorisi qancha edi?",
      "Shu bo'yicha biror dori ichdingizmi? Yordam berdimi?",
    ],
  },
  en: {
    intro: "Let's take this step by step.",
    ask: "To narrow it down, a couple of questions:",
    care: "When you must see a doctor",
    self: "What you can do now",
    who: "Which specialist",
    tail:
      "This is not a diagnosis. MedAI helps you make sense of symptoms — the decision is your doctor's.",
    demoNote:
      "_Demo mode: no model key connected. Add the environment variable and answers become real._",
    generic: [
      "Could you describe it in more detail: when it started, what makes it worse and what helps.",
      "Do you have a fever, and if so what was the highest reading in the last 24 hours?",
      "Have you taken anything for it? Did it help?",
    ],
  },
};

const PATTERNS = [
  {
    id: "fever",
    words: ["температур", "жар", "isitma", "harorat", "fever", "temperature"],
    ru: {
      self: [
        "Пейте больше жидкости — небольшими порциями, но часто.",
        "Жаропонижающее по инструкции, если температура выше 38,5 °C или плохо переносится.",
        "Проветривайте комнату, не кутайтесь.",
      ],
      care: [
        "Температура держится дольше 3 дней.",
        "Выше 39 °C и не сбивается.",
        "Появились сыпь, спутанность, сильная головная боль или одышка.",
      ],
      who: "Терапевт, для ребёнка — педиатр.",
    },
    uz: {
      self: [
        "Ko'proq suyuqlik iching — oz-ozdan, tez-tez.",
        "38,5 °C dan yuqori bo'lsa, ko'rsatmaga ko'ra harorat tushiruvchi.",
        "Xonani shamollating, o'ralib olmang.",
      ],
      care: [
        "Harorat 3 kundan ortiq davom etsa.",
        "39 °C dan yuqori va tushmasa.",
        "Toshma, hushning chalkashishi, kuchli bosh og'rig'i yoki nafas qisishi qo'shilsa.",
      ],
      who: "Terapevt, bola uchun — pediatr.",
    },
    en: {
      self: [
        "Drink more fluids — small amounts, often.",
        "An antipyretic per the label if it's above 38.5 °C or you feel bad.",
        "Air the room, don't over-wrap.",
      ],
      care: [
        "Fever lasting more than 3 days.",
        "Above 39 °C and not coming down.",
        "Rash, confusion, severe headache or breathlessness appear.",
      ],
      who: "A GP; for a child, a paediatrician.",
    },
  },
  {
    id: "headache",
    words: ["голов", "мигрен", "bosh og", "boshim", "headache", "migraine"],
    ru: {
      self: [
        "Уберите экран и яркий свет на 20–30 минут.",
        "Стакан воды — обезвоживание частая причина вечерней головной боли.",
        "Отметьте, в какое время суток болит: это главное, что спросит невролог.",
      ],
      care: [
        "Боль возникла внезапно и очень сильная — «как удар».",
        "Есть температура и скованность шеи.",
        "Боль не проходит больше 3 дней или меняет характер.",
      ],
      who: "Невролог, при регулярных приступах — с дневником головной боли.",
    },
    uz: {
      self: [
        "20–30 daqiqaga ekran va yorqin yorug'likdan uzoqlashing.",
        "Bir stakan suv iching — suvsizlanish oqshomgi bosh og'rig'ining tez-tez sababi.",
        "Kun davomida qaysi vaqtda og'rishini belgilab boring.",
      ],
      care: [
        "Og'riq to'satdan va juda kuchli boshlansa.",
        "Harorat va bo'yin qotishi bo'lsa.",
        "3 kundan ortiq o'tmasa yoki xarakteri o'zgarsa.",
      ],
      who: "Nevrolog — bosh og'rig'i kundaligi bilan boring.",
    },
    en: {
      self: [
        "Step away from screens and bright light for 20–30 minutes.",
        "Have a glass of water — dehydration is a common cause of evening headaches.",
        "Note what time of day it hits; that's the first thing a neurologist asks.",
      ],
      care: [
        "Sudden, very severe pain — 'thunderclap'.",
        "Fever with a stiff neck.",
        "Lasting more than 3 days or changing character.",
      ],
      who: "A neurologist — bring a headache diary.",
    },
  },
  {
    id: "stomach",
    words: ["живот", "желуд", "изжог", "тошнот", "qorin", "oshqozon", "jig'ildon", "stomach", "nausea", "heartburn"],
    ru: {
      self: [
        "Дробное питание, без острого, жирного и газировки на 2–3 дня.",
        "Не ложитесь в течение полутора часов после еды.",
        "Отметьте связь с конкретной едой — это сильно помогает врачу.",
      ],
      care: [
        "Боль резкая, локальная, усиливается при движении.",
        "Рвота с кровью или чёрный стул — немедленно.",
        "Симптомы держатся больше двух недель.",
      ],
      who: "Гастроэнтеролог; при острой боли — приёмное отделение.",
    },
    uz: {
      self: [
        "2–3 kun achchiq, yog'li va gazli ichimliklarsiz, oz-ozdan ovqatlaning.",
        "Ovqatdan keyin bir yarim soat yotmang.",
        "Qaysi ovqatdan keyin kuchayishini yozib boring.",
      ],
      care: [
        "Og'riq keskin, bir joyda va harakatda kuchaysa.",
        "Qusishda qon yoki qora najas — zudlik bilan.",
        "Ikki haftadan ortiq davom etsa.",
      ],
      who: "Gastroenterolog; o'tkir og'riqda — qabulxona.",
    },
    en: {
      self: [
        "Small frequent meals; skip spicy, fatty food and fizzy drinks for 2–3 days.",
        "Don't lie down for 90 minutes after eating.",
        "Note which foods trigger it — that helps the doctor a lot.",
      ],
      care: [
        "Sharp, localised pain that worsens with movement.",
        "Vomiting blood or black stools — immediately.",
        "Symptoms lasting more than two weeks.",
      ],
      who: "A gastroenterologist; for acute pain, the emergency department.",
    },
  },
  {
    id: "sleep",
    words: ["сон", "бессонн", "не сплю", "uyqu", "uxlay", "sleep", "insomnia"],
    ru: {
      self: [
        "Один и тот же подъём каждый день — даже в выходные. Это работает сильнее всего.",
        "Кофеин — не позже чем за 8 часов до сна.",
        "Если не уснули за 20 минут — встаньте и займитесь чем-то спокойным.",
      ],
      care: [
        "Бессонница держится больше месяца.",
        "Днём засыпаете за рулём или на работе.",
        "Партнёр замечает остановки дыхания во сне.",
      ],
      who: "Терапевт, при подозрении на апноэ — сомнолог.",
    },
    uz: {
      self: [
        "Har kuni bir xil vaqtda turing — dam olish kunlari ham.",
        "Kofeinni uxlashdan 8 soat oldin to'xtating.",
        "20 daqiqada uxlolmasangiz — turing va tinch ish bilan shug'ullaning.",
      ],
      care: [
        "Uyqusizlik bir oydan ortiq davom etsa.",
        "Kunduzi rul yoki ish vaqtida uxlab qolsangiz.",
        "Uyquda nafas to'xtashi kuzatilsa.",
      ],
      who: "Terapevt; apnoe shubhasida — somnolog.",
    },
    en: {
      self: [
        "Wake at the same time every day — weekends included. This works best of all.",
        "No caffeine within 8 hours of bedtime.",
        "If you're not asleep in 20 minutes, get up and do something calm.",
      ],
      care: [
        "Insomnia lasting more than a month.",
        "Falling asleep during the day at the wheel or at work.",
        "A partner notices you stop breathing in your sleep.",
      ],
      who: "A GP; if apnoea is suspected, a sleep specialist.",
    },
  },
  {
    id: "skin",
    words: ["сыпь", "кожа", "зуд", "прыщ", "teri", "qichish", "toshma", "rash", "skin", "itch"],
    ru: {
      self: [
        "Не расчёсывайте и не мажьте сразу несколькими средствами.",
        "Сфотографируйте сегодня — врачу нужна динамика.",
        "Вспомните, что нового появилось за 3 дня до сыпи: еда, лекарство, порошок.",
      ],
      care: [
        "Сыпь с температурой или отёком.",
        "Быстро распространяется.",
        "Появилась после нового лекарства — в этом случае к врачу сразу.",
      ],
      who: "Дерматолог; при отёке лица или горла — скорая.",
    },
    uz: {
      self: [
        "Qashimang va bir vaqtda bir nechta malham surtmang.",
        "Bugun rasmga oling — shifokorga dinamika kerak.",
        "Toshmadan 3 kun oldin nima yangi bo'lganini eslang: ovqat, dori, kir yuvish kukuni.",
      ],
      care: [
        "Toshma harorat yoki shish bilan bo'lsa.",
        "Tez tarqalayotgan bo'lsa.",
        "Yangi dori ichgandan keyin paydo bo'lsa — darhol shifokorga.",
      ],
      who: "Dermatolog; yuz yoki tomoq shishsa — tez yordam.",
    },
    en: {
      self: [
        "Don't scratch, and don't layer several creams at once.",
        "Photograph it today — the doctor needs to see progression.",
        "Recall what was new in the 3 days before: food, medicine, detergent.",
      ],
      care: [
        "Rash with fever or swelling.",
        "Spreading quickly.",
        "Appeared after starting a new medicine — see a doctor right away.",
      ],
      who: "A dermatologist; with face or throat swelling, emergency services.",
    },
  },
];

function bullets(items) {
  return items.map((i) => `• ${i}`).join("\n");
}

function summaryTemplate(messages, lang) {
  const userLines = messages
    .filter((m) => m.role === "user")
    .map((m) => m.text)
    .slice(-8);
  const head = {
    ru: "**Выжимка для врача**",
    uz: "**Shifokor uchun xulosa**",
    en: "**Summary for your doctor**",
  }[lang];
  const complaints = {
    ru: "Жалобы со слов пациента",
    uz: "Bemor so'zlaridan shikoyatlar",
    en: "Reported complaints",
  }[lang];
  const note = {
    ru: "Составлено автоматически из диалога с MedAI. Требует проверки врачом.",
    uz: "MedAI suhbatidan avtomatik tuzilgan. Shifokor tekshiruvi talab etiladi.",
    en: "Auto-generated from a MedAI conversation. Requires clinical verification.",
  }[lang];

  return `${head}\n\n**${complaints}:**\n${bullets(userLines.length ? userLines : ["—"])}\n\n_${note}_`;
}

export async function demoReply(messages, lang = "ru", mode = "chat") {
  await new Promise((r) => setTimeout(r, 500 + Math.random() * 700));

  const t = T[lang] || T.ru;

  if (mode === "summary") return summaryTemplate(messages, lang);

  const last = [...messages].reverse().find((m) => m.role === "user");
  const text = (last?.text || "").toLowerCase();

  if (last?.image) {
    return {
      ru: `На фото, судя по всему, упаковка лекарства.\n\nВ демо-режиме я не могу прочитать изображение — для этого нужен ключ модели с поддержкой зрения. Когда он подключён, MedAI распознаёт название, действующее вещество, дозировку и предупреждает о взаимодействии с тем, что вы уже принимаете.\n\n${t.demoNote}`,
      uz: `Rasmda, ehtimol, dori qadog'i.\n\nDemo rejimda men rasmni o'qiy olmayman — buning uchun ko'rish qo'llab-quvvatlaydigan model kaliti kerak. U ulanganda MedAI nomini, ta'sir etuvchi moddani, dozani aniqlaydi va siz ichayotgan dorilar bilan mos kelishini tekshiradi.\n\n${t.demoNote}`,
      en: `The photo appears to show a medicine package.\n\nIn demo mode I can't read images — that needs a vision-capable model key. Once connected, MedAI reads the name, active ingredient and dose, and flags interactions with what you already take.\n\n${t.demoNote}`,
    }[lang];
  }

  const hit = PATTERNS.find((p) => p.words.some((w) => text.includes(w)));

  if (!hit) {
    return `${t.intro}\n\n${t.ask}\n${bullets(t.generic)}\n\n_${t.tail}_\n\n${t.demoNote}`;
  }

  const d = hit[lang] || hit.ru;
  return [
    t.intro,
    "",
    `**${t.self}**`,
    bullets(d.self),
    "",
    `**${t.care}**`,
    bullets(d.care),
    "",
    `**${t.who}**`,
    d.who,
    "",
    `_${t.tail}_`,
    "",
    t.demoNote,
  ].join("\n");
}
