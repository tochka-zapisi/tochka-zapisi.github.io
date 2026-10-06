/* Данные салона для приложения — собрано tools/clientapp.mjs из site.json. Правки — в site.json (business, services, booking.masters, app) и пересборка. */
window.APP = {
 "slug": "mod-app",
 "name": "Mod",
 "address": "ул. Алексеева, 48а, Красноярск",
 "phone": "+7 906 914-62-42",
 "site": "",
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
   "price": 1500,
   "from": true
  },
  {
   "id": "s2",
   "name": "Фейд",
   "duration": 60,
   "price": 1200,
   "from": true
  },
  {
   "id": "s3",
   "name": "Стрижка машинкой",
   "duration": 30,
   "price": 1000,
   "from": true
  },
  {
   "id": "s4",
   "name": "Детская стрижка",
   "duration": 60,
   "price": 1300,
   "from": true
  },
  {
   "id": "s5",
   "name": "Отец + сын",
   "duration": 90,
   "price": 2600,
   "from": true
  },
  {
   "id": "s6",
   "name": "Оформление бороды",
   "duration": 30,
   "price": 1100,
   "from": true
  },
  {
   "id": "s7",
   "name": "Борода «Graham Hill»",
   "duration": 60,
   "price": 1600,
   "from": true
  },
  {
   "id": "s8",
   "name": "Чистое бритьё лица бритвой",
   "duration": 60,
   "price": 1500,
   "from": true
  },
  {
   "id": "s9",
   "name": "Бритьё головы бритвой",
   "duration": 60,
   "price": 1500,
   "from": true
  },
  {
   "id": "s10",
   "name": "Стрижка + оформление бороды",
   "duration": 90,
   "price": 2300,
   "from": true
  },
  {
   "id": "s11",
   "name": "Уход за кожей лица «Volcano»",
   "duration": 30,
   "price": 1200,
   "from": true
  },
  {
   "id": "s12",
   "name": "Укладка или окантовка",
   "duration": 30,
   "price": 600,
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
  "assets/img/a-man-getting-his-hair-iDbTDUzQ.webp",
  "assets/img/black-leather-barber-chair-near-EW_rqoSd-portrait.webp",
  "assets/img/black-leather-barber-chair-near-EW_rqoSd.webp",
  "assets/img/man-in-black-and-white-Sb5TuW7N.webp",
  "assets/img/man-in-white-dress-shirt-m21YynrK.webp"
 ],
 "promos": [
  {
   "tag": "Демо-акция",
   "title": "Утро будней −15%",
   "text": "На любые услуги до 12:00 по будням",
   "more": "Пример акции. Настоящие условия — в настройках приложения.",
   "photo": "assets/img/a-man-getting-his-hair-iDbTDUzQ.webp"
  },
  {
   "tag": "Новым",
   "title": "500 бонусов на первый визит",
   "text": "Скачайте приложение и запишитесь онлайн",
   "photo": "assets/img/black-leather-barber-chair-near-EW_rqoSd-portrait.webp"
  },
  {
   "tag": "Демо-акция",
   "title": "Стрижка + борода",
   "text": "Комплекс — выгоднее, чем по отдельности",
   "photo": "assets/img/black-leather-barber-chair-near-EW_rqoSd.webp"
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
 "telegram": "",
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
 }
};
