/* Данные салона для приложения — собрано tools/clientapp.mjs из site.json. Правки — в site.json (business, services, booking.masters, app) и пересборка. */
window.APP = {
 "slug": "mbgarage-app",
 "name": "MB-garage",
 "address": "ул. 26 Бакинских Комиссаров, 1/423, Красноярск",
 "phone": "+7 923 295-22-76",
 "site": "../",
 "demo": true,
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
   "from": false
  },
  {
   "id": "s2",
   "name": "Ремонт бензиновых двигателей",
   "duration": 240,
   "price": 0,
   "from": false
  },
  {
   "id": "s3",
   "name": "Замена масла и ТО",
   "duration": 60,
   "price": 0,
   "from": false
  },
  {
   "id": "s4",
   "name": "Ремонт ходовой части",
   "duration": 120,
   "price": 0,
   "from": false
  },
  {
   "id": "s5",
   "name": "Консультация и осмотр",
   "duration": 30,
   "price": 0,
   "from": false
  }
 ],
 "masters": [],
 "photos": [
  "assets/img/real/mb-camshafts.webp",
  "assets/img/real/mb-s-night.webp",
  "assets/img/real/mb-under-hood.webp",
  "assets/img/real/mb-box.webp"
 ],
 "promos": [
  {
   "tag": "Демо-акция",
   "title": "Диагностика перед зимой",
   "text": "Двигатель, ходовая и аккумулятор — до морозов",
   "more": "Пример акции. Настоящие условия — по решению MB-garage.",
   "photo": "assets/img/real/mb-s-night.webp"
  },
  {
   "tag": "Новым",
   "title": "500 бонусов на первый визит",
   "text": "Скачайте приложение и запишитесь онлайн",
   "photo": "assets/img/real/mb-box.webp"
  },
  {
   "tag": "Демо-акция",
   "title": "ТО вовремя",
   "text": "Приложение само напомнит, когда пора менять масло",
   "photo": "assets/img/real/mb-under-hood.webp"
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
 "kind": "Ремонт Mercedes-Benz",
 "cars": [
  {
   "id": "c1",
   "make": "Mercedes-Benz",
   "model": "C 200 (W204)",
   "year": 2012,
   "plate": "К 777 КК 124",
   "mileage": 164200,
   "toEvery": 10000,
   "lastTo": 158000
  },
  {
   "id": "c2",
   "make": "Mercedes-Benz",
   "model": "ML 350 (W164)",
   "year": 2009,
   "plate": "М 001 ММ 124",
   "mileage": 212800,
   "toEvery": 10000,
   "lastTo": 210000
  }
 ],
 "telegram": "https://t.me/+79138377259",
 "max": "",
 "words": {
  "works": "Мастерская",
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
 "hero": "assets/img/real/mb-cluster-dark.webp",
 "mark": "assets/brand/mb-stripes.png",
 "whatsapp": "79232952276",
 "review": "https://yandex.ru/maps/62/krasnoyarsk/?text=MB-garage%2026%20Бакинских%20Комиссаров%201%2F423"
};
