/* Данные салона для приложения — собрано tools/clientapp.mjs из site.json. Правки — в site.json (business, services, booking.masters, app) и пересборка. */
window.APP = {
 "slug": "myata-app",
 "name": "Мята",
 "address": "ул. Весны, 7, Красноярск",
 "phone": "+7 900 000-00-00",
 "site": "../",
 "demo": true,
 "hours": {
  "0": [
   "08:00",
   "22:00"
  ],
  "1": [
   "08:00",
   "22:00"
  ],
  "2": [
   "08:00",
   "22:00"
  ],
  "3": [
   "08:00",
   "22:00"
  ],
  "4": [
   "08:00",
   "22:00"
  ],
  "5": [
   "08:00",
   "22:00"
  ],
  "6": [
   "08:00",
   "22:00"
  ]
 },
 "services": [
  {
   "id": "s1",
   "name": "Приём терапевта",
   "duration": 30,
   "price": 1200,
   "from": false
  },
  {
   "id": "s2",
   "name": "Вакцинация кошки",
   "duration": 30,
   "price": 1900,
   "from": false
  },
  {
   "id": "s3",
   "name": "Вакцинация собаки",
   "duration": 30,
   "price": 2300,
   "from": false
  },
  {
   "id": "s4",
   "name": "Чипирование",
   "duration": 30,
   "price": 1500,
   "from": false
  },
  {
   "id": "s5",
   "name": "УЗИ брюшной полости",
   "duration": 30,
   "price": 2200,
   "from": false
  },
  {
   "id": "s6",
   "name": "Общий анализ крови",
   "duration": 120,
   "price": 1400,
   "from": false
  },
  {
   "id": "s7",
   "name": "Кастрация кота",
   "duration": 30,
   "price": 3900,
   "from": false
  },
  {
   "id": "s8",
   "name": "Стерилизация кошки",
   "duration": 30,
   "price": 6900,
   "from": false
  },
  {
   "id": "s9",
   "name": "Стерилизация собаки до 10 кг",
   "duration": 30,
   "price": 9500,
   "from": true
  },
  {
   "id": "s10",
   "name": "Чистка зубов ультразвуком",
   "duration": 60,
   "price": 4500,
   "from": false
  },
  {
   "id": "s11",
   "name": "Подрезка зубов кролику",
   "duration": 30,
   "price": 900,
   "from": false
  },
  {
   "id": "s12",
   "name": "Приём орнитолога",
   "duration": 30,
   "price": 1500,
   "from": false
  },
  {
   "id": "s13",
   "name": "Стрижка когтей",
   "duration": 30,
   "price": 400,
   "from": false
  }
 ],
 "masters": [
  {
   "id": "m1",
   "name": "Анна Морозова",
   "role": "терапевт",
   "services": [
    "s1",
    "s2",
    "s3",
    "s4",
    "s6",
    "s13"
   ],
   "days": null
  },
  {
   "id": "m2",
   "name": "Павел Ильин",
   "role": "хирург",
   "services": [
    "s7",
    "s8",
    "s9",
    "s10"
   ],
   "days": null
  },
  {
   "id": "m3",
   "name": "Мария Ковалёва",
   "role": "кролики, грызуны и птицы",
   "services": [
    "s1",
    "s11",
    "s12",
    "s13"
   ],
   "days": null
  },
  {
   "id": "m4",
   "name": "Ирина Лаптева",
   "role": "УЗИ и кардиология",
   "services": [
    "s5",
    "s6"
   ],
   "days": null
  }
 ],
 "photos": [
  "assets/img/woman-in-blue-polo-shirt-83HBHD-V.webp",
  "assets/img/a-person-holding-a-dog-u2H8mUzo.webp",
  "assets/img/a-dog-wearing-a-baseball-E3K7xyAv.webp"
 ],
 "promos": [
  {
   "tag": "Демо-акция",
   "title": "Прививка + чип −15%",
   "text": "Для котят и щенков до года",
   "photo": "assets/img/a-dog-wearing-a-baseball-E3K7xyAv.webp",
   "more": "Пример акции. Настоящие условия — в настройках приложения."
  },
  {
   "tag": "Новым",
   "title": "Первый осмотр — 600 ₽",
   "text": "При записи через приложение",
   "photo": "assets/img/woman-in-blue-polo-shirt-83HBHD-V.webp"
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
 "kind": "Ветеринарная клиника",
 "pets": [
  {
   "id": "cat",
   "name": "Кошка",
   "icon": "cat"
  },
  {
   "id": "dog",
   "name": "Собака",
   "icon": "dog"
  },
  {
   "id": "rabbit",
   "name": "Кролик или грызун",
   "icon": "rabbit"
  },
  {
   "id": "bird",
   "name": "Птица",
   "icon": "bird"
  }
 ],
 "telegram": "https://t.me/myata_demo",
 "max": "https://max.ru/u/myata_demo",
 "words": {
  "master": "врач",
  "masters": "Врачи",
  "masterCap": "Врач",
  "works": "Наша клиника",
  "gift": "Подарите заботу о питомце",
  "friendTo": "другу",
  "friendAcc": "друга",
  "him": "Другу",
  "his": "его",
  "placeTo": "в клинику",
  "placeBy": "клиникой",
  "demoName": "Анастасия",
  "s1": "Подарочный",
  "toLabel": "Имя получателя",
  "toExample": "Саша"
 },
 "hero": "assets/img/a-woman-holding-a-cat--9hGDssQ.webp",
 "mark": "",
 "whatsapp": "79000000000",
 "review": ""
};
