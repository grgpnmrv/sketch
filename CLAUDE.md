# Sketch learning app — контекст проекта

## Концепция
Веб-приложение для обучения скетчингу. Человек рисует от руки на бумаге,
10 минут на задание, потом фотографирует и получает AI-фидбек.

## Стек
- Frontend: React + TypeScript + Vite, Vercel
- Backend: FastAPI (Python), Railway
- БД: PostgreSQL через Supabase
- Хранилище: Cloudflare R2
- AI: Claude Vision API (прямой POST, без очередей)

## Структура API
- POST /auth/register, /auth/login
- GET /tasks — список заданий
- POST /sketches/upload — загрузить фото + получить фидбек
- GET /sketches/history — история пользователя

## UX-решения
- Без регистрации до момента "сохранить"
- Таймер 10 минут с паузой
- Референс опционален, не отправляется в Claude
- Фото сжимается на клиенте до отправки (max 1200px, jpeg 0.82)
- Фидбек: оценка 0-100 + зелёные/жёлтые пункты (не красные)

## MVP scope
Без: аккаунтов, галереи, стриков, Celery, Redis, Konva