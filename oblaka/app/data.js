/* Данные салона для приложения — собрано tools/clientapp.mjs из site.json. Правки — в site.json (business, services, booking.masters, app) и пересборка. */
window.APP = {
 "slug": "oblaka-app",
 "name": "В облаках",
 "address": "ул. Березина, 82д, Красноярск",
 "phone": "+7 950 423-55-45",
 "site": "../",
 "demo": true,
 "greet": "Добрый вечер",
 "hours": {
  "0": [
   "09:00",
   "23:30"
  ],
  "1": [
   "09:00",
   "23:30"
  ],
  "2": [
   "09:00",
   "23:30"
  ],
  "3": [
   "09:00",
   "23:30"
  ],
  "4": [
   "09:00",
   "23:30"
  ],
  "5": [
   "09:00",
   "23:30"
  ],
  "6": [
   "09:00",
   "23:30"
  ]
 },
 "services": [
  {
   "id": "s1",
   "name": "СПА для двоих «Гармония для двоих»",
   "duration": 90,
   "price": 4900,
   "from": false
  },
  {
   "id": "s2",
   "name": "СПА для двоих «Облачное удовольствие»",
   "duration": 90,
   "price": 5000,
   "from": false
  },
  {
   "id": "s3",
   "name": "СПА для двоих «В облаках»",
   "duration": 120,
   "price": 6400,
   "from": false
  },
  {
   "id": "s4",
   "name": "СПА для двоих «Нам хорошо»",
   "duration": 120,
   "price": 7300,
   "from": false
  },
  {
   "id": "s5",
   "name": "СПА для двоих «Уютный вечер в облаках»",
   "duration": 150,
   "price": 8400,
   "from": false
  },
  {
   "id": "s6",
   "name": "СПА для двоих «Блаженство в облаках»",
   "duration": 150,
   "price": 8500,
   "from": false
  },
  {
   "id": "s7",
   "name": "СПА для двоих «Роскошное время»",
   "duration": 180,
   "price": 12600,
   "from": false
  },
  {
   "id": "s8",
   "name": "Общий (проминающий) массаж тела",
   "duration": 60,
   "price": 2450,
   "from": false
  },
  {
   "id": "s9",
   "name": "Релаксирующий массаж тела",
   "duration": 60,
   "price": 2150,
   "from": false
  },
  {
   "id": "s10",
   "name": "Общий массаж + лицо и голова",
   "duration": 120,
   "price": 4550,
   "from": false
  },
  {
   "id": "s11",
   "name": "Массаж с горячими камнями",
   "duration": 60,
   "price": 2450,
   "from": false
  },
  {
   "id": "s12",
   "name": "Медовый массаж тела",
   "duration": 60,
   "price": 2550,
   "from": false
  },
  {
   "id": "s13",
   "name": "Спортивный массаж тела",
   "duration": 60,
   "price": 2550,
   "from": false
  },
  {
   "id": "s14",
   "name": "Лимфодренажный массаж",
   "duration": 60,
   "price": 2550,
   "from": false
  },
  {
   "id": "s15",
   "name": "Антицеллюлитный массаж (ручной)",
   "duration": 60,
   "price": 2550,
   "from": false
  },
  {
   "id": "s16",
   "name": "Комплексный массаж лица и тела",
   "duration": 90,
   "price": 3250,
   "from": false
  },
  {
   "id": "s17",
   "name": "Массаж лица и головы",
   "duration": 60,
   "price": 2450,
   "from": false
  },
  {
   "id": "s18",
   "name": "Спина + шейно-воротниковая зона",
   "duration": 60,
   "price": 2450,
   "from": false
  },
  {
   "id": "s19",
   "name": "Массаж спины",
   "duration": 60,
   "price": 1800,
   "from": false
  },
  {
   "id": "s20",
   "name": "Массаж шейно-воротниковой зоны",
   "duration": 30,
   "price": 1250,
   "from": false
  },
  {
   "id": "s21",
   "name": "Массаж ног",
   "duration": 30,
   "price": 1250,
   "from": false
  },
  {
   "id": "s22",
   "name": "Бережный массаж для беременных",
   "duration": 60,
   "price": 2650,
   "from": false
  },
  {
   "id": "s23",
   "name": "Кедровая фитобочка",
   "duration": 30,
   "price": 750,
   "from": false
  },
  {
   "id": "s24",
   "name": "Финская сауна",
   "duration": 30,
   "price": 750,
   "from": false
  },
  {
   "id": "s25",
   "name": "Скрабирование тела",
   "duration": 30,
   "price": 1050,
   "from": false
  },
  {
   "id": "s26",
   "name": "Обёртывание, горячее или холодное",
   "duration": 30,
   "price": 1050,
   "from": false
  },
  {
   "id": "s27",
   "name": "Массаж головы «экспресс»",
   "duration": 30,
   "price": 450,
   "from": false
  },
  {
   "id": "s28",
   "name": "Массаж лица «экспресс»",
   "duration": 30,
   "price": 450,
   "from": false
  },
  {
   "id": "s29",
   "name": "Тканевая маска для лица",
   "duration": 30,
   "price": 450,
   "from": false
  },
  {
   "id": "s30",
   "name": "Массаж с домашним мёдом",
   "duration": 30,
   "price": 350,
   "from": false
  },
  {
   "id": "s31",
   "name": "Баттер для тела вместо масла",
   "duration": 30,
   "price": 250,
   "from": false
  },
  {
   "id": "s32",
   "name": "Банки во время массажа",
   "duration": 30,
   "price": 150,
   "from": false
  }
 ],
 "masters": [
  {
   "id": "m1",
   "name": "Светлана Т.",
   "role": "Мастер-преподаватель",
   "services": null,
   "days": null
  },
  {
   "id": "m2",
   "name": "Евгений С.",
   "role": "Мастер-преподаватель",
   "services": null,
   "days": null
  },
  {
   "id": "m3",
   "name": "Анна С.",
   "role": "Мастер, спа-эстетист",
   "services": null,
   "days": null
  },
  {
   "id": "m4",
   "name": "Игорь Б.",
   "role": "Мастер, спа-эстетист",
   "services": null,
   "days": null
  },
  {
   "id": "m5",
   "name": "Людмила Г.",
   "role": "Мастер, спа-эстетист",
   "services": null,
   "days": null
  },
  {
   "id": "m6",
   "name": "Денис С.",
   "role": "Мастер, спа-эстетист",
   "services": null,
   "days": null
  },
  {
   "id": "m7",
   "name": "Людмила Б.",
   "role": "Мастер, спа-эстетист",
   "services": null,
   "days": null
  },
  {
   "id": "m8",
   "name": "Татьяна А.",
   "role": "Мастер, спа-эстетист",
   "services": null,
   "days": null
  },
  {
   "id": "m9",
   "name": "Андрей Щ.",
   "role": "Мастер, спа-эстетист",
   "services": null,
   "days": null
  }
 ],
 "photos": [
  "assets/img/real/ob-chay.webp",
  "assets/img/real/ob-zal.webp",
  "assets/img/real/ob-lampa.webp",
  "assets/img/real/ob-podnos.webp",
  "assets/img/real/ob-chasy.webp",
  "assets/img/real/ob-fructy.webp",
  "assets/img/real/ob-cvety.webp",
  "assets/img/real/ob-neon.webp"
 ],
 "promos": [
  {
   "tag": "Впервые у нас",
   "title": "Первый сеанс — 1 650 ₽",
   "text": "Час массажа в будни при онлайн-записи",
   "photo": "assets/img/real/ob-dlya-dvoih-portrait.webp"
  },
  {
   "tag": "Курсом выгоднее",
   "title": "Курс массажа −20 %",
   "text": "Любой курс — от 1 900 ₽ за сеанс",
   "photo": "assets/img/real/ob-lampa.webp"
  },
  {
   "tag": "В подарок",
   "title": "Чай с абрикосовым вареньем",
   "text": "После любого сеанса — 15 минут тишины",
   "photo": "assets/img/real/ob-chay.webp"
  }
 ],
 "bonus": {
  "welcome": 500,
  "maxPay": 30,
  "referral": 500,
  "levels": [
   {
    "name": "Облако",
    "from": 0,
    "rate": 5
   },
   {
    "name": "Седьмое небо",
    "from": 5,
    "rate": 7
   },
   {
    "name": "Девятое небо",
    "from": 12,
    "rate": 10
   }
  ]
 },
 "kind": "Студия массажа и SPA",
 "telegram": "https://t.me/+79535929118",
 "max": "https://max.ru/u/f9LHodD0cOKp4v4Ci2WJ3-4Q5tR6107ZVDVPLfPmeDxANSXexn1eWhEsY60",
 "words": {
  "s1": "Час тишины",
  "s2": "Вечер для двоих",
  "s3": "Роскошное время"
 },
 "hero": "assets/img/real/ob-dlya-dvoih.webp",
 "mark": "",
 "whatsapp": "79504235545",
 "review": "https://2gis.ru/krasnoyarsk/firm/70000001079012214"
};
