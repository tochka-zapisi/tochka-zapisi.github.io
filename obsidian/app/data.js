/* Данные салона для приложения — собрано tools/clientapp.mjs из site.json. Правки — в site.json (business, services, booking.masters, app) и пересборка. */
window.APP = {
 "slug": "obsidian-app",
 "name": "Обсидиан",
 "address": "ул. Партизана Железняка, 90, Красноярск",
 "phone": "+7 900 000-00-00",
 "site": "../",
 "demo": true,
 "hours": {
  "0": [
   "09:00",
   "21:00"
  ],
  "1": [
   "09:00",
   "21:00"
  ],
  "2": [
   "09:00",
   "21:00"
  ],
  "3": [
   "09:00",
   "21:00"
  ],
  "4": [
   "09:00",
   "21:00"
  ],
  "5": [
   "09:00",
   "21:00"
  ],
  "6": [
   "09:00",
   "21:00"
  ]
 },
 "services": [
  {
   "id": "s1",
   "name": "Двухфазная мойка",
   "duration": 60,
   "price": 1200,
   "from": true
  },
  {
   "id": "s2",
   "name": "Химчистка салона",
   "duration": 360,
   "price": 9000,
   "from": true
  },
  {
   "id": "s3",
   "name": "Полировка кузова",
   "duration": 30,
   "price": 18000,
   "from": true
  },
  {
   "id": "s4",
   "name": "Керамическое покрытие",
   "duration": 30,
   "price": 25000,
   "from": true
  },
  {
   "id": "s5",
   "name": "Бронеплёнка: зоны риска",
   "duration": 30,
   "price": 35000,
   "from": true
  },
  {
   "id": "s6",
   "name": "Полировка фар",
   "duration": 90,
   "price": 3000,
   "from": true
  },
  {
   "id": "s7",
   "name": "Антидождь",
   "duration": 60,
   "price": 1500,
   "from": true
  },
  {
   "id": "s8",
   "name": "Подготовка к продаже",
   "duration": 30,
   "price": 7000,
   "from": true
  }
 ],
 "masters": [],
 "photos": [
  "assets/img/gray-microfiber-cloth-on-a-Df9XCGX9.webp",
  "assets/img/a-person-taking-a-picture-gAm_dPRQ.webp",
  "assets/img/a-hand-holding-a-piece-TH6zRFk-.webp"
 ],
 "promos": [
  {
   "tag": "Демо-акция",
   "title": "Утро будней −15%",
   "text": "На любые услуги до 12:00 по будням",
   "more": "Пример акции. Настоящие условия — в настройках приложения.",
   "photo": "assets/img/gray-microfiber-cloth-on-a-Df9XCGX9.webp"
  },
  {
   "tag": "Новым",
   "title": "500 бонусов на первый визит",
   "text": "Скачайте приложение и запишитесь онлайн",
   "photo": "assets/img/a-person-taking-a-picture-gAm_dPRQ.webp"
  },
  {
   "tag": "Демо-акция",
   "title": "Полировка + бронь фар",
   "text": "Комплекс — выгоднее, чем по отдельности",
   "photo": "assets/img/a-hand-holding-a-piece-TH6zRFk-.webp"
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
 "kind": "Детейлинг-центр",
 "telegram": "https://t.me/obsidian_demo",
 "max": "https://max.ru/u/obsidian_demo",
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
 "hero": "assets/img/a-man-using-a-car-B7hVEFTF.webp",
 "mark": "",
 "whatsapp": "79000000000",
 "review": ""
};
