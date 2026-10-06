/* Данные салона для приложения — собрано tools/clientapp.mjs из site.json. Правки — в site.json (business, services, booking.masters, app) и пересборка. */
window.APP = {
 "slug": "satin-app",
 "name": "Сатин",
 "address": "ул. Карла Маркса, 200, Красноярск",
 "phone": "+7 900 000-00-00",
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
   "name": "Комбинированный маникюр без покрытия",
   "duration": 60,
   "price": 1700,
   "from": true
  },
  {
   "id": "s2",
   "name": "Снятие и маникюр с покрытием гель-лак",
   "duration": 120,
   "price": 2250,
   "from": true
  },
  {
   "id": "s3",
   "name": "Снятие, маникюр, укрепление, покрытие гель-лак",
   "duration": 120,
   "price": 2350,
   "from": true
  },
  {
   "id": "s4",
   "name": "Маникюр с наращиванием и покрытием",
   "duration": 150,
   "price": 2350,
   "from": true
  },
  {
   "id": "s5",
   "name": "Детский маникюр",
   "duration": 60,
   "price": 1300,
   "from": true
  },
  {
   "id": "s6",
   "name": "Педикюр без покрытия",
   "duration": 60,
   "price": 1800,
   "from": true
  },
  {
   "id": "s7",
   "name": "Педикюр с покрытием гель-лак",
   "duration": 90,
   "price": 2250,
   "from": true
  },
  {
   "id": "s8",
   "name": "Полный педикюр с покрытием SMART",
   "duration": 120,
   "price": 3150,
   "from": true
  },
  {
   "id": "s9",
   "name": "Коррекция бровей без окрашивания",
   "duration": 30,
   "price": 900,
   "from": true
  },
  {
   "id": "s10",
   "name": "Окрашивание ресниц краской",
   "duration": 30,
   "price": 1000,
   "from": true
  },
  {
   "id": "s11",
   "name": "Ламинирование нижних ресниц",
   "duration": 60,
   "price": 1000,
   "from": true
  },
  {
   "id": "s12",
   "name": "Наращивание ресниц MEGA VOLUME и CRAZY EFFECT",
   "duration": 150,
   "price": 3200,
   "from": false
  }
 ],
 "masters": [
  {
   "id": "m1",
   "name": "Алина Мороз",
   "role": "Маникюр и педикюр",
   "services": [
    "s1",
    "s2",
    "s3",
    "s4",
    "s5",
    "s6",
    "s7",
    "s8"
   ],
   "days": null
  },
  {
   "id": "m2",
   "name": "Вероника Лис",
   "role": "Маникюр и педикюр",
   "services": [
    "s1",
    "s2",
    "s3",
    "s4",
    "s5",
    "s6",
    "s7",
    "s8"
   ],
   "days": null
  },
  {
   "id": "m3",
   "name": "Дарина Ким",
   "role": "Брови и ресницы",
   "services": [
    "s9",
    "s10",
    "s11",
    "s12"
   ],
   "days": null
  }
 ],
 "photos": [
  "assets/img/person-with-silver-ring-on-QDLcmSCQ.webp",
  "assets/img/a-woman-s-hands-with-WIo3zAWq.webp",
  "assets/img/close-up-of-a-person-YCMkMQev.webp"
 ],
 "promos": [
  {
   "tag": "Демо-акция",
   "title": "Утро будней −15%",
   "text": "На любые услуги до 12:00 по будням",
   "more": "Пример акции. Настоящие условия — в настройках приложения.",
   "photo": "assets/img/person-with-silver-ring-on-QDLcmSCQ.webp"
  },
  {
   "tag": "Новым",
   "title": "500 бонусов на первый визит",
   "text": "Скачайте приложение и запишитесь онлайн",
   "photo": "assets/img/a-woman-s-hands-with-WIo3zAWq.webp"
  },
  {
   "tag": "Демо-акция",
   "title": "Маникюр + педикюр",
   "text": "Вместе — выгоднее, чем по отдельности",
   "photo": "assets/img/close-up-of-a-person-YCMkMQev.webp"
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
 "kind": "Студия красоты",
 "telegram": "https://t.me/satin_demo",
 "max": "https://max.ru/u/satin_demo",
 "hero": "assets/img/a-woman-with-her-hands-T8Wnesok.webp",
 "mark": "",
 "whatsapp": "79000000000",
 "review": ""
};
