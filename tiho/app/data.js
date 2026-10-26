/* Данные салона для приложения — собрано tools/clientapp.mjs из site.json. Правки — в site.json (business, services, booking.masters, app) и пересборка. */
window.APP = {
 "slug": "--app",
 "name": "Тихо",
 "address": "ул. Ленина, 112 (демо), Красноярск",
 "phone": "+7 900 000-00-00",
 "site": "../",
 "demo": true,
 "greet": "Добрый вечер",
 "hours": {
  "0": [
   "10:00",
   "23:00"
  ],
  "1": [
   "10:00",
   "23:00"
  ],
  "2": [
   "10:00",
   "23:00"
  ],
  "3": [
   "10:00",
   "23:00"
  ],
  "4": [
   "10:00",
   "23:00"
  ],
  "5": [
   "10:00",
   "23:00"
  ],
  "6": [
   "10:00",
   "23:00"
  ]
 },
 "services": [
  {
   "id": "s1",
   "name": "СПА для двоих «Двое и пар»",
   "duration": 90,
   "price": 4900,
   "from": false,
   "term": "75 мин"
  },
  {
   "id": "s2",
   "name": "СПА для двоих «Тёплый вечер»",
   "duration": 90,
   "price": 5000,
   "from": false,
   "term": "85 мин"
  },
  {
   "id": "s3",
   "name": "СПА для двоих «Тихо вдвоём»",
   "duration": 120,
   "price": 6400,
   "from": false,
   "term": "95 мин"
  },
  {
   "id": "s4",
   "name": "СПА для двоих «Медленно»",
   "duration": 120,
   "price": 7300,
   "from": false,
   "term": "110 мин"
  },
  {
   "id": "s5",
   "name": "СПА для двоих «Уютный вечер»",
   "duration": 150,
   "price": 8400,
   "from": false,
   "term": "125 мин"
  },
  {
   "id": "s6",
   "name": "СПА для двоих «Блаженство»",
   "duration": 150,
   "price": 8500,
   "from": false,
   "term": "125 мин"
  },
  {
   "id": "s7",
   "name": "СПА для двоих «Роскошное время»",
   "duration": 180,
   "price": 12600,
   "from": false,
   "term": "180 мин"
  },
  {
   "id": "s8",
   "name": "Общий (проминающий) массаж тела",
   "duration": 60,
   "price": 2450,
   "from": false,
   "term": "60 мин"
  },
  {
   "id": "s9",
   "name": "Релаксирующий массаж тела",
   "duration": 60,
   "price": 2150,
   "from": false,
   "term": "60 мин"
  },
  {
   "id": "s10",
   "name": "Общий массаж + лицо и голова",
   "duration": 120,
   "price": 4550,
   "from": false,
   "term": "120 мин"
  },
  {
   "id": "s11",
   "name": "Массаж с горячими камнями",
   "duration": 60,
   "price": 2450,
   "from": false,
   "term": "60 мин"
  },
  {
   "id": "s12",
   "name": "Медовый массаж тела",
   "duration": 60,
   "price": 2550,
   "from": false,
   "term": "60 мин"
  },
  {
   "id": "s13",
   "name": "Спортивный массаж тела",
   "duration": 60,
   "price": 2550,
   "from": false,
   "term": "60 мин"
  },
  {
   "id": "s14",
   "name": "Лимфодренажный массаж",
   "duration": 60,
   "price": 2550,
   "from": false,
   "term": "60 мин"
  },
  {
   "id": "s15",
   "name": "Антицеллюлитный массаж (ручной)",
   "duration": 60,
   "price": 2550,
   "from": false,
   "term": "60 мин"
  },
  {
   "id": "s16",
   "name": "Комплексный массаж лица и тела",
   "duration": 90,
   "price": 3250,
   "from": false,
   "term": "90 мин"
  },
  {
   "id": "s17",
   "name": "Массаж лица и головы",
   "duration": 60,
   "price": 2450,
   "from": false,
   "term": "60 мин"
  },
  {
   "id": "s18",
   "name": "Спина + шейно-воротниковая зона",
   "duration": 60,
   "price": 2450,
   "from": false,
   "term": "60 мин"
  },
  {
   "id": "s19",
   "name": "Массаж спины",
   "duration": 60,
   "price": 1800,
   "from": false,
   "term": "45 мин"
  },
  {
   "id": "s20",
   "name": "Массаж шейно-воротниковой зоны",
   "duration": 30,
   "price": 1250,
   "from": false,
   "term": "30 мин"
  },
  {
   "id": "s21",
   "name": "Массаж ног",
   "duration": 30,
   "price": 1250,
   "from": false,
   "term": "30 мин"
  },
  {
   "id": "s22",
   "name": "Бережный массаж для беременных",
   "duration": 60,
   "price": 2650,
   "from": false,
   "term": "60 мин"
  },
  {
   "id": "s23",
   "name": "Кедровая фитобочка",
   "duration": 30,
   "price": 750,
   "from": false,
   "term": "20 мин"
  },
  {
   "id": "s24",
   "name": "Финская сауна",
   "duration": 30,
   "price": 750,
   "from": false,
   "term": "20 мин"
  },
  {
   "id": "s25",
   "name": "Скрабирование тела",
   "duration": 30,
   "price": 1050,
   "from": false,
   "term": "20 мин"
  },
  {
   "id": "s26",
   "name": "Обёртывание, горячее или холодное",
   "duration": 30,
   "price": 1050,
   "from": false,
   "term": "25 мин"
  },
  {
   "id": "s27",
   "name": "Массаж головы «экспресс»",
   "duration": 30,
   "price": 450,
   "from": false,
   "term": "15 мин"
  },
  {
   "id": "s28",
   "name": "Массаж лица «экспресс»",
   "duration": 30,
   "price": 450,
   "from": false,
   "term": "15 мин"
  },
  {
   "id": "s29",
   "name": "Тканевая маска для лица",
   "duration": 30,
   "price": 450,
   "from": false,
   "term": "10 мин"
  },
  {
   "id": "s30",
   "name": "Массаж с домашним мёдом",
   "duration": 30,
   "price": 350,
   "from": false,
   "term": "15 мин"
  },
  {
   "id": "s31",
   "name": "Баттер для тела вместо масла",
   "duration": 30,
   "price": 250,
   "from": false,
   "term": "5 мин"
  },
  {
   "id": "s32",
   "name": "Банки во время массажа",
   "duration": 30,
   "price": 150,
   "from": false,
   "term": "5 мин"
  }
 ],
 "masters": [
  {
   "id": "m1",
   "name": "Ольга Т.",
   "role": "Мастер-преподаватель",
   "services": null,
   "days": null
  },
  {
   "id": "m2",
   "name": "Илья С.",
   "role": "Мастер, спортивный массаж",
   "services": null,
   "days": null
  },
  {
   "id": "m3",
   "name": "Вера Н.",
   "role": "Мастер, спа-эстетист",
   "services": null,
   "days": null
  },
  {
   "id": "m4",
   "name": "Роман К.",
   "role": "Мастер, спа-эстетист",
   "services": null,
   "days": null
  },
  {
   "id": "m5",
   "name": "Дарья М.",
   "role": "Мастер, спа-эстетист",
   "services": null,
   "days": null
  },
  {
   "id": "m6",
   "name": "Ян Л.",
   "role": "Мастер, спа-эстетист",
   "services": null,
   "days": null
  }
 ],
 "photos": [
  "assets/img/stock/a-glass-mug-filled-with-O7sKj9cj.webp",
  "assets/img/stock/white-and-black-round-table-AV0KNliG.webp",
  "assets/img/stock/candle-and-dried-flowers-in-pNFmIL2F.webp",
  "assets/img/stock/an-overhead-view-of-a-PiVZUFps.webp",
  "assets/img/stock/close-up-of-sauna-stones-6lYjzIko.webp",
  "assets/img/stock/white-ceramic-mug-with-brown-6LjKkxNs.webp",
  "assets/img/stock/a-vase-with-dried-flowers-RZ_i2lmp.webp",
  "assets/img/stock/two-candles-flank-a-vase-IXPwBIaq.webp"
 ],
 "promos": [
  {
   "tag": "Впервые у нас",
   "title": "Первый сеанс — 1 750 ₽",
   "text": "Час массажа в будни при онлайн-записи",
   "photo": "assets/img/stock/brown-wooden-table-on-brown-FOF-epMl.webp"
  },
  {
   "tag": "Курсом выгоднее",
   "title": "Курс массажа −15 %",
   "text": "Пять сеансов со скидкой",
   "photo": "assets/img/stock/candle-and-dried-flowers-in-pNFmIL2F.webp"
  },
  {
   "tag": "В подарок",
   "title": "Чай с мёдом",
   "text": "После любого сеанса — 15 минут тишины",
   "photo": "assets/img/stock/an-overhead-view-of-a-PiVZUFps.webp"
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
 "telegram": "https://t.me/tiho_demo",
 "max": "https://max.ru/u/tiho_demo",
 "words": {
  "s1": "Час тишины",
  "s2": "Вечер для двоих",
  "s3": "Роскошное время"
 },
 "hero": "assets/img/stock/a-massage-table-with-a-JnsuyfJr.webp",
 "mark": "",
 "whatsapp": "79000000000",
 "review": ""
};
