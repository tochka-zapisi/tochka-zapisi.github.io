/* Данные салона для приложения — собрано tools/clientapp.mjs из site.json. Правки — в site.json (business, services, booking.masters, app) и пересборка. */
window.APP = {
 "slug": "kremen-app",
 "name": "Кремень",
 "address": "ул. Взлётная, 90, Красноярск",
 "phone": "+7 900 000-00-00",
 "site": "../",
 "demo": true,
 "hours": {
  "0": [
   "11:00",
   "22:00"
  ],
  "1": [
   "11:00",
   "22:00"
  ],
  "2": [
   "11:00",
   "22:00"
  ],
  "3": [
   "11:00",
   "22:00"
  ],
  "4": [
   "11:00",
   "22:00"
  ],
  "5": [
   "11:00",
   "22:00"
  ],
  "6": [
   "11:00",
   "22:00"
  ]
 },
 "services": [
  {
   "id": "s1",
   "name": "Мужская стрижка",
   "duration": 60,
   "price": 1550,
   "from": true
  },
  {
   "id": "s2",
   "name": "Стрижка машинкой",
   "duration": 30,
   "price": 1000,
   "from": true
  },
  {
   "id": "s3",
   "name": "Детская стрижка",
   "duration": 60,
   "price": 1200,
   "from": true
  },
  {
   "id": "s4",
   "name": "Борода без распаривания",
   "duration": 30,
   "price": 900,
   "from": true
  },
  {
   "id": "s5",
   "name": "Борода с распариванием",
   "duration": 60,
   "price": 1200,
   "from": true
  },
  {
   "id": "s6",
   "name": "Классическое бритьё",
   "duration": 60,
   "price": 1550,
   "from": true
  },
  {
   "id": "s7",
   "name": "Тонирование головы",
   "duration": 60,
   "price": 1450,
   "from": true
  },
  {
   "id": "s8",
   "name": "Стрижка и борода без распаривания",
   "duration": 90,
   "price": 2200,
   "from": true
  },
  {
   "id": "s9",
   "name": "Стрижка машинкой и борода",
   "duration": 60,
   "price": 1850,
   "from": true
  },
  {
   "id": "s10",
   "name": "Стрижка машинкой и борода с распариванием",
   "duration": 90,
   "price": 2100,
   "from": true
  },
  {
   "id": "s11",
   "name": "Стрижка и тонирование",
   "duration": 90,
   "price": 2950,
   "from": true
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
  "assets/img/grayscale-photo-of-man-shaving-Twd3yaqA.webp",
  "assets/img/razor-bw.webp",
  "assets/img/clipper-bw.webp"
 ],
 "promos": [
  {
   "tag": "Демо-акция",
   "title": "Утро будней −15%",
   "text": "На любые услуги до 12:00 по будням",
   "more": "Пример акции. Настоящие условия — в настройках приложения.",
   "photo": "assets/img/grayscale-photo-of-man-shaving-Twd3yaqA.webp"
  },
  {
   "tag": "Новым",
   "title": "500 бонусов на первый визит",
   "text": "Скачайте приложение и запишитесь онлайн",
   "photo": "assets/img/razor-bw.webp"
  },
  {
   "tag": "Демо-акция",
   "title": "Стрижка + борода",
   "text": "Комплекс — выгоднее, чем по отдельности",
   "photo": "assets/img/clipper-bw.webp"
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
 },
 "hero": "assets/img/a-barber-shop-with-a-BBGyxhtP.webp",
 "mark": "",
 "whatsapp": "79000000000",
 "review": ""
};
