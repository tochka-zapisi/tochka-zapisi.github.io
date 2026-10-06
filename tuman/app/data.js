/* Данные салона для приложения — собрано tools/clientapp.mjs из site.json. Правки — в site.json (business, services, booking.masters, app) и пересборка. */
window.APP = {
 "slug": "tuman-app",
 "name": "Туман",
 "address": "ул. Красной Армии, 150, Красноярск",
 "phone": "+7 900 000-00-00",
 "site": "../",
 "demo": true,
 "hours": {
  "0": [
   "10:00",
   "23:00"
  ],
  "1": [
   "10:00",
   "23:00"
  ],
  "2": [
   "10:00",
   "23:00"
  ],
  "3": [
   "10:00",
   "23:00"
  ],
  "4": [
   "10:00",
   "23:00"
  ],
  "5": [
   "10:00",
   "23:00"
  ],
  "6": [
   "10:00",
   "23:00"
  ]
 },
 "services": [
  {
   "id": "s1",
   "name": "Ритуал «Туман»",
   "duration": 120,
   "price": 9800,
   "from": false
  },
  {
   "id": "s2",
   "name": "Ритуал «Туман» на двоих",
   "duration": 120,
   "price": 18500,
   "from": false
  },
  {
   "id": "s3",
   "name": "Классический массаж",
   "duration": 60,
   "price": 4200,
   "from": false
  },
  {
   "id": "s4",
   "name": "Массаж горячими камнями",
   "duration": 90,
   "price": 5600,
   "from": false
  },
  {
   "id": "s5",
   "name": "Массаж спины и шеи",
   "duration": 60,
   "price": 2900,
   "from": false
  },
  {
   "id": "s6",
   "name": "Парная на двоих",
   "duration": 120,
   "price": 6000,
   "from": false
  },
  {
   "id": "s7",
   "name": "Скраб и обёртывание",
   "duration": 60,
   "price": 4500,
   "from": false
  },
  {
   "id": "s8",
   "name": "Подарочный сертификат",
   "duration": 30,
   "price": 3000,
   "from": true
  }
 ],
 "masters": [
  {
   "id": "m1",
   "name": "Алина",
   "role": "Массаж: классический, камни, спина",
   "services": [
    "s3",
    "s4",
    "s5",
    "s1",
    "s2"
   ],
   "days": null
  },
  {
   "id": "m2",
   "name": "Ксения",
   "role": "SPA-ритуалы, парная, скрабы",
   "services": [
    "s1",
    "s2",
    "s6",
    "s7",
    "s8"
   ],
   "days": null
  }
 ],
 "photos": [
  "assets/img/modern-wooden-sauna-interior-with-GkRDAH5h.webp",
  "assets/img/hot-stones-rest-on-a-uWiQaLrQ.webp",
  "assets/img/a-person-sitting-on-a-8a7ECXut.webp"
 ],
 "promos": [
  {
   "tag": "Демо-акция",
   "title": "Будни до 15:00 −15%",
   "text": "На ритуалы и массаж",
   "more": "Пример акции. Настоящие условия — в настройках приложения.",
   "photo": "assets/img/modern-wooden-sauna-interior-with-GkRDAH5h.webp"
  },
  {
   "tag": "Новым",
   "title": "Массаж спины в подарок",
   "text": "К первому ритуалу «Туман»",
   "photo": "assets/img/hot-stones-rest-on-a-uWiQaLrQ.webp"
  },
  {
   "tag": "Демо-акция",
   "title": "Ритуал на двоих",
   "text": "Вдвоём выгоднее, чем по одному",
   "photo": "assets/img/a-person-sitting-on-a-8a7ECXut.webp"
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
 "kind": "SPA и массаж",
 "telegram": "https://t.me/tuman_demo",
 "max": "https://max.ru/u/tuman_demo",
 "words": {
  "gift": "Подарите два часа тишины",
  "friendTo": "близкому",
  "friendAcc": "близкого",
  "him": "Близкому",
  "his": "его",
  "placeTo": "в SPA",
  "placeBy": "SPA",
  "demoName": "Марина",
  "s1": "Подарочный",
  "toLabel": "Имя получателя",
  "toExample": "Аня"
 },
 "hero": "assets/img/empty-wooden-sauna-with-warm-sYGUgEXz.webp",
 "mark": "",
 "whatsapp": "79000000000",
 "review": ""
};
