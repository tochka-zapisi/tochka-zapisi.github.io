/* Данные салона для приложения — собрано tools/clientapp.mjs из site.json. Правки — в site.json (business, services, booking.masters, app) и пересборка. */
window.APP = {
 "slug": "bronza-app",
 "name": "Бронза",
 "address": "ул. Весны, 100, Красноярск",
 "phone": "+7 900 000-00-00",
 "site": "../",
 "demo": true,
 "hours": {
  "0": [
   "10:00",
   "21:00"
  ],
  "1": [
   "10:00",
   "21:00"
  ],
  "2": [
   "10:00",
   "21:00"
  ],
  "3": [
   "10:00",
   "21:00"
  ],
  "4": [
   "10:00",
   "21:00"
  ],
  "5": [
   "10:00",
   "21:00"
  ],
  "6": [
   "10:00",
   "21:00"
  ]
 },
 "services": [
  {
   "id": "s1",
   "name": "Стрижка любой сложности",
   "duration": 60,
   "price": 1650,
   "from": true
  },
  {
   "id": "s2",
   "name": "Фейд",
   "duration": 60,
   "price": 1300,
   "from": true
  },
  {
   "id": "s3",
   "name": "Стрижка машинкой",
   "duration": 30,
   "price": 1100,
   "from": true
  },
  {
   "id": "s4",
   "name": "Детская стрижка",
   "duration": 60,
   "price": 1450,
   "from": true
  },
  {
   "id": "s5",
   "name": "Отец + сын",
   "duration": 90,
   "price": 2850,
   "from": true
  },
  {
   "id": "s6",
   "name": "Оформление бороды",
   "duration": 30,
   "price": 1200,
   "from": true
  },
  {
   "id": "s7",
   "name": "Борода с моделированием",
   "duration": 60,
   "price": 1750,
   "from": true
  },
  {
   "id": "s8",
   "name": "Чистое бритьё лица бритвой",
   "duration": 60,
   "price": 1650,
   "from": true
  },
  {
   "id": "s9",
   "name": "Бритьё головы бритвой",
   "duration": 60,
   "price": 1650,
   "from": true
  },
  {
   "id": "s10",
   "name": "Стрижка + оформление бороды",
   "duration": 90,
   "price": 2550,
   "from": true
  },
  {
   "id": "s11",
   "name": "Уход за кожей лица",
   "duration": 30,
   "price": 1300,
   "from": true
  },
  {
   "id": "s12",
   "name": "Укладка или окантовка",
   "duration": 30,
   "price": 650,
   "from": false
  }
 ],
 "masters": [
  {
   "id": "m1",
   "name": "Барбер 1",
   "role": "Барбер",
   "services": null,
   "days": null
  },
  {
   "id": "m2",
   "name": "Барбер 2",
   "role": "Барбер",
   "services": null,
   "days": null
  },
  {
   "id": "m3",
   "name": "Барбер 3",
   "role": "Барбер",
   "services": null,
   "days": null
  }
 ],
 "photos": [
  "assets/img/man-in-white-dress-shirt-m21YynrK.webp",
  "assets/img/man-in-black-and-white-Sb5TuW7N.webp",
  "assets/img/a-man-getting-his-hair-iDbTDUzQ.webp"
 ],
 "promos": [
  {
   "tag": "Демо-акция",
   "title": "Утро будней −15%",
   "text": "На любые услуги до 12:00 по будням",
   "more": "Пример акции. Настоящие условия — в настройках приложения.",
   "photo": "assets/img/man-in-white-dress-shirt-m21YynrK.webp"
  },
  {
   "tag": "Новым",
   "title": "500 бонусов на первый визит",
   "text": "Скачайте приложение и запишитесь онлайн",
   "photo": "assets/img/man-in-black-and-white-Sb5TuW7N.webp"
  },
  {
   "tag": "Демо-акция",
   "title": "Стрижка + борода",
   "text": "Комплекс — выгоднее, чем по отдельности",
   "photo": "assets/img/a-man-getting-his-hair-iDbTDUzQ.webp"
  }
 ],
 "bonus": {
  "welcome": 500,
  "maxPay": 30,
  "referral": 500,
  "levels": [
   {
    "name": "Silver",
    "from": 0,
    "rate": 5
   },
   {
    "name": "Gold",
    "from": 5,
    "rate": 7
   },
   {
    "name": "Platinum",
    "from": 12,
    "rate": 10
   }
  ]
 },
 "kind": "Барбершоп",
 "telegram": "https://t.me/bronza_demo",
 "max": "https://max.ru/u/bronza_demo",
 "words": {
  "gift": "Подарите стрижку",
  "friendTo": "другу",
  "friendAcc": "друга",
  "him": "Ему",
  "his": "его",
  "placeTo": "в барбершоп",
  "placeBy": "барбершопом",
  "demoName": "Артём",
  "s1": "Фирменный",
  "toLabel": "Имя получателя",
  "toExample": "Саша"
 },
 "hero": "assets/img/black-leather-barber-chair-near-EW_rqoSd.webp",
 "mark": "",
 "whatsapp": "79000000000",
 "review": ""
};
