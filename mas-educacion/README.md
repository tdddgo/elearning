# māS · Educación Continua UNIACC 2026

Aplicación interactiva para explorar, filtrar y consultar programas de Educación Continua UNIACC 2026.

## Funcionalidades

- 🔍 Buscador inteligente con IA — responde preguntas en lenguaje natural
- 📋 Filtros por facultad, tipo y modalidad
- 💬 Chat IA por programa
- ✦ Generador de contenido de marketing (email, LinkedIn, WhatsApp, ficha, blog)

## Deploy en Vercel

### 1. Clona el repositorio
```bash
git clone https://github.com/TU_USUARIO/mas-educacion.git
cd mas-educacion
npm install
```

### 2. Sube a GitHub
```bash
git add .
git commit -m "feat: māS Educación Continua 2026"
git push origin main
```

### 3. Conecta con Vercel
- Ve a [vercel.com](https://vercel.com) → New Project
- Importa este repositorio
- En **Environment Variables** agrega:
  - `ANTHROPIC_API_KEY` = tu API key de Anthropic
- Haz clic en **Deploy**

## Desarrollo local

Crea un archivo `.env` en la raíz:
```
ANTHROPIC_API_KEY=sk-ant-...
```

Luego:
```bash
npm run dev
```
