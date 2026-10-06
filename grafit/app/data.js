/* Данные салона для приложения — собрано tools/clientapp.mjs из site.json. Правки — в site.json (business, services, booking.masters, app) и пересборка. */
window.APP = {
 "slug": "grafit-app",
 "name": "Графит",
 "address": "пр. Мира, 140, Красноярск",
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
   "name": "Стрижка",
   "duration": 60,
   "price": 1100,
   "from": true
  },
  {
   "id": "s2",
   "name": "Фейд",
   "duration": 60,
   "price": 900,
   "from": true
  },
  {
   "id": "s3",
   "name": "Удлинённая стрижка",
   "duration": 60,
   "price": 1850,
   "from": true
  },
  {
   "id": "s4",
   "name": "Стрижка машинкой",
   "duration": 30,
   "price": 650,
   "from": true
  },
  {
   "id": "s5",
   "name": "Моделирование бороды",
   "duration": 60,
   "price": 1200,
   "from": true
  },
  {
   "id": "s6",
   "name": "Комплекс: стрижка и борода",
   "duration": 90,
   "price": 2000,
   "from": true
  },
  {
   "id": "s7",
   "name": "Бритьё лица или головы",
   "duration": 60,
   "price": 1550,
   "from": true
  },
  {
   "id": "s8",
   "name": "Детская стрижка",
   "duration": 60,
   "price": 1450,
   "from": true
  },
  {
   "id": "s9",
   "name": "Отец и сын",
   "duration": 90,
   "price": 2000,
   "from": true
  },
  {
   "id": "s10",
   "name": "Окантовка триммером",
   "duration": 30,
   "price": 550,
   "from": true
  }
 ],
 "masters": [
  {
   "id": "m1",
   "name": "Роман Белов",
   "role": "Высший уровень",
   "services": [
    "s3",
    "s2",
    "s4",
    "s5",
    "s6",
    "s7",
    "s8",
    "s9",
    "s10"
   ],
   "days": null
  },
  {
   "id": "m2",
   "name": "Кирилл Зуев",
   "role": "Основной уровень",
   "services": null,
   "days": null
  },
  {
   "id": "m3",
   "name": "Матвей Гусев",
   "role": "Доступные цены",
   "services": [
    "s1",
    "s2",
    "s4",
    "s6",
    "s9",
    "s10"
   ],
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
 "kind": "Барбершоп",
 "telegram": "https://t.me/grafit_demo",
 "max": "https://max.ru/u/grafit_demo",
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
