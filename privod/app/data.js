/* Данные салона для приложения — собрано tools/clientapp.mjs из site.json. Правки — в site.json (business, services, booking.masters, app) и пересборка. */
window.APP = {
 "slug": "--app",
 "name": "Привод",
 "address": "ул. Калинина, 77 (демо), Красноярск",
 "phone": "+7 900 000-00-00",
 "site": "../",
 "demo": true,
 "greet": "",
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
   "from": true,
   "term": "1 ч"
  },
  {
   "id": "s2",
   "name": "Ремонт подвески",
   "duration": 120,
   "price": 1000,
   "from": true,
   "term": "2 ч"
  },
  {
   "id": "s3",
   "name": "Замена масла и ТО",
   "duration": 60,
   "price": 1000,
   "from": true,
   "term": "1 ч"
  },
  {
   "id": "s4",
   "name": "Заправка кондиционера",
   "duration": 60,
   "price": 2000,
   "from": true,
   "term": "1 ч"
  },
  {
   "id": "s5",
   "name": "Сварочные работы",
   "duration": 60,
   "price": 1000,
   "from": true,
   "term": "1 ч"
  },
  {
   "id": "s6",
   "name": "Полировка кузова",
   "duration": 480,
   "price": 10000,
   "from": true,
   "term": "8 ч"
  },
  {
   "id": "s7",
   "name": "Полировка фар",
   "duration": 60,
   "price": 1800,
   "from": true,
   "term": "1 ч"
  },
  {
   "id": "s8",
   "name": "Бронирование фар плёнкой",
   "duration": 120,
   "price": 3000,
   "from": true,
   "term": "2 ч"
  },
  {
   "id": "s9",
   "name": "Установка би-лед линз",
   "duration": 240,
   "price": 18000,
   "from": true,
   "term": "4 ч"
  },
  {
   "id": "s10",
   "name": "Химчистка салона",
   "duration": 360,
   "price": 8000,
   "from": true,
   "term": "6 ч"
  },
  {
   "id": "s11",
   "name": "Химчистка отдельных элементов",
   "duration": 60,
   "price": 1000,
   "from": true,
   "term": "1 ч"
  },
  {
   "id": "s12",
   "name": "Предпродажная подготовка",
   "duration": 180,
   "price": 3000,
   "from": true,
   "term": "3 ч"
  }
 ],
 "masters": [],
 "photos": [
  "assets/img/stock/master.webp",
  "assets/img/stock/dvigatel.webp",
  "assets/img/stock/diagnostika.webp",
  "assets/img/stock/koleso.webp"
 ],
 "promos": [
  {
   "tag": "Демо-акция",
   "title": "Утро будней −15%",
   "text": "На любые услуги до 12:00 по будням",
   "more": "Пример акции. Настоящие условия — в настройках приложения.",
   "photo": "assets/img/stock/master.webp"
  },
  {
   "tag": "Новым",
   "title": "500 бонусов на первый визит",
   "text": "Скачайте приложение и запишитесь онлайн",
   "photo": "assets/img/stock/dvigatel.webp"
  },
  {
   "tag": "Демо-акция",
   "title": "Полировка + бронь фар",
   "text": "Комплекс — выгоднее, чем по отдельности",
   "photo": "assets/img/stock/diagnostika.webp"
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
 "detailing": true,
 "telegram": "https://t.me/privod_demo",
 "max": "https://max.ru/u/privod_demo",
 "words": {
  "gift": "Подарите защиту и блеск",
  "friendTo": "другу",
  "friendAcc": "друга",
  "him": "Ему",
  "his": "его",
  "placeTo": "в студию",
  "placeBy": "студией",
  "demoName": "Андрей",
  "s1": "Фирменный",
  "toLabel": "Имя получателя",
  "toExample": "Саша"
 },
 "hero": "assets/img/stock/ceh.webp",
 "mark": "assets/brand/mark.svg",
 "whatsapp": "79000000000",
 "review": ""
};
