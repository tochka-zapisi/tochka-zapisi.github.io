/* Данные салона для приложения — собрано tools/clientapp.mjs из site.json. Правки — в site.json (business, services, booking.masters, app) и пересборка. */
window.APP = {
 "slug": "perlamutr-app",
 "name": "Перламутр",
 "address": "ул. Ады Лебедевой, 150, Красноярск",
 "phone": "+7 900 000-00-00",
 "site": "../",
 "demo": true,
 "hours": {
  "0": [
   "10:00",
   "16:00"
  ],
  "1": [
   "09:00",
   "20:00"
  ],
  "2": [
   "09:00",
   "20:00"
  ],
  "3": [
   "09:00",
   "20:00"
  ],
  "4": [
   "09:00",
   "20:00"
  ],
  "5": [
   "09:00",
   "20:00"
  ],
  "6": [
   "09:00",
   "20:00"
  ]
 },
 "services": [
  {
   "id": "s1",
   "name": "Консультация и план лечения",
   "duration": 30,
   "price": 0,
   "from": false
  },
  {
   "id": "s2",
   "name": "Профессиональная гигиена",
   "duration": 60,
   "price": 4500,
   "from": true
  },
  {
   "id": "s3",
   "name": "Лечение кариеса",
   "duration": 60,
   "price": 3900,
   "from": true
  },
  {
   "id": "s4",
   "name": "Лечение каналов",
   "duration": 90,
   "price": 7500,
   "from": true
  },
  {
   "id": "s5",
   "name": "Отбеливание",
   "duration": 90,
   "price": 14000,
   "from": true
  },
  {
   "id": "s6",
   "name": "Коронка из циркония",
   "duration": 30,
   "price": 25000,
   "from": true
  },
  {
   "id": "s7",
   "name": "Имплант под ключ",
   "duration": 30,
   "price": 45000,
   "from": true
  },
  {
   "id": "s8",
   "name": "Удаление зуба",
   "duration": 60,
   "price": 2500,
   "from": true
  },
  {
   "id": "s9",
   "name": "Детский приём",
   "duration": 30,
   "price": 1500,
   "from": true
  }
 ],
 "masters": [
  {
   "id": "m1",
   "name": "Терапевт",
   "role": "Лечение кариеса и каналов",
   "services": [
    "s1",
    "s3",
    "s4",
    "s5"
   ],
   "days": null
  },
  {
   "id": "m2",
   "name": "Ортопед-хирург",
   "role": "Коронки, импланты, удаление",
   "services": [
    "s1",
    "s6",
    "s7",
    "s8"
   ],
   "days": null
  },
  {
   "id": "m3",
   "name": "Гигиенист",
   "role": "Чистка и профилактика",
   "services": [
    "s2",
    "s5"
   ],
   "days": null
  },
  {
   "id": "m4",
   "name": "Детский стоматолог",
   "role": "Дети от 3 лет",
   "services": [
    "s9",
    "s1"
   ],
   "days": null
  }
 ],
 "photos": [
  "assets/img/a-hospital-room-with-medical-yJsMOVwa.webp",
  "assets/img/dentist-showing-a-model-of-SU6EGDd-.webp",
  "assets/img/a-dental-room-with-a-Fdku_oMr.webp"
 ],
 "promos": [
  {
   "tag": "Демо-акция",
   "title": "Гигиена −20% по утрам",
   "text": "Будни до 12:00",
   "more": "Пример акции. Настоящие условия — в настройках приложения.",
   "photo": "assets/img/a-hospital-room-with-medical-yJsMOVwa.webp"
  },
  {
   "tag": "Новым",
   "title": "Консультация и план — бесплатно",
   "text": "Запишитесь онлайн в приложении",
   "photo": "assets/img/dentist-showing-a-model-of-SU6EGDd-.webp"
  },
  {
   "tag": "Демо-акция",
   "title": "Гигиена + отбеливание",
   "text": "Вместе — выгоднее, чем по отдельности",
   "photo": "assets/img/a-dental-room-with-a-Fdku_oMr.webp"
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
  "gift": "Подарите здоровую улыбку",
  "friendTo": "близкому",
  "friendAcc": "близкого",
  "him": "Близкому",
  "his": "его",
  "placeTo": "в клинику",
  "placeBy": "клиникой",
  "demoName": "Ольга",
  "s1": "Подарочный",
  "toLabel": "Имя получателя",
  "toExample": "Мама"
 },
 "hero": "assets/img/a-kitchen-with-a-counter-oLtNPzG0.webp",
 "mark": "",
 "whatsapp": "79000000000",
 "review": ""
};
