/* Данные салона для приложения — собрано tools/clientapp.mjs из site.json. Правки — в site.json (business, services, booking.masters, app) и пересборка. */
window.APP = {
 "slug": "mramor-app",
 "name": "Мрамор",
 "address": "ул. Дубровинского, 110, Красноярск",
 "phone": "+7 900 000-00-00",
 "site": "../",
 "demo": true,
 "hours": {
  "0": [
   "09:00",
   "20:00"
  ],
  "1": [
   "07:00",
   "22:00"
  ],
  "2": [
   "07:00",
   "22:00"
  ],
  "3": [
   "07:00",
   "22:00"
  ],
  "4": [
   "07:00",
   "22:00"
  ],
  "5": [
   "07:00",
   "22:00"
  ],
  "6": [
   "09:00",
   "20:00"
  ]
 },
 "services": [
  {
   "id": "s1",
   "name": "Пробное занятие",
   "duration": 60,
   "price": 1500,
   "from": false
  },
  {
   "id": "s2",
   "name": "Групповое занятие",
   "duration": 60,
   "price": 1800,
   "from": false
  },
  {
   "id": "s3",
   "name": "Абонемент на 8 занятий",
   "duration": 30,
   "price": 12800,
   "from": false
  },
  {
   "id": "s4",
   "name": "Абонемент на 12 занятий",
   "duration": 30,
   "price": 17400,
   "from": false
  },
  {
   "id": "s5",
   "name": "Персональное занятие",
   "duration": 60,
   "price": 4200,
   "from": false
  },
  {
   "id": "s6",
   "name": "Занятие вдвоём",
   "duration": 60,
   "price": 5600,
   "from": false
  },
  {
   "id": "s7",
   "name": "Пилатес для спины",
   "duration": 60,
   "price": 2200,
   "from": false
  },
  {
   "id": "s8",
   "name": "Пилатес для беременных",
   "duration": 60,
   "price": 2000,
   "from": false
  }
 ],
 "masters": [
  {
   "id": "m1",
   "name": "Дарья",
   "role": "Тренер групп, пилатес для спины",
   "services": [
    "s1",
    "s2",
    "s7",
    "s8"
   ],
   "days": null
  },
  {
   "id": "m2",
   "name": "Полина",
   "role": "Персональные занятия",
   "services": [
    "s1",
    "s5",
    "s6",
    "s8"
   ],
   "days": null
  }
 ],
 "photos": [
  "assets/img/woman-does-a-pilates-exercise-cZ0WYsBF.webp",
  "assets/img/pilates-reformer-with-padded-headrest-bP9Ckw-g.webp",
  "assets/img/a-room-filled-with-lots-7UoAoaVV.webp"
 ],
 "promos": [
  {
   "tag": "Демо-акция",
   "title": "Утренние группы −15%",
   "text": "Будни, занятия в 7:00 и 8:00",
   "more": "Пример акции. Настоящие условия — в настройках приложения.",
   "photo": "assets/img/a-room-filled-with-lots-7UoAoaVV.webp"
  },
  {
   "tag": "Новым",
   "title": "Пробное занятие за 1 500 ₽",
   "text": "С разбором осанки и планом занятий",
   "photo": "assets/img/woman-does-a-pilates-exercise-cZ0WYsBF.webp"
  },
  {
   "tag": "Демо-акция",
   "title": "Абонемент вдвоём",
   "text": "Приведите подругу: второй абонемент −20%",
   "photo": "assets/img/pilates-reformer-with-padded-headrest-bP9Ckw-g.webp"
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
  "gift": "Подарите занятие пилатесом",
  "friendTo": "подруге",
  "friendAcc": "подругу",
  "him": "Ей",
  "his": "её",
  "placeTo": "в студию",
  "placeBy": "студией",
  "demoName": "Анна",
  "s1": "Подарочный",
  "toLabel": "Имя получательницы",
  "toExample": "Маша"
 },
 "hero": "assets/img/woman-performs-pilates-on-a-lKe5jm-S.webp",
 "mark": "",
 "whatsapp": "79000000000",
 "review": ""
};
