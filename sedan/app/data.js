/* Данные салона для приложения — собрано tools/clientapp.mjs из site.json. Правки — в site.json (business, services, booking.masters, app) и пересборка. */
window.APP = {
 "slug": "--app",
 "name": "Седан",
 "address": "ул. Семафорная, 30 (демо), Красноярск",
 "phone": "+7 900 000-00-00",
 "site": "../",
 "demo": true,
 "greet": "",
 "hours": {
  "1": [
   "09:00",
   "18:00"
  ],
  "2": [
   "09:00",
   "18:00"
  ],
  "3": [
   "09:00",
   "18:00"
  ],
  "4": [
   "09:00",
   "18:00"
  ],
  "5": [
   "09:00",
   "18:00"
  ]
 },
 "services": [
  {
   "id": "s1",
   "name": "Компьютерная диагностика",
   "duration": 60,
   "price": 0,
   "from": false,
   "term": "1 ч"
  },
  {
   "id": "s2",
   "name": "Ремонт бензиновых двигателей",
   "duration": 240,
   "price": 0,
   "from": false,
   "term": "4 ч"
  },
  {
   "id": "s3",
   "name": "Замена масла и ТО",
   "duration": 60,
   "price": 0,
   "from": false,
   "term": "1 ч"
  },
  {
   "id": "s4",
   "name": "Ремонт ходовой части",
   "duration": 120,
   "price": 0,
   "from": false,
   "term": "2 ч"
  },
  {
   "id": "s5",
   "name": "Консультация и осмотр",
   "duration": 30,
   "price": 0,
   "from": false,
   "term": "30 мин"
  }
 ],
 "masters": [],
 "photos": [
  "assets/img/stock/motor-chb.webp",
  "assets/img/stock/truby.webp",
  "assets/img/stock/motor.webp",
  "assets/img/stock/koleso.webp"
 ],
 "promos": [
  {
   "tag": "Демо-акция",
   "title": "Диагностика перед зимой",
   "text": "Двигатель, ходовая и аккумулятор — до морозов",
   "more": "Пример акции. Настоящие условия — по решению сервиса.",
   "photo": "assets/img/stock/podemnik.webp"
  },
  {
   "tag": "Новым",
   "title": "500 бонусов на первый визит",
   "text": "Скачайте приложение и запишитесь онлайн",
   "photo": "assets/img/stock/motor-chb.webp"
  },
  {
   "tag": "Демо-акция",
   "title": "ТО вовремя",
   "text": "Приложение само напомнит, когда пора менять масло",
   "photo": "assets/img/stock/truby.webp"
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
 "kind": "Сервис немецких автомобилей",
 "cars": [
  {
   "id": "c1",
   "make": "Седан",
   "model": "универсал",
   "year": 2014,
   "plate": "К 777 КК 124",
   "mileage": 164200,
   "toEvery": 10000,
   "lastTo": 158000
  },
  {
   "id": "c2",
   "make": "Кроссовер",
   "model": "3.0",
   "year": 2012,
   "plate": "М 001 ММ 124",
   "mileage": 212800,
   "toEvery": 10000,
   "lastTo": 210000
  }
 ],
 "telegram": "https://t.me/sedan_demo",
 "max": "https://max.ru/u/sedan_demo",
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
 "hero": "assets/img/stock/podemnik.webp",
 "mark": "assets/brand/mark.svg",
 "whatsapp": "79000000000",
 "review": ""
};
