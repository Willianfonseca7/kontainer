# Kontainer – Fullstack (Strapi + Vite/React/Tailwind)

## Estrutura
- `backend/` – Strapi (rodar em http://localhost:1337)
- `frontend/` – Vite + React + Tailwind (rodar em http://localhost:5173)

## Pré-requisitos
- Node.js (>=18)
- npm

## Backend (Terminal 1)
```bash
cd backend
npm install          # já feito se node_modules existir
npm run build        # se ainda não buildou o admin
HOST=0.0.0.0 PORT=1337 npm run start
```
> Painel: http://localhost:1337/admin  
> API:    http://localhost:1337/api/items

### Collection Type
Criada “items” com campos:
- `title` (string, required)
- `description` (text)
- `status` (enum: draft, active)

### Permissões públicas
No admin: Settings → Users & Permissions → Roles → Public → habilitar `find`, `findOne`, `create` em “items”. Salve.

### CORS
Default do Strapi já aceita localhost. Se precisar, ajuste `config/middlewares.js`.

## Frontend (Terminal 2)
```bash
cd frontend
npm install
# .env já contém VITE_API_URL=http://localhost:1337
npm run dev -- --host 0.0.0.0 --port 5173
```
Abra: http://localhost:5173/kontainers (raiz do app).

## Endpoints usados
- GET  `${VITE_API_URL}/api/items`
- POST `${VITE_API_URL}/api/items`
  Payload:
  ```json
  {
    "data": {
      "title": "Meu item",
      "description": "Opcional",
      "status": "active"
    }
  }
  ```

## Debug checklist
- Backend up? `http://localhost:1337/api/items` deve responder 200.
- Permissões Public liberadas? Se 403, habilite find/findOne/create.
- CORS/baseURL? Confirme `.env` do front: `VITE_API_URL=http://localhost:1337`.
- Portas: backend 1337, frontend 5173. Mate processos antigos com `lsof -i :1337` / `lsof -i :5173`.

## Frontend – Arquivos principais
- `src/main.jsx` – bootstrap React
- `src/App.jsx` – layout + página
- `src/index.css` – Tailwind
- `src/services/api.js` – `getItems`, `createItem` com try/catch
- `src/components/Layout.jsx`
- `src/components/Button.jsx`
- `src/components/Input.jsx`
- `src/components/ItemCard.jsx`
- `src/components/ItemList.jsx` (GET + loading/erro/empty)
- `src/components/CreateItemForm.jsx` (POST)
- `src/pages/Home.jsx`
