# nodejs_test

## Установка и запуск

1. Установите зависимости:
   npm install

Настройте файл .env (уже включён специально для проверки):
- DATABASE_URL
- JWT_SECRET
- JWT_REFRESH_SECRET

Примените миграции Prisma:
npx prisma migrate dev --name init

Запустите сервер:
npm run dev

Ссылка на postman: https://lively-star-871576.postman.co/workspace/My-Workspace~c11932cb-9a17-45fc-85c2-13bbb03fabd9/collection/31685781-83ceb884-593b-4388-95c8-162975a92161?action=share&creator=31685781