/* ============================================================
   Триаж «красных флагов».
   Простой локальный детектор опасных формулировок — работает
   ДО обращения к ИИ и без интернета. Не ставит диагноз:
   единственная задача — не дать пропустить неотложное состояние.
   ============================================================ */

const GROUPS = [
  {
    id: "cardiac",
    weight: 3,
    words: [
      // ru
      "боль в груди", "давит грудь", "жжение в груди", "сжимает грудь",
      "отдает в руку", "отдаёт в руку", "отдает в челюсть",
      // uz
      "ko'krak og'riq", "kokrak ogriq", "yurak og'riq", "yurak ogriq",
      // en
      "chest pain", "chest pressure", "crushing chest", "pain radiating to arm",
      "сердце колет сильно", "давит за грудиной", "боль за грудиной",
      "жжет в груди и рука", "yurak sanchiyapti", "ko'krakni bosyapti",
      "tightness in chest", "heaviness in chest",
    ],
  },
  {
    id: "breathing",
    weight: 3,
    words: [
      "не могу дышать", "трудно дышать", "задыхаюсь", "одышка в покое",
      "нехватка воздуха", "нафас yeta", "nafas yetmayapti", "nafas ololmayapman",
      "bo'g'ilyapman", "cannot breathe", "can't breathe", "shortness of breath",
      "gasping", "не хватает воздуха", "дышу с трудом", "посинели губы",
      "губы синие", "хриплю", "nafas qisyapti", "lab ko'karib ketdi",
      "blue lips", "wheezing badly", "struggling to breathe",
    ],
  },
  {
    id: "stroke",
    weight: 3,
    words: [
      "перекосило лицо", "не поднимается рука", "отнялась рука", "отнялась нога",
      "речь спуталась", "не могу говорить", "онемела половина",
      "yuz qiyshaydi", "gapira olmayapman", "qo'l ishlamayapti",
      "face drooping", "slurred speech", "arm weakness", "sudden numbness",
      "перекосило рот", "не чувствую руку", "не чувствую ногу",
      "внезапно онемел", "двоится в глазах внезапно",
      "og'iz qiyshaydi", "qo'lim sezmayapti", "to'satdan uvishdi",
      "sudden weakness one side", "cannot lift arm",
    ],
  },
  {
    id: "bleeding",
    weight: 3,
    words: [
      "сильное кровотечение", "кровь не останавливается", "рвота кровью",
      "кровь в рвоте", "черный стул", "чёрный стул", "кровь в стуле",
      "qon ketyapti", "qon to'xtamayapti", "qusishda qon",
      "heavy bleeding", "vomiting blood", "black stool", "blood in stool",
      "рвет кровью", "кашель с кровью", "кровь горлом", "не могу остановить кровь",
      "qon qusyapti", "yo'talda qon", "qon oqishi to'xtamayapti",
      "coughing up blood", "bleeding won't stop",
    ],
  },
  {
    id: "consciousness",
    weight: 3,
    words: [
      "потерял сознание", "потеря сознания", "обморок", "судороги", "припадок",
      "не приходит в себя", "hushidan ketdi", "hushini yo'qotdi", "talvasa",
      "unconscious", "fainted", "seizure", "convulsion", "unresponsive",
      "упал в обморок", "отключился", "бьется в судорогах", "не реагирует",
      "закатились глаза", "hushsiz", "titrab qoldi", "javob bermayapti",
      "passed out", "collapsed",
    ],
  },
  {
    id: "anaphylaxis",
    weight: 3,
    words: [
      "отек горла", "отёк горла", "распухло горло", "опух язык", "отек лица",
      "tomoq shishdi", "til shishdi",
      "throat swelling", "swollen tongue", "anaphylaxis",
      "опухло лицо", "трудно глотать и отек", "покрылся сыпью и задыхаюсь",
      "yuz shishdi", "yutolmayapman",
      "swelling after medicine", "swollen lips and rash",
    ],
  },
  {
    id: "selfharm",
    weight: 4,
    words: [
      "покончить с собой", "не хочу жить", "суицид", "сведу счеты",
      "yashagim kelmayapti", "o'zimni o'ldir",
      "kill myself", "suicidal", "end my life", "want to die",
      "жить не хочется", "устал жить", "нет смысла жить", "хочу умереть",
      "порезать себя", "причинить себе вред",
      "o'lgim keladi", "yashashdan charchadim", "o'zimga zarar",
      "self harm", "hurt myself", "no reason to live",
    ],
  },
  {
    id: "infantFever",
    weight: 2,
    words: [
      "температура у младенца", "грудничок температура", "ребенок не просыпается",
      "chaqaloq isitma", "bola uyg'onmayapti",
      "infant fever", "baby unresponsive",
    ],
  },
  {
    id: "poisoning",
    weight: 3,
    words: [
      "выпил таблетки все", "передозировка", "отравился", "выпил химию",
      "проглотил батарейку", "ребенок выпил",
      "dori ortiqcha", "zaharlandim", "bola dori ichdi",
      "overdose", "poisoning", "swallowed chemicals", "took too many pills",
    ],
  },
  {
    id: "meningitis",
    weight: 3,
    words: [
      "температура и шея не гнется", "сыпь не бледнеет", "боюсь света и голова",
      "bo'yin qotdi va isitma", "yorug'likdan qo'rqaman",
      "stiff neck and fever", "rash that doesn't fade",
    ],
  },
  {
    id: "pregnancy",
    weight: 2,
    words: [
      "кровотечение при беременности", "беременна кровь", "схватки раньше срока",
      "homiladorlikda qon", "bleeding while pregnant", "preterm labor",
    ],
  },
];

