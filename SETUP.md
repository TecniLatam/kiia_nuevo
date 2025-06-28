# Configuración de KIIA - API de Google AI

## Para activar el chat completo con IA:

### 1. Obtener API Key de Google AI
1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Inicia sesión con tu cuenta de Google
3. Crea una nueva API key
4. Copia la clave generada

### 2. Configurar variables de entorno
1. Crea un archivo `.env.local` en la raíz del proyecto
2. Agrega tu API key:
```
GOOGLE_API_KEY=tu_api_key_aqui
NEXT_PUBLIC_APP_URL=http://localhost:9002
```

### 3. Reactivar la IA
1. Descomenta la línea en `src/components/sections/kiia-chat-interface.tsx`:
```typescript
import { provideEmotionalSupportKiia, ProvideEmotionalSupportKiiaInput } from '@/ai/flows/provide-emotional-support-kiia';
```

2. Reemplaza la función `handleSubmit` con la versión original que usa la API

### 4. Reiniciar el servidor
```bash
npm run dev
```

## Estado actual
- ✅ Interfaz de chat funcional
- ✅ Respuestas temporales predefinidas
- ✅ Reconocimiento de voz
- ✅ Síntesis de voz
- ⏳ IA completa (requiere configuración de API)

## Funcionalidades disponibles sin API:
- Chat con respuestas predefinidas
- Reconocimiento de voz
- Síntesis de voz
- Interfaz completa
- Avatar animado 