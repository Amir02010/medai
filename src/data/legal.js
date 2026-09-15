/* ============================================================
   Юридические тексты на трёх языках.

   Это рабочая заготовка, а не заключение юриста. Перед публичным
   запуском покажите тексты юристу и подставьте:
     — название и реквизиты компании
     — адрес для обращений (COMPANY.email)
   Всё остальное описывает то, как приложение реально работает.
   ============================================================ */

export const LEGAL_UPDATED = "2026-09-13";

export const COMPANY = {
  name: "MedAI",
  email: "hello@medai.uz", // ← замените на свой адрес
};

export const TERMS = {
  ru: [
    {
      h: "Что такое MedAI",
      p: [
        "MedAI — информационный сервис. Он помогает разобраться в симптомах, подсказывает, к какому специалисту обратиться, показывает аптеки поблизости и напоминает о приёме лекарств.",
        "MedAI не является медицинской организацией и не оказывает медицинских услуг.",
      ],
    },
    {
      h: "Сервис не заменяет врача",
      p: [
        "Ответы сервиса носят справочный характер. Они не являются диагнозом, назначением или медицинским заключением.",
        "Решение о диагностике и лечении принимает только врач после очного осмотра.",
        "При признаках неотложного состояния — боль в груди, затруднённое дыхание, потеря сознания, сильное кровотечение, признаки инсульта, отёк горла — немедленно звоните 103. Не ждите ответа сервиса.",
      ],
    },
    {
      h: "Кто может пользоваться",
      p: [
        "Сервис предназначен для совершеннолетних. Медицинскую карту ребёнка может вести только его родитель или законный представитель.",
      ],
    },
    {
      h: "Что вы обязуетесь делать",
      p: [
        "Указывать достоверные данные о себе — от этого напрямую зависит качество ответов.",
        "Не использовать сервис вместо экстренной помощи.",
        "Не пытаться получить через сервис назначение рецептурных препаратов или их дозировок.",
      ],
    },
    {
      h: "Информация об аптеках и врачах",
      p: [
        "Сведения о режиме работы, наличии препаратов, ценах и расписании приёма могут устаревать. Уточняйте их напрямую в аптеке или клинике.",
        "Запись к врачу через сервис является заявкой и подтверждается клиникой отдельно.",
      ],
    },
    {
      h: "Ответственность",
      p: [
        "Сервис предоставляется «как есть». Мы не несём ответственности за решения, принятые на основании справочной информации без консультации врача.",
        "Мы не гарантируем бесперебойной работы и можем изменять или прекращать отдельные функции.",
      ],
    },
    {
      h: "Изменения условий",
      p: [
        "Мы можем обновлять эти условия. Дата последнего обновления указана вверху страницы. Продолжая пользоваться сервисом, вы принимаете новую редакцию.",
      ],
    },
  ],

  uz: [
    {
      h: "MedAI nima",
      p: [
        "MedAI — axborot xizmati. U simptomlarni tushunishga yordam beradi, qaysi mutaxassisga borish kerakligini aytadi, yaqin dorixonalarni ko'rsatadi va dori qabulini eslatadi.",
        "MedAI tibbiyot muassasasi emas va tibbiy xizmat ko'rsatmaydi.",
      ],
    },
    {
      h: "Xizmat shifokor o'rnini bosmaydi",
      p: [
        "Xizmat javoblari ma'lumot xarakterida. Ular tashxis, retsept yoki tibbiy xulosa emas.",
        "Tashxis va davolash haqidagi qarorni faqat shifokor ko'rikdan keyin qabul qiladi.",
        "Shoshilinch holat belgilarida — ko'krak og'rig'i, nafas qisishi, hushdan ketish, kuchli qon ketishi, insult belgilari, tomoq shishi — darhol 103 ga qo'ng'iroq qiling. Xizmat javobini kutmang.",
      ],
    },
    {
      h: "Kim foydalanishi mumkin",
      p: [
        "Xizmat voyaga yetganlar uchun. Bolaning tibbiy kartasini faqat ota-onasi yoki qonuniy vakili yuritishi mumkin.",
      ],
    },
    {
      h: "Siz nimaga rozilik bildirasiz",
      p: [
        "O'zingiz haqingizda to'g'ri ma'lumot kiritishga — javoblar sifati bunga bevosita bog'liq.",
        "Xizmatdan shoshilinch yordam o'rniga foydalanmaslikka.",
        "Xizmat orqali retseptli dorilar yoki ularning dozasini olishga urinmaslikka.",
      ],
    },
    {
      h: "Dorixona va shifokorlar ma'lumoti",
      p: [
        "Ish vaqti, dorilar mavjudligi, narxlar va qabul jadvali eskirgan bo'lishi mumkin. Ularni to'g'ridan-to'g'ri dorixona yoki klinikadan aniqlang.",
        "Xizmat orqali yozilish — bu ariza, uni klinika alohida tasdiqlaydi.",
      ],
    },
    {
      h: "Javobgarlik",
      p: [
        "Xizmat «qanday bo'lsa, shundayligicha» taqdim etiladi. Shifokor maslahatisiz, faqat ma'lumotga tayanib qabul qilingan qarorlar uchun javobgar emasmiz.",
        "Uzluksiz ishlashni kafolatlamaymiz va ayrim funksiyalarni o'zgartirishimiz yoki to'xtatishimiz mumkin.",
      ],
    },
    {
      h: "Shartlarning o'zgarishi",
      p: [
        "Bu shartlarni yangilashimiz mumkin. Oxirgi yangilanish sanasi sahifa yuqorisida. Xizmatdan foydalanishda davom etib, yangi tahrirni qabul qilasiz.",
      ],
    },
  ],

  en: [
    {
      h: "What MedAI is",
      p: [
        "MedAI is an information service. It helps you make sense of symptoms, suggests which specialist to see, shows nearby pharmacies and reminds you to take your medicines.",
        "MedAI is not a medical organisation and does not provide medical services.",
      ],
    },
    {
      h: "The service does not replace a doctor",
      p: [
        "Answers are for information only. They are not a diagnosis, a prescription, or a medical opinion.",
        "Decisions about diagnosis and treatment are made by a doctor after an in-person examination.",
        "With signs of an emergency — chest pain, breathing difficulty, loss of consciousness, heavy bleeding, stroke signs, throat swelling — call 103 immediately. Do not wait for the service to answer.",
      ],
    },
    {
      h: "Who may use it",
      p: [
        "The service is intended for adults. A child's health card may only be kept by a parent or legal guardian.",
      ],
    },
    {
      h: "What you agree to",
      p: [
        "To provide accurate information about yourself — answer quality depends on it directly.",
        "Not to use the service instead of emergency care.",
        "Not to seek prescription medicines or their dosages through the service.",
      ],
    },
    {
      h: "Pharmacy and doctor information",
      p: [
        "Opening hours, stock, prices and appointment times may be out of date. Confirm them with the pharmacy or clinic directly.",
        "A booking made through the service is a request and is confirmed separately by the clinic.",
      ],
    },
    {
      h: "Liability",
      p: [
        "The service is provided as is. We are not responsible for decisions made on the basis of reference information without consulting a doctor.",
        "We do not guarantee uninterrupted operation and may change or discontinue individual features.",
      ],
    },
    {
      h: "Changes to these terms",
      p: [
        "We may update these terms. The date of the latest update is shown at the top of this page. By continuing to use the service you accept the new version.",
      ],
    },
  ],
};

