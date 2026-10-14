/* Данные салона для приложения — собрано tools/clientapp.mjs из site.json. Правки — в site.json (business, services, booking.masters, app) и пересборка. */
window.APP = {
 "slug": "siberianpro-app",
 "name": "Siberianpro",
 "address": "ул. Мате Залки, 3а, Красноярск",
 "phone": "+7 391 203-89-99",
 "site": "../",
 "demo": true,
 "greet": "Добрый день",
 "hours": {
  "0": [
   "08:00",
   "21:00"
  ],
  "1": [
   "08:00",
   "21:00"
  ],
  "2": [
   "08:00",
   "21:00"
  ],
  "3": [
   "08:00",
   "21:00"
  ],
  "4": [
   "08:00",
   "21:00"
  ],
  "5": [
   "08:00",
   "21:00"
  ],
  "6": [
   "08:00",
   "21:00"
  ]
 },
 "services": [
  {
   "id": "s1",
   "name": "Бронирование кузова",
   "duration": 30,
   "price": 8000,
   "from": true
  },
  {
   "id": "s2",
   "name": "Бронирование фар",
   "duration": 60,
   "price": 6000,
   "from": true,
   "term": "от 1 часа"
  },
  {
   "id": "s3",
   "name": "Бронирование лобового стекла",
   "duration": 120,
   "price": 25000,
   "from": true,
   "term": "от 2 часов"
  },
  {
   "id": "s4",
   "name": "Бронирование салона",
   "duration": 60,
   "price": 4000,
   "from": true,
   "term": "от 1 часа"
  },
  {
   "id": "s5",
   "name": "Оклейка цветным и матовым полиуретаном",
   "duration": 30,
   "price": 170000,
   "from": true,
   "term": "от 1 дня"
  },
  {
   "id": "s6",
   "name": "Полировка кузова",
   "duration": 300,
   "price": 10000,
   "from": true,
   "term": "от 5 часов"
  },
  {
   "id": "s7",
   "name": "Керамическое покрытие",
   "duration": 720,
   "price": 10000,
   "from": true,
   "term": "от 12 часов"
  },
  {
   "id": "s8",
   "name": "Полировка фар",
   "duration": 30,
   "price": 1000,
   "from": true,
   "term": "от 30 минут"
  },
  {
   "id": "s9",
   "name": "Реставрация оптики",
   "duration": 30,
   "price": 8000,
   "from": true
  },
  {
   "id": "s10",
   "name": "Регулировка фар",
   "duration": 60,
   "price": 1000,
   "from": true,
   "term": "от 1 часа"
  },
  {
   "id": "s11",
   "name": "Ремонт кожи",
   "duration": 30,
   "price": 3000,
   "from": true
  },
  {
   "id": "s12",
   "name": "Восстановление пластика салона",
   "duration": 30,
   "price": 3000,
   "from": true
  },
  {
   "id": "s13",
   "name": "Шумоизоляция",
   "duration": 180,
   "price": 3000,
   "from": true,
   "term": "от 3 часов"
  },
  {
   "id": "s14",
   "name": "Антихром",
   "duration": 60,
   "price": 1000,
   "from": true,
   "term": "от 1 часа"
  },
  {
   "id": "s15",
   "name": "Порошковая покраска дисков",
   "duration": 30,
   "price": 18000,
   "from": true,
   "term": "от 2 дней"
  },
  {
   "id": "s16",
   "name": "Покраска суппортов",
   "duration": 30,
   "price": 25000,
   "from": true
  },
  {
   "id": "s17",
   "name": "Выпрямление вмятин без покраски (PDR)",
   "duration": 60,
   "price": 1000,
   "from": true,
   "term": "от 1 часа"
  }
 ],
 "masters": [],
 "photos": [
  "assets/img/real/sp-bentley.webp",
  "assets/img/real/sp-ferrari.webp",
  "assets/img/real/sp-glare.webp",
  "assets/img/real/sp-x5.webp",
  "assets/img/real/sp-xm.webp",
  "assets/img/real/sp-copper.webp",
  "assets/img/real/sp-g.webp",
  "assets/img/real/sp-matte.webp",
  "assets/img/real/sp-audi.webp",
  "assets/img/real/sp-camry.webp",
  "assets/img/real/sp-interior.webp",
  "assets/img/real/sp-moto.webp"
 ],
 "promos": [
  {
   "tag": "Демо-акция",
   "title": "Утро будней −15%",
   "text": "На любые услуги до 12:00 по будням",
   "more": "Пример акции. Настоящие условия — в настройках приложения.",
   "photo": "assets/img/real/sp-bentley.webp"
  },
  {
   "tag": "Новым",
   "title": "500 бонусов на первый визит",
   "text": "Скачайте приложение и запишитесь онлайн",
   "photo": "assets/img/real/sp-ferrari.webp"
  },
  {
   "tag": "Демо-акция",
   "title": "Полировка + бронь фар",
   "text": "Комплекс — выгоднее, чем по отдельности",
   "photo": "assets/img/real/sp-glare.webp"
  }
 ],
 "bonus": {
  "welcome": 500,
  "maxPay": 30,
  "referral": 500,
  "levels": [
   {
    "name": "Свет",
    "from": 0,
    "rate": 5
   },
   {
    "name": "Студия",
    "from": 5,
    "rate": 7
   },
   {
    "name": "Чёрный",
    "from": 12,
    "rate": 10
   }
  ]
 },
 "kind": "Студия оклейки, детейлинга и тюнинга",
 "detailing": true,
 "cars": [
  {
   "id": "c1",
   "make": "BMW",
   "model": "X5",
   "year": 2021,
   "plate": "К 777 КК 124",
   "mileage": 38400,
   "toEvery": 10000,
   "lastTo": 30000
  },
  {
   "id": "c2",
   "make": "Toyota",
   "model": "Land Cruiser 300",
   "year": 2022,
   "plate": "М 001 ММ 124",
   "mileage": 21200,
   "toEvery": 10000,
   "lastTo": 20000
  }
 ],
 "telegram": "https://t.me/+79830708999",
 "max": "https://max.ru/u/f9LHodD0cOIb-dmCioeCac1lY8v54ifhpnbZvl_p18DUh3OEzXGZbHy5Q6c",
 "words": {
  "gift": "Подарите защиту и блеск",
  "friendTo": "другу",
  "friendAcc": "друга",
  "him": "Ему",
  "his": "его",
  "placeTo": "в студию",
  "placeBy": "студией",
  "demoName": "Андрей",
  "s1": "Фирменный",
  "toLabel": "Имя получателя",
  "toExample": "Саша",
  "s2": "Бокс",
  "s3": "Латунь"
 },
 "hero": "assets/img/real/sp-hero.webp",
 "mark": "",
 "whatsapp": "79830708999",
 "review": "https://2gis.ru/krasnoyarsk/firm/70000001036265439"
};
