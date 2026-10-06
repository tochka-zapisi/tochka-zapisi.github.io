/* Данные салона для приложения — собрано tools/clientapp.mjs из site.json. Правки — в site.json (business, services, booking.masters, app) и пересборка. */
window.APP = {
 "slug": "kvarc-app",
 "name": "Кварц",
 "address": "ул. 78-й Добровольческой бригады, 12, Красноярск",
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
   "name": "Диагностика",
   "duration": 30,
   "price": 0,
   "from": false
  },
  {
   "id": "s2",
   "name": "Замена экрана iPhone",
   "duration": 60,
   "price": 6900,
   "from": true
  },
  {
   "id": "s3",
   "name": "Замена экрана Android",
   "duration": 60,
   "price": 4500,
   "from": true
  },
  {
   "id": "s4",
   "name": "Замена аккумулятора",
   "duration": 30,
   "price": 2900,
   "from": true
  },
  {
   "id": "s5",
   "name": "Замена разъёма зарядки",
   "duration": 60,
   "price": 2400,
   "from": true
  },
  {
   "id": "s6",
   "name": "Чистка ноутбука и замена термопасты",
   "duration": 30,
   "price": 2500,
   "from": false
  },
  {
   "id": "s7",
   "name": "Замена клавиатуры ноутбука",
   "duration": 30,
   "price": 3500,
   "from": true
  },
  {
   "id": "s8",
   "name": "Восстановление после воды",
   "duration": 30,
   "price": 3000,
   "from": true
  }
 ],
 "masters": [
  {
   "id": "m1",
   "name": "Денис Орлов",
   "role": "смартфоны и планшеты",
   "services": [
    "s1",
    "s2",
    "s3",
    "s4",
    "s5",
    "s8"
   ],
   "days": null
  },
  {
   "id": "m2",
   "name": "Игорь Белов",
   "role": "ноутбуки",
   "services": [
    "s1",
    "s6",
    "s7",
    "s8"
   ],
   "days": null
  }
 ],
 "photos": [
  "assets/img/a-man-working-on-a-KhnRiIAg.webp",
  "assets/img/damaged-iphones-and-repair-tools-B63gJWwd-portrait.webp",
  "assets/img/damaged-iphones-and-repair-tools-B63gJWwd.webp",
  "assets/img/macro-photography-of-black-circuit-FO7JIlwj.webp",
  "assets/img/man-repairing-android-smartphone-K7OUs6y_.webp"
 ],
 "promos": [
  {
   "tag": "Демо-акция",
   "title": "Стекло — в подарок",
   "text": "К замене экрана iPhone",
   "photo": "assets/img/man-repairing-android-smartphone-K7OUs6y_.webp",
   "more": "Пример акции. Настоящие условия — в настройках приложения."
  },
  {
   "tag": "Новым",
   "title": "Чистка ноутбука −20%",
   "text": "При записи через приложение",
   "photo": "assets/img/a-man-working-on-a-KhnRiIAg.webp"
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
 "telegram": "https://t.me/kvarc_demo",
 "max": "https://max.ru/u/kvarc_demo",
 "words": {
  "gift": "Подарите ремонт",
  "friendTo": "другу",
  "friendAcc": "друга",
  "him": "Ему",
  "his": "его",
  "placeTo": "в сервис",
  "placeBy": "сервисом",
  "demoName": "Артём",
  "s1": "Подарочный",
  "toLabel": "Имя получателя",
  "toExample": "Саша"
 },
 "hero": "assets/img/damaged-iphones-and-repair-tools-B63gJWwd.webp",
 "mark": "",
 "whatsapp": "79000000000",
 "review": ""
};
