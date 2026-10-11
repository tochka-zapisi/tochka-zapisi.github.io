/* Данные салона для приложения — собрано tools/clientapp.mjs из site.json. Правки — в site.json (business, services, booking.masters, app) и пересборка. */
window.APP = {
 "slug": "kvartira-app",
 "name": "The Квартира",
 "address": "ул. Водопьянова, 9, Красноярск",
 "phone": "+7 908 200-57-00",
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
   "name": "Мужская стрижка",
   "duration": 60,
   "price": 1400,
   "from": true,
   "tiers": {
    "b": 1400,
    "s": 1500,
    "br": 1700
   }
  },
  {
   "id": "s2",
   "name": "Под машинку с фейдом",
   "duration": 60,
   "price": 1200,
   "from": true,
   "tiers": {
    "b": 1200,
    "s": 1300,
    "br": 1500
   }
  },
  {
   "id": "s3",
   "name": "Под машинку, до 3 насадок",
   "duration": 30,
   "price": 1100,
   "from": true,
   "tiers": {
    "b": 1100,
    "s": 1200,
    "br": 1400
   }
  },
  {
   "id": "s4",
   "name": "Удлинённая стрижка ножницами",
   "duration": 60,
   "price": 1500,
   "from": true,
   "tiers": {
    "b": 1500,
    "s": 1600,
    "br": 1800
   }
  },
  {
   "id": "s5",
   "name": "Под одну насадку",
   "duration": 30,
   "price": 500,
   "from": false,
   "tiers": {
    "b": 500,
    "s": 500,
    "br": 500
   }
  },
  {
   "id": "s6",
   "name": "Детская стрижка, 5–7 лет",
   "duration": 60,
   "price": 1200,
   "from": true,
   "tiers": {
    "b": 1200,
    "s": 1300,
    "br": 1400
   }
  },
  {
   "id": "s7",
   "name": "Бритьё головы",
   "duration": 60,
   "price": 1400,
   "from": true,
   "tiers": {
    "s": 1400,
    "br": 1600
   }
  },
  {
   "id": "s8",
   "name": "Камуфляж седины",
   "duration": 30,
   "price": 1200,
   "from": true,
   "tiers": {
    "b": 1200,
    "s": 1400,
    "br": 1500
   }
  },
  {
   "id": "s9",
   "name": "Коррекция бороды",
   "duration": 30,
   "price": 1100,
   "from": true,
   "tiers": {
    "b": 1100,
    "s": 1200,
    "br": 1300
   }
  },
  {
   "id": "s10",
   "name": "Королевское бритьё",
   "duration": 60,
   "price": 1300,
   "from": true,
   "tiers": {
    "s": 1300,
    "br": 1400
   }
  },
  {
   "id": "s11",
   "name": "Камуфляж бороды",
   "duration": 30,
   "price": 1200,
   "from": true,
   "tiers": {
    "s": 1200,
    "br": 1300
   }
  },
  {
   "id": "s12",
   "name": "Борода под одну насадку",
   "duration": 30,
   "price": 500,
   "from": true,
   "tiers": {
    "b": 500,
    "s": 500,
    "br": 600
   }
  },
  {
   "id": "s13",
   "name": "Оформление бороды ваксингом",
   "duration": 60,
   "price": 1800,
   "from": false,
   "tiers": {
    "br": 1800
   }
  },
  {
   "id": "s14",
   "name": "Стрижка + борода",
   "duration": 90,
   "price": 2100,
   "from": true,
   "tiers": {
    "b": 2100,
    "s": 2300,
    "br": 2500
   }
  },
  {
   "id": "s15",
   "name": "Стрижка + королевское бритьё",
   "duration": 90,
   "price": 2400,
   "from": true,
   "tiers": {
    "s": 2400,
    "br": 2600
   }
  },
  {
   "id": "s16",
   "name": "Стрижка + борода ваксингом",
   "duration": 90,
   "price": 2600,
   "from": false,
   "tiers": {
    "br": 2600
   }
  },
  {
   "id": "s17",
   "name": "Окантовка",
   "duration": 30,
   "price": 600,
   "from": true,
   "tiers": {
    "b": 600,
    "s": 600,
    "br": 700
   }
  },
  {
   "id": "s18",
   "name": "Ваксинг: нос, уши, брови",
   "duration": 30,
   "price": 200,
   "from": false,
   "tiers": {
    "b": 200,
    "s": 200,
    "br": 200
   }
  },
  {
   "id": "s19",
   "name": "Биозавивка",
   "duration": 120,
   "price": 5500,
   "from": false,
   "tiers": {
    "b": 5500,
    "s": 5500,
    "br": 5500
   }
  }
 ],
 "masters": [
  {
   "id": "m1",
   "name": "Али",
   "role": "Бренд-барбер",
   "services": [
    "s1",
    "s2",
    "s3",
    "s4",
    "s5",
    "s6",
    "s7",
    "s8",
    "s9",
    "s10",
    "s11",
    "s12",
    "s13",
    "s14",
    "s15",
    "s16",
    "s17",
    "s18",
    "s19"
   ],
   "days": null,
   "tier": "br"
  },
  {
   "id": "m2",
   "name": "Алексей",
   "role": "Бренд-барбер",
   "services": [
    "s1",
    "s2",
    "s3",
    "s4",
    "s5",
    "s6",
    "s7",
    "s8",
    "s9",
    "s10",
    "s11",
    "s12",
    "s13",
    "s14",
    "s15",
    "s16",
    "s17",
    "s18",
    "s19"
   ],
   "days": null,
   "tier": "br"
  },
  {
   "id": "m3",
   "name": "Никита К.",
   "role": "Старший барбер",
   "services": [
    "s1",
    "s2",
    "s3",
    "s4",
    "s5",
    "s6",
    "s7",
    "s8",
    "s9",
    "s10",
    "s11",
    "s12",
    "s14",
    "s15",
    "s17",
    "s18",
    "s19"
   ],
   "days": null,
   "tier": "s"
  },
  {
   "id": "m4",
   "name": "Игорь",
   "role": "Барбер",
   "services": [
    "s1",
    "s2",
    "s3",
    "s4",
    "s5",
    "s6",
    "s8",
    "s9",
    "s12",
    "s14",
    "s17",
    "s18",
    "s19"
   ],
   "days": null,
   "tier": "b"
  }
 ],
 "photos": [
  "assets/img/real/kv-fade.webp",
  "assets/img/real/kv-boroda.webp",
  "assets/img/real/kv-britie.webp",
  "assets/img/real/kv-detskaya.webp",
  "assets/img/real/kv-master-za-rabotoi.webp",
  "assets/img/real/kv-gitara.webp",
  "assets/img/real/kv-fotoapparat.webp",
  "assets/img/real/kv-pomada.webp"
 ],
 "promos": [
  {
   "tag": "Демо-акция",
   "title": "Утро будней −15%",
   "text": "На любые услуги до 12:00 по будням",
   "more": "Пример акции. Настоящие условия — в настройках приложения.",
   "photo": "assets/img/real/kv-fade.webp"
  },
  {
   "tag": "Новым",
   "title": "500 бонусов на первый визит",
   "text": "Скачайте приложение и запишитесь онлайн",
   "photo": "assets/img/real/kv-boroda.webp"
  },
  {
   "tag": "Демо-акция",
   "title": "Стрижка + борода",
   "text": "Комплекс — выгоднее, чем по отдельности",
   "photo": "assets/img/real/kv-britie.webp"
  }
 ],
 "bonus": {
  "welcome": 500,
  "maxPay": 30,
  "referral": 500,
  "levels": [
   {
    "name": "Демо",
    "from": 0,
    "rate": 5
   },
   {
    "name": "Золотой диск",
    "from": 5,
    "rate": 7
   },
   {
    "name": "Платиновый диск",
    "from": 12,
    "rate": 10
   }
  ]
 },
 "kind": "Барбершоп",
 "telegram": "https://t.me/+79082005700",
 "max": "",
 "words": {
  "gift": "Подарите стрижку",
  "friendTo": "другу",
  "friendAcc": "друга",
  "him": "Ему",
  "his": "его",
  "placeTo": "в барбершоп",
  "placeBy": "барбершопом",
  "demoName": "Артём",
  "s1": "Пластинка",
  "toLabel": "Имя получателя",
  "toExample": "Саша",
  "s2": "Билет",
  "s3": "Кассета"
 },
 "hero": "assets/img/real/kv-komanda-kvartira.webp",
 "mark": "",
 "whatsapp": "79082005700",
 "review": "https://yandex.ru/maps/org/the_kvartira/232403553264/"
};
