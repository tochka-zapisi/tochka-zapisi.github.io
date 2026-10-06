/* Данные салона для приложения — собрано tools/clientapp.mjs из site.json. Правки — в site.json (business, services, booking.masters, app) и пересборка. */
window.APP = {
 "slug": "gsauto-app",
 "name": "GS-Auto",
 "address": "Северное шоссе, 9/2, Красноярск",
 "phone": "+7 923 367-67-67",
 "site": "../",
 "demo": true,
 "hours": {
  "0": [
   "10:00",
   "22:00"
  ],
  "1": [
   "10:00",
   "22:00"
  ],
  "2": [
   "10:00",
   "22:00"
  ],
  "3": [
   "10:00",
   "22:00"
  ],
  "4": [
   "10:00",
   "22:00"
  ],
  "5": [
   "10:00",
   "22:00"
  ],
  "6": [
   "10:00",
   "22:00"
  ]
 },
 "services": [
  {
   "id": "s1",
   "name": "Диагностика и ремонт автомобиля",
   "duration": 60,
   "price": 1500,
   "from": true
  },
  {
   "id": "s2",
   "name": "Ремонт подвески",
   "duration": 120,
   "price": 1000,
   "from": true
  },
  {
   "id": "s3",
   "name": "Замена масла и ТО",
   "duration": 60,
   "price": 1000,
   "from": true
  },
  {
   "id": "s4",
   "name": "Заправка кондиционера",
   "duration": 60,
   "price": 2000,
   "from": true
  },
  {
   "id": "s5",
   "name": "Сварочные работы",
   "duration": 60,
   "price": 1000,
   "from": true
  },
  {
   "id": "s6",
   "name": "Полировка кузова",
   "duration": 480,
   "price": 10000,
   "from": true
  },
  {
   "id": "s7",
   "name": "Полировка фар",
   "duration": 60,
   "price": 1800,
   "from": true
  },
  {
   "id": "s8",
   "name": "Бронирование фар плёнкой",
   "duration": 120,
   "price": 3000,
   "from": true
  },
  {
   "id": "s9",
   "name": "Установка би-лед линз",
   "duration": 240,
   "price": 18000,
   "from": true
  },
  {
   "id": "s10",
   "name": "Химчистка салона",
   "duration": 360,
   "price": 8000,
   "from": true
  },
  {
   "id": "s11",
   "name": "Химчистка отдельных элементов",
   "duration": 60,
   "price": 1000,
   "from": true
  },
  {
   "id": "s12",
   "name": "Предпродажная подготовка",
   "duration": 180,
   "price": 3000,
   "from": true
  }
 ],
 "masters": [],
 "photos": [
  "assets/img/real/gs-x7-hex.webp",
  "assets/img/real/gs-headlight-night.webp",
  "assets/img/real/gs-black-polish.webp",
  "assets/img/real/gs-bmw-grille.webp"
 ],
 "promos": [
  {
   "tag": "Демо-акция",
   "title": "Утро будней −15%",
   "text": "На любые услуги до 12:00 по будням",
   "more": "Пример акции. Настоящие условия — в настройках приложения.",
   "photo": "assets/img/real/gs-x7-hex.webp"
  },
  {
   "tag": "Новым",
   "title": "500 бонусов на первый визит",
   "text": "Скачайте приложение и запишитесь онлайн",
   "photo": "assets/img/real/gs-headlight-night.webp"
  },
  {
   "tag": "Демо-акция",
   "title": "Полировка + бронь фар",
   "text": "Комплекс — выгоднее, чем по отдельности",
   "photo": "assets/img/real/gs-black-polish.webp"
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
 "kind": "Автотехцентр и детейлинг",
 "telegram": "https://t.me/+79233676767",
 "max": "",
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
 "hero": "assets/img/real/gs-hex-hood.webp",
 "mark": "assets/brand/gs-mark.png",
 "whatsapp": "79233676767",
 "review": "https://yandex.ru/maps/org/152754958695/"
};
