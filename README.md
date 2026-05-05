# Frontend: Sistema de Reservación de Espacios FDI
> Interfaz — Fork Team 4

---

##  Descripción 

Interfaz de usuario desarrollada para el FDI, conectada a una API REST para la gestión de espacios, reportes técnicos y objetos perdidos.

Permite a los usuarios interactuar con el sistema de forma intuitiva.

---

## Reglas del Proyecto (Fork)

- **Sin modificaciones del código original**
- **Solo se agregaron nuevas funcionalidades**
- Se respetó la estructura base del repositorio original

---

## Funcionalidades Implementadas

-  **Soporte Técnico**  
  Creación de reportes de fallas/quejas (gestión por administrador)  

- **Objetos Perdidos**  
  Publicación y consulta de artículos extraviados
  
---

## Tecnologías

| Componente | Tecnología |
|---|---|
| Framework | React + Vite |
| Comunicación API | Axios |

---

## Conexión con Backend

Este frontend consume la API desplegada en:

https://team-4-backend-production.up.railway.app

---

## Configuración Técnica

Se utiliza **Axios** para consumir la API mediante variables de entorno.

### Archivo `.env`

```env
VITE_API_URL=https://team-4-backend-production.up.railway.app
```
Este archivo no se agregó por el .gitignore

---
# Instalación Local
1. Clonar el repositorio
2. Instalar dependencias
   ```
   npm install
   ```
3. Configurar variables de enterno
4. Ejecutar
   ```
   npm run dev
   ```
   
---
## Despliegue
| Recurso | Enlace |
|---|---|
| Sitio en producción | https://team-4-frontend.vercel.app |
| Repositorio Backend | https://github.com/gioutt/team-4-backend.git |

---

## Autor de Objetos Perdidos y Reportes
* Cristian Giovany Carballo Padilla

