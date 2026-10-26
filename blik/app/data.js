/* Данные салона для приложения — собрано tools/clientapp.mjs из site.json. Правки — в site.json (business, services, booking.masters, app) и пересборка. */
window.APP = {
 "slug": "--app",
 "name": "Блик",
 "address": "ул. Партизана Железняка, 40 (демо), Красноярск",
 "phone": "+7 900 000-00-00",
 "site": "../",
 "demo": true,
 "greet": "Добрый день",
 "hours": {
  "0": [
   "09:00",
   "21:00"
  ],
  "1": [
   "09:00",
   "21:00"
  ],
  "2": [
   "09:00",
   "21:00"
  ],
  "3": [
   "09:00",
   "21:00"
  ],
  "4": [
   "09:00",
   "21:00"
  ],
  "5": [
   "09:00",
   "21:00"
  ],
  "6": [
   "09:00",
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
  "assets/img/stock/glyanec-temnota.webp",
  "assets/img/stock/zerkalo.webp",
  "assets/img/stock/boks-pol.webp",
  "assets/img/stock/chernyi-disk.webp",
  "assets/img/stock/a-bunch-of-cars-parked-kCG7CSRY.webp",
  "assets/img/stock/iskry.webp"
 ],
 "promos": [
  {
   "tag": "Демо-акция",
   "title": "Утро будней −15%",
   "text": "На любые услуги до 12:00 по будням",
   "more": "Пример акции. Настоящие условия — в настройках приложения.",
   "photo": "assets/img/stock/glyanec-temnota.webp"
  },
  {
   "tag": "Новым",
   "title": "500 бонусов на первый визит",
   "text": "Скачайте приложение и запишитесь онлайн",
   "photo": "assets/img/stock/zerkalo.webp"
  },
  {
   "tag": "Демо-акция",
   "title": "Полировка + бронь фар",
   "text": "Комплекс — выгоднее, чем по отдельности",
   "photo": "assets/img/stock/boks-pol.webp"
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
 "kind": "Студия защиты и детейлинга",
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
 "telegram": "https://t.me/blik_demo",
 "max": "https://max.ru/u/blik_demo",
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
 "hero": "assets/img/stock/a-dark-sports-car-with-OrSXmPEw.webp",
 "mark": "",
 "whatsapp": "79000000000",
 "review": ""
};