const LABELS = {
  cardiac: {
    ru: "Возможная сердечная боль",
    uz: "Yurak bilan bog'liq bo'lishi mumkin",
    en: "Possible cardiac pain",
  },
  breathing: {
    ru: "Затруднённое дыхание",
    uz: "Nafas olish qiyinlashgan",
    en: "Breathing difficulty",
  },
  stroke: {
    ru: "Признаки, похожие на инсульт",
    uz: "Insultga o'xshash belgilar",
    en: "Possible stroke signs",
  },
  bleeding: {
    ru: "Кровотечение",
    uz: "Qon ketishi",
    en: "Bleeding",
  },
  consciousness: {
    ru: "Потеря сознания или судороги",
    uz: "Hushdan ketish yoki talvasa",
    en: "Loss of consciousness or seizure",
  },
  anaphylaxis: {
    ru: "Возможная аллергическая реакция с отёком",
    uz: "Shish bilan kechuvchi allergiya",
    en: "Possible severe allergic reaction",
  },
  selfharm: {
    ru: "Вам сейчас тяжело",
    uz: "Sizga hozir og'ir",
    en: "You're going through something hard",
  },
  infantFever: {
    ru: "Состояние ребёнка требует осмотра",
    uz: "Bolani ko'rikdan o'tkazish kerak",
    en: "A child who needs to be seen",
  },
  poisoning: {
    ru: "Возможное отравление или передозировка",
    uz: "Zaharlanish yoki dori ortiqchaligi bo'lishi mumkin",
    en: "Possible poisoning or overdose",
  },
  meningitis: {
    ru: "Признаки, требующие срочного осмотра",
    uz: "Shoshilinch ko'rik talab qiladigan belgilar",
    en: "Signs that need urgent assessment",
  },
  pregnancy: {
    ru: "Беременность — требует осмотра",
    uz: "Homiladorlik — ko'rik zarur",
    en: "Pregnancy — needs assessment",
  },
};

const ADVICE = {
  default: {
    ru: "Не ждите ответа ИИ. Позвоните 103 или обратитесь в ближайшее приёмное отделение.",
    uz: "AI javobini kutmang. 103 ga qo'ng'iroq qiling yoki eng yaqin qabulxonaga boring.",
    en: "Don't wait for an AI answer. Call 103 or go to the nearest emergency department.",
  },
  selfharm: {
    ru: "Пожалуйста, не оставайтесь с этим наедине. Позвоните близкому человеку или на линию психологической помощи 1099 (Узбекистан). Если есть угроза жизни — 103.",
    uz: "Iltimos, bu bilan yolg'iz qolmang. Yaqin kishingizga yoki 1099 psixologik yordam liniyasiga qo'ng'iroq qiling. Hayotga xavf bo'lsa — 103.",
    en: "Please don't go through this alone. Call someone close to you, or a crisis line. If life is at risk — call 103.",
  },
};

/** Ищет опасные формулировки в тексте. Возвращает null или { level, groups[], labels[], advice } */
export function scanRedFlags(text, lang = "ru") {
  if (!text) return null;
  const low = ` ${text.toLowerCase().replace(/ё/g, "е")} `;
  const hits = [];
  let score = 0;

  GROUPS.forEach((g) => {
    const found = g.words.some((w) => low.includes(w.replace(/ё/g, "е")));
    if (found) {
      hits.push(g.id);
      score += g.weight;
    }
  });

  if (!hits.length) return null;

  const isSelfHarm = hits.includes("selfharm");
  return {
    level: score >= 3 ? "urgent" : "watch",
    groups: hits,
    labels: hits.map((id) => LABELS[id]?.[lang] || LABELS[id]?.ru || id),
    advice: isSelfHarm
      ? ADVICE.selfharm[lang] || ADVICE.selfharm.ru
      : ADVICE.default[lang] || ADVICE.default.ru,
    selfharm: isSelfHarm,
  };
}

export const EMERGENCY_NUMBER = "103";
