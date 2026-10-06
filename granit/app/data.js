/* Данные салона для приложения — собрано tools/clientapp.mjs из site.json. Правки — в site.json (business, services, booking.masters, app) и пересборка. */
window.APP = {
 "slug": "granit-app",
 "name": "Гранит",
 "address": "ул. Карла Маркса, 93, Красноярск",
 "phone": "+7 900 000-00-00",
 "site": "../",
 "demo": true,
 "hours": {
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
   "10:00",
   "15:00"
  ]
 },
 "services": [
  {
   "id": "s1",
   "name": "Консультация",
   "duration": 60,
   "price": 3000,
   "from": false
  },
  {
   "id": "s2",
   "name": "Проверка договора перед подписанием",
   "duration": 30,
   "price": 4500,
   "from": true
  },
  {
   "id": "s3",
   "name": "Претензия или жалоба",
   "duration": 30,
   "price": 5000,
   "from": true
  },
  {
   "id": "s4",
   "name": "Исковое заявление",
   "duration": 30,
   "price": 9000,
   "from": true
  },
  {
   "id": "s5",
   "name": "Представительство в суде первой инстанции",
   "duration": 30,
   "price": 35000,
   "from": true
  },
  {
   "id": "s6",
   "name": "Раздел имущества под ключ",
   "duration": 30,
   "price": 60000,
   "from": true
  },
  {
   "id": "s7",
   "name": "Банкротство физического лица",
   "duration": 30,
   "price": 90000,
   "from": true
  },
  {
   "id": "s8",
   "name": "Регистрация ИП или ООО",
   "duration": 30,
   "price": 6000,
   "from": false
  }
 ],
 "masters": [
  {
   "id": "m1",
   "name": "Елена Соколова",
   "role": "семейные и жилищные споры",
   "services": [
    "s1",
    "s2",
    "s4"
   ],
   "days": null
  },
  {
   "id": "m2",
   "name": "Андрей Матвеев",
   "role": "долги и банкротство",
   "services": [
    "s1",
    "s3",
    "s4"
   ],
   "days": null
  },
  {
   "id": "m3",
   "name": "Ольга Ким",
   "role": "договоры и бизнес",
   "services": [
    "s1",
    "s2",
    "s8"
   ],
   "days": null
  }
 ],
 "photos": [
  "assets/img/an-open-book-rests-on-umE2JF57.webp",
  "assets/img/antique-desk-with-open-book-FpVm8wd0.webp",
  "assets/img/couple-signing-document-at-desk-wNxbeoNU-portrait.webp",
  "assets/img/couple-signing-document-at-desk-wNxbeoNU.webp",
  "assets/img/man-writing-on-paper-OQMZwNd3.webp"
 ],
 "promos": [
  {
   "tag": "Демо-акция",
   "title": "Проверка договора −20%",
   "text": "Перед покупкой квартиры или машины",
   "photo": "assets/img/man-writing-on-paper-OQMZwNd3.webp",
   "more": "Пример акции. Настоящие условия — в настройках приложения."
  },
  {
   "tag": "Новым",
   "title": "Консультация засчитывается",
   "text": "В оплату договора, если продолжаем работу",
   "photo": "assets/img/couple-signing-document-at-desk-wNxbeoNU.webp"
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
 "telegram": "https://t.me/granit_demo",
 "max": "https://max.ru/u/granit_demo",
 "words": {
  "gift": "Подарите консультацию юриста",
  "friendTo": "близкому",
  "friendAcc": "близкого",
  "him": "Близкому",
  "his": "его",
  "placeTo": "в бюро",
  "placeBy": "бюро",
  "demoName": "Наталья",
  "s1": "Подарочный",
  "toLabel": "Имя получателя",
  "toExample": "Ира"
 },
 "hero": "assets/img/couple-signing-document-at-desk-wNxbeoNU.webp",
 "mark": "",
 "whatsapp": "79000000000",
 "review": ""
};