export const PRIVACY = {
  ru: [
    {
      h: "Коротко",
      p: [
        "Медицинская карта, лекарства, история диалогов и настройки хранятся в вашем браузере, на вашем устройстве. Мы не храним их у себя.",
        "Когда вы задаёте вопрос ассистенту, текст вопроса вместе с данными медкарты передаётся поставщику ИИ-модели, чтобы получить ответ. Без этого сервис работать не может.",
      ],
    },
    {
      h: "Что хранится на устройстве",
      p: [
        "Имя, возраст, пол, хронические состояния, аллергии и постоянные лекарства — то, что вы сами указали.",
        "Добавленные лекарства и отметки о приёме.",
        "История диалогов с ассистентом.",
        "Язык интерфейса, тема оформления, записи к врачам.",
      ],
    },
    {
      h: "Что передаётся при запросе",
      p: [
        "Текст вашего вопроса и предыдущие сообщения этого диалога.",
        "Данные медкарты — возраст, пол, хронические состояния, аллергии, постоянные лекарства. Они нужны, чтобы ответ учитывал вашу ситуацию.",
        "Фотография, если вы её приложили.",
        "Мы не передаём ваше имя, email и номер телефона.",
      ],
    },
    {
      h: "Геолокация",
      p: [
        "Местоположение запрашивается только по нажатию кнопки на странице аптек и используется на устройстве, чтобы отсортировать аптеки по расстоянию. Мы его не сохраняем и никуда не отправляем.",
      ],
    },
    {
      h: "Ваши права",
      p: [
        "Выгрузить все свои данные одним файлом: Профиль → Скачать мои данные.",
        "Удалить всё без остатка: Профиль → Удалить все данные. Удаление необратимо.",
        "Очистка данных сайта в браузере также удаляет всё.",
      ],
    },
    {
      h: "Что мы не делаем",
      p: [
        "Не продаём и не передаём ваши данные третьим лицам в рекламных целях.",
        "Не используем сторонние рекламные трекеры.",
        "Не строим профиль для показа рекламы.",
      ],
    },
    {
      h: "Обращения",
      p: ["По вопросам о данных напишите нам на адрес, указанный в конце страницы."],
    },
  ],

  uz: [
    {
      h: "Qisqacha",
      p: [
        "Tibbiy karta, dorilar, suhbatlar tarixi va sozlamalar brauzeringizda, o'z qurilmangizda saqlanadi. Biz ularni o'zimizda saqlamaymiz.",
        "Assistentga savol berganingizda, savol matni tibbiy karta ma'lumotlari bilan birga javob olish uchun AI model provayderiga yuboriladi. Busiz xizmat ishlay olmaydi.",
      ],
    },
    {
      h: "Qurilmada nima saqlanadi",
      p: [
        "Ism, yosh, jins, surunkali kasalliklar, allergiya va doimiy dorilar — o'zingiz kiritgan ma'lumotlar.",
        "Qo'shilgan dorilar va qabul belgilari.",
        "Assistent bilan suhbatlar tarixi.",
        "Interfeys tili, mavzu, shifokorga yozilishlar.",
      ],
    },
    {
      h: "So'rov paytida nima yuboriladi",
      p: [
        "Savolingiz matni va shu suhbatdagi oldingi xabarlar.",
        "Tibbiy karta ma'lumotlari — yosh, jins, surunkali kasalliklar, allergiya, doimiy dorilar. Javob sizning holatingizni hisobga olishi uchun kerak.",
        "Agar ilova qilgan bo'lsangiz — rasm.",
        "Ismingiz, email va telefon raqamingiz yuborilmaydi.",
      ],
    },
    {
      h: "Joylashuv",
      p: [
        "Joylashuv faqat dorixonalar sahifasidagi tugmani bosganingizda so'raladi va dorixonalarni masofa bo'yicha saralash uchun qurilmada ishlatiladi. Biz uni saqlamaymiz va hech qayerga yubormaymiz.",
      ],
    },
    {
      h: "Sizning huquqlaringiz",
      p: [
        "Barcha ma'lumotlaringizni bitta fayl qilib yuklab olish: Profil → Ma'lumotlarni yuklab olish.",
        "Hammasini butunlay o'chirish: Profil → Hamma narsani o'chirish. O'chirish qaytarilmaydi.",
        "Brauzerda sayt ma'lumotlarini tozalash ham hammasini o'chiradi.",
      ],
    },
    {
      h: "Biz nima qilmaymiz",
      p: [
        "Ma'lumotlaringizni reklama maqsadida sotmaymiz va uchinchi shaxslarga bermaymiz.",
        "Uchinchi tomon reklama treyserlaridan foydalanmaymiz.",
        "Reklama ko'rsatish uchun profil tuzmaymiz.",
      ],
    },
    {
      h: "Murojaatlar",
      p: ["Ma'lumotlar bo'yicha savollar uchun sahifa oxirida ko'rsatilgan manzilga yozing."],
    },
  ],

  en: [
    {
      h: "In short",
      p: [
        "Your health card, medicines, chat history and settings are stored in your browser, on your device. We do not keep them.",
        "When you ask the assistant a question, the text of that question together with your health-card data is sent to the AI model provider in order to produce an answer. The service cannot work otherwise.",
      ],
    },
    {
      h: "What is stored on your device",
      p: [
        "Name, age, sex, chronic conditions, allergies and regular medicines — whatever you entered.",
        "Medicines you added and your dose check-offs.",
        "Your chat history with the assistant.",
        "Interface language, theme, doctor bookings.",
      ],
    },
    {
      h: "What is sent with a request",
      p: [
        "The text of your question and the earlier messages of that conversation.",
        "Health-card data — age, sex, chronic conditions, allergies, regular medicines. This is what lets the answer account for your situation.",
        "A photograph, if you attached one.",
        "We do not send your name, email or phone number.",
      ],
    },
    {
      h: "Location",
      p: [
        "Location is requested only when you press the button on the pharmacies page, and is used on your device to sort pharmacies by distance. We neither store it nor send it anywhere.",
      ],
    },
    {
      h: "Your rights",
      p: [
        "Export all your data as one file: Profile → Download my data.",
        "Erase everything: Profile → Erase everything. Deletion is permanent.",
        "Clearing site data in your browser also erases everything.",
      ],
    },
    {
      h: "What we do not do",
      p: [
        "We do not sell or share your data with third parties for advertising.",
        "We do not use third-party advertising trackers.",
        "We do not build a profile of you to show ads.",
      ],
    },
    {
      h: "Contact",
      p: ["For questions about your data, write to the address at the bottom of this page."],
    },
  ],
};
