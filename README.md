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

