/* Данные салона для приложения — собрано tools/clientapp.mjs из site.json. Правки — в site.json (business, services, booking.masters, app) и пересборка. */
window.APP = {
 "slug": "expert-app",
 "name": "Эксперт",
 "address": "ул. Карамзина, 18, Красноярск",
 "phone": "+7 391 214-87-97",
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
   "name": "Стрижка",
   "duration": 60,
   "price": 1000,
   "from": true
  },
  {
   "id": "s2",
   "name": "Фейд",
   "duration": 60,
   "price": 800,
   "from": true
  },
  {
   "id": "s3",
   "name": "Удлинённая стрижка",
   "duration": 60,
   "price": 1700,
   "from": true
  },
  {
   "id": "s4",
   "name": "Стрижка машинкой",
   "duration": 30,
   "price": 600,
   "from": true
  },
  {
   "id": "s5",
   "name": "Моделирование бороды",
   "duration": 60,
   "price": 1100,
   "from": true
  },
  {
   "id": "s6",
   "name": "Комплекс: стрижка и борода",
   "duration": 90,
   "price": 1800,
   "from": true
  },
  {
   "id": "s7",
   "name": "Бритьё лица или головы",
   "duration": 60,
   "price": 1400,
   "from": true
  },
  {
   "id": "s8",
   "name": "Детская стрижка",
   "duration": 60,
   "price": 1300,
   "from": true
  },
  {
   "id": "s9",
   "name": "Отец и сын",
   "duration": 90,
   "price": 1800,
   "from": true
  },
  {
   "id": "s10",
   "name": "Окантовка триммером",
   "duration": 30,
   "price": 500,
   "from": true
  }
 ],
 "masters": [
  {
   "id": "m1",
   "name": "Старший барбер",
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
   "name": "Барбер",
   "role": "Основной уровень",
   "services": null,
   "days": null
  },
  {
   "id": "m3",
   "name": "Младший барбер",
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
  "assets/img/a-barber-shop-with-a-BBGyxhtP-portrait.webp",
  "assets/img/a-barber-shop-with-a-BBGyxhtP.webp",
  "assets/img/a-black-and-white-photo-sqtcS14C.webp",
  "assets/img/a-close-up-of-a-3D6AiPBl.webp",
  "assets/img/clipper-bw.webp",
  "assets/img/grayscale-photo-of-man-shaving-Twd3yaqA.webp",
  "assets/img/person-using-white-hair-clipper-m4Pd_e-4.webp",
  "assets/img/razor-bw.webp"
 ],
 "promos": [
  {
   "tag": "Демо-акция",
   "title": "Утро будней −15%",
   "text": "На любые услуги до 12:00 по будням",
   "more": "Пример акции. Настоящие условия — в настройках приложения.",
   "photo": "assets/img/a-barber-shop-with-a-BBGyxhtP-portrait.webp"
  },
  {
   "tag": "Новым",
   "title": "500 бонусов на первый визит",
   "text": "Скачайте приложение и запишитесь онлайн",
   "photo": "assets/img/a-barber-shop-with-a-BBGyxhtP.webp"
  },
  {
   "tag": "Демо-акция",
   "title": "Стрижка + борода",
   "text": "Комплекс — выгоднее, чем по отдельности",
   "photo": "assets/img/a-black-and-white-photo-sqtcS14C.webp"
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
