/* Данные салона для приложения — собрано tools/clientapp.mjs из site.json. Правки — в site.json (business, services, booking.masters, app) и пересборка. */
window.APP = {
 "slug": "shinomontazh-app",
 "name": "Колесо",
 "address": "ул. Пирятинская, 15, Абакан",
 "phone": "+7 900 000-00-00",
 "site": "../",
 "demo": true,
 "hours": {
  "0": [
   "09:00",
   "18:00"
  ],
  "1": [
   "08:00",
   "20:00"
  ],
  "2": [
   "08:00",
   "20:00"
  ],
  "3": [
   "08:00",
   "20:00"
  ],
  "4": [
   "08:00",
   "20:00"
  ],
  "5": [
   "08:00",
   "20:00"
  ],
  "6": [
   "09:00",
   "18:00"
  ]
 },
 "services": [
  {
   "id": "s1",
   "name": "Сезонная переобувка R13–R16",
   "duration": 30,
   "price": 1200,
   "from": true
  },
  {
   "id": "s2",
   "name": "Сезонная переобувка R17–R21",
   "duration": 60,
   "price": 2000,
   "from": true
  },
  {
   "id": "s3",
   "name": "Балансировка",
   "duration": 30,
   "price": 600,
   "from": true
  },
  {
   "id": "s4",
   "name": "Ремонт прокола",
   "duration": 30,
   "price": 350,
   "from": true
  },
  {
   "id": "s5",
   "name": "Хранение шин",
   "duration": 30,
   "price": 3000,
   "from": false
  }
 ],
 "masters": [],
 "photos": [
  "assets/img/black-and-silver-car-wheel-O_ufcLVT.webp",
  "assets/img/person-in-black-jacket-holding-K3cjUOMm.webp",
  "assets/img/piles-of-car-tires-WHPOFFzY.webp"
 ],
 "promos": [
  {
   "tag": "Демо-акция",
   "title": "Утро будней −15%",
   "text": "На любые услуги до 12:00 по будням",
   "more": "Пример акции. Настоящие условия — в настройках приложения.",
   "photo": "assets/img/black-and-silver-car-wheel-O_ufcLVT.webp"
  },
  {
   "tag": "Новым",
   "title": "500 бонусов на первый визит",
   "text": "Скачайте приложение и запишитесь онлайн",
   "photo": "assets/img/person-in-black-jacket-holding-K3cjUOMm.webp"
  },
  {
   "tag": "Демо-акция",
   "title": "Полировка + бронь фар",
   "text": "Комплекс — выгоднее, чем по отдельности",
   "photo": "assets/img/piles-of-car-tires-WHPOFFzY.webp"
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
 "kind": "Шиномонтаж",
 "telegram": "https://t.me/koleso_abakan_demo",
 "max": "https://max.ru/u/shinomontazh_demo",
 "words": {
  "gift": "Подарите уход за авто",
  "friendTo": "другу",
  "friendAcc": "друга",
  "him": "Ему",
  "his": "его",
  "placeTo": "в сервис",
  "placeBy": "автосервисом",
  "demoName": "Андрей",
  "s1": "Фирменный",
  "toLabel": "Имя получателя",
  "toExample": "Саша"
 },
 "hero": "assets/img/a-man-working-on-a-9uHal2Dd.webp",
 "mark": "",
 "whatsapp": "79000000000",
 "review": ""
};
