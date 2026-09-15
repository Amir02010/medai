/* ============================================================
   Регионы Узбекистана.

   Используются, чтобы показывать человеку аптеки и больницы
   его области, а не всей страны. Порядок — как в справочниках:
   Ташкент первым, дальше по алфавиту.
   ============================================================ */

export const REGIONS = [
  {
    id: "tashkent-city",
    ru: "Ташкент (город)", uz: "Toshkent shahri", en: "Tashkent City",
    lat: 41.2995, lng: 69.2401,
  },
  {
    id: "andijan",
    ru: "Андижанская область", uz: "Andijon viloyati", en: "Andijan Region",
    lat: 40.7821, lng: 72.3442,
  },
  {
    id: "bukhara",
    ru: "Бухарская область", uz: "Buxoro viloyati", en: "Bukhara Region",
    lat: 39.7681, lng: 64.4556,
  },
  {
    id: "fergana",
    ru: "Ферганская область", uz: "Farg'ona viloyati", en: "Fergana Region",
    lat: 40.3894, lng: 71.7843,
  },
  {
    id: "jizzakh",
    ru: "Джизакская область", uz: "Jizzax viloyati", en: "Jizzakh Region",
    lat: 40.1158, lng: 67.8422,
  },
  {
    id: "karakalpakstan",
    ru: "Каракалпакстан", uz: "Qoraqalpog'iston", en: "Karakalpakstan",
    lat: 42.4600, lng: 59.6100,
  },
  {
    id: "kashkadarya",
    ru: "Кашкадарьинская область", uz: "Qashqadaryo viloyati", en: "Kashkadarya Region",
    lat: 38.8600, lng: 65.7900,
  },
  {
    id: "khorezm",
    ru: "Хорезмская область", uz: "Xorazm viloyati", en: "Khorezm Region",
    lat: 41.5500, lng: 60.6314,
  },
  {
    id: "namangan",
    ru: "Наманганская область", uz: "Namangan viloyati", en: "Namangan Region",
    lat: 40.9983, lng: 71.6726,
  },
  {
    id: "navoiy",
    ru: "Навоийская область", uz: "Navoiy viloyati", en: "Navoiy Region",
    lat: 40.0844, lng: 65.3792,
  },
  {
    id: "samarkand",
    ru: "Самаркандская область", uz: "Samarqand viloyati", en: "Samarkand Region",
    lat: 39.6548, lng: 66.9597,
  },
  {
    id: "sirdaryo",
    ru: "Сырдарьинская область", uz: "Sirdaryo viloyati", en: "Sirdaryo Region",
    lat: 40.4897, lng: 68.7842,
  },
  {
    id: "surkhandarya",
    ru: "Сурхандарьинская область", uz: "Surxondaryo viloyati", en: "Surkhandarya Region",
    lat: 37.2242, lng: 67.2783,
  },
  {
    id: "tashkent-region",
    ru: "Ташкентская область", uz: "Toshkent viloyati", en: "Tashkent Region",
    lat: 41.0000, lng: 69.5000,
  },
];

export const regionById = (id) => REGIONS.find((r) => r.id === id) || null;

/** Ближайший регион по координатам — чтобы не спрашивать лишний раз */
export function nearestRegion(loc) {
  if (!loc) return null;
  let best = null;
  let bestD = Infinity;
  REGIONS.forEach((r) => {
    const d = (r.lat - loc.lat) ** 2 + (r.lng - loc.lng) ** 2;
    if (d < bestD) {
      bestD = d;
      best = r;
    }
  });
  return best;
}
