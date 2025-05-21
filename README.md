# Node.js Minimal Template v1

Este es un template minimalista para proyectos Node.js que utiliza TypeScript, Express, Prisma y otras tecnologías modernas.

## 🚀 Tecnologías Utilizadas

- **Node.js**: Runtime de JavaScript
- **TypeScript**: Superset tipado de JavaScript
- **Express**: Framework web para Node.js
- **Prisma**: ORM moderno para bases de datos
- **Winston**: Sistema de logging
- **Zod**: Validación de esquemas
- **ESLint & Prettier**: Linting y formateo de código
- **Docker**: Entorno de desarrollo (DB)

## 📋 Prerrequisitos

- Node.js (versión recomendada: 18.x o superior)
- pnpm (gestor de paquetes)
- Docker y Docker Compose
- PostgreSQL (si se ejecuta localmente)

## 🛠️ Instalación

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
cd nodejs-template
```

2. Instalar dependencias:
```bash
pnpm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```

4. Iniciar la base de datos con Docker:
```bash
pnpm docker:up
```

5. Ejecutar migraciones de Prisma:
```bash
pnpm prisma:generate
pnpm prisma:migrate
```

6. Iniciar el servidor en modo desarrollo:
```bash
pnpm dev
```

## 🚀 Scripts Disponibles

- `pnpm dev`: Inicia el servidor en modo desarrollo
- `pnpm build`: Compila el proyecto
- `pnpm start`: Inicia el servidor en modo producción
- `pnpm prisma:seed`: Ejecuta el seed de la base de datos con datos de ejemplo
- `pnpm docker:up`: Inicia los contenedores Docker
- `pnpm docker:down`: Detiene los contenedores Docker

## 📁 Estructura del Proyecto

```
├── api/                    # Código fuente principal
│   ├── config/             # Configuraciones
│   ├── controllers/        # Controladores
│   ├── middlewares/        # Middlewares
│   ├── models/             # Modelos
│   ├── routes/             # Rutas
│   ├── schemas/            # Esquemas de validación
│   └── utilities/          # Utilidades
├── prisma/                 # Configuración y migraciones de Prisma
├── logs/                   # Logs de la aplicación
└── dist/                   # Código compilado
```

## 🌱 Base de Datos y Seed

El proyecto utiliza Prisma como ORM y viene con un sistema de seed configurado para poblar la base de datos con datos iniciales.

### Ejecutar el Seed

Para poblar la base de datos con datos de ejemplo, ejecuta:

```bash
pnpm prisma:seed
```

### Datos de Ejemplo

El seed actual incluye:
- Tareas de ejemplo (Task 1, Task 2, Task 3)

### Personalizar el Seed

El archivo de seed se encuentra en `prisma/seed.ts`. Puedes modificarlo para agregar tus propios datos de ejemplo:

```typescript
import { PrismaClient } from '@prisma/client';

const Prisma = new PrismaClient();

async function main() {
  // Agrega aquí tus datos de ejemplo
  await Prisma.task.createMany({
    data: [
      { title: 'Task 1' },
      { title: 'Task 2' },
      { title: 'Task 3' }
    ],
  });
}

main()
  .then(async () => {
    await Prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await Prisma.$disconnect();
    process.exit(1);
  });
```

## 🏗️ Flujo de Desarrollo

El proyecto sigue un flujo de desarrollo estructurado que comienza con la definición de schemas, seguido por las rutas y finalmente los controladores. Este enfoque asegura una validación de datos robusta y un código bien organizado.

### 1. Definición de Schemas

El primer paso es definir los schemas de validación usando Zod. Los schemas definen la estructura y validación de los datos que se utilizarán en las rutas.

```typescript
// api/schemas/task.schema.ts
import { z } from 'zod';

const properties = {
  title: z.string({ required_error: 'Title is required' }),
  completed: z.boolean({ required_error: 'Completed is required' }),
  id: z.string({ required_error: 'Id is required' }),
};

// Schema para crear una tarea
export const TASK_SCHEMA = z.object({
  body: z.object({
    title: properties.title,
  }),
});

// Schema para actualizar una tarea
export const UPDATE_TASK_SCHEMA = z.object({
  query: z.object({
    id: properties.id,
  }),
  body: z.object({
    title: properties.title,
    completed: properties.completed,
  }),
});

// Schema para eliminar una tarea
export const DELETE_TASK_SCHEMA = z.object({
  query: z.object({
    id: properties.id,
  }),
});

// Tipos inferidos para uso en controladores
export type TASK_SCHEMA_TYPE = z.infer<typeof TASK_SCHEMA>;
export type UPDATE_TASK_SCHEMA_TYPE = z.infer<typeof UPDATE_TASK_SCHEMA>;
export type DELETE_TASK_SCHEMA_TYPE = z.infer<typeof DELETE_TASK_SCHEMA>;
```

### 2. Configuración de Rutas

Una vez definidos los schemas, se configuran las rutas utilizando Express Router. Las rutas utilizan el middleware de validación con los schemas definidos.

```typescript
// api/routes/tasks.route.ts
import express, { Router } from 'express';
import * as Controller from '@/controllers/tasks.controller';
import { zodValidator } from '@/middlewares';
import { DELETE_TASK_SCHEMA, TASK_SCHEMA, UPDATE_TASK_SCHEMA } from '@/schemas';

const router: Router = express.Router();

// Rutas con sus respectivos controladores y validaciones
router.get('/get-all', Controller.get_all);
router.post('/create', zodValidator(TASK_SCHEMA), Controller.create);
router.put('/update', zodValidator(UPDATE_TASK_SCHEMA), Controller.update);
router.delete('/delete', zodValidator(DELETE_TASK_SCHEMA), Controller.remove);

export { router as TasksRouter };
```

### 3. Implementación de Controladores

Finalmente, se implementan los controladores que utilizan los tipos inferidos de los schemas para acceder a los datos validados de manera segura.

```typescript
// api/controllers/tasks.controller.ts
import { TMiddlewareParams } from '@/models';
import { Prisma } from '@/config';
import { DELETE_TASK_SCHEMA_TYPE, TASK_SCHEMA_TYPE, UPDATE_TASK_SCHEMA_TYPE } from '@/schemas';

// Crear una tarea
export const create: TMiddlewareParams = async (req, res, next) => {
  try {
    // Los datos ya están validados por el middleware
    const { body } = req as unknown as TASK_SCHEMA_TYPE;

    const task = await Prisma.task.create({
      data: {
        title: body.title,
      },
    });

    return res.status(201).json({ task });
  } catch (error) {
    return next(error);
  }
};

// Actualizar una tarea
export const update: TMiddlewareParams = async (req, res, next) => {
  try {
    const { body, query } = req as unknown as UPDATE_TASK_SCHEMA_TYPE;

    const task = await Prisma.task.update({
      where: {
        id: query.id,
      },
      data: {
        title: body.title,
        completed: body.completed,
      },
    });

    return res.status(200).json({ task });
  } catch (error) {
    return next(error);
  }
};

// Eliminar una tarea
export const remove: TMiddlewareParams = async (req, res, next) => {
  try {
    const { query } = req as unknown as DELETE_TASK_SCHEMA_TYPE;

    await Prisma.task.delete({
      where: {
        id: query.id,
      },
    });

    return res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    return next(error);
  }
};
```

### Flujo de Datos

1. **Validación de Datos**:
   - Los schemas definen la estructura y validación de los datos
   - El middleware `zodValidator` valida las peticiones contra los schemas
   - Los tipos inferidos proporcionan seguridad de tipos en TypeScript

2. **Enrutamiento**:
   - Las rutas definen los endpoints disponibles
   - Cada ruta está asociada con un schema de validación
   - Las rutas conectan los endpoints con los controladores

3. **Procesamiento**:
   - Los controladores reciben datos ya validados
   - Utilizan los tipos inferidos para acceder a los datos de manera segura
   - Implementan la lógica de negocio y manejan las respuestas

### Beneficios de este Enfoque

- **Validación Temprana**: Los datos se validan antes de llegar a los controladores
- **Tipado Seguro**: TypeScript proporciona verificación de tipos en tiempo de compilación
- **Código Organizado**: Separación clara de responsabilidades
- **Mantenibilidad**: Cada componente tiene una responsabilidad específica
- **Escalabilidad**: Fácil de agregar nuevas funcionalidades siguiendo el mismo patrón

## 🐳 Configuración de Docker Compose

El proyecto utiliza Docker Compose para gestionar los servicios de base de datos y herramientas de administración. La configuración actual incluye PostgreSQL y pgAdmin.

### Estructura del Docker Compose

```yaml
name: node-api
services:
  # PostgreSQL service - Database
  postgres:
    image: postgres:latest
    container_name: postgres_db
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: admin
      POSTGRES_DB: mydb
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - postgres_network

  # pgAdmin service - Web interface to manage PostgreSQL
  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: pgadmin
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@admin.com
      PGADMIN_DEFAULT_PASSWORD: admin
    ports:
      - "5050:80"
    depends_on:
      - postgres
    networks:
      - postgres_network

volumes:
  postgres_data:

networks:
  postgres_network:
    driver: bridge
```

### Servicios Configurados

1. **PostgreSQL (Base de Datos)**
   - **Imagen**: `postgres:latest`
   - **Puerto**: 5432
   - **Credenciales**:
     - Usuario: `admin`
     - Contraseña: `admin`
     - Base de datos: `mydb`
   - **Persistencia**: Los datos se almacenan en un volumen Docker

2. **pgAdmin (Interfaz Web)**
   - **Imagen**: `dpage/pgadmin4:latest`
   - **Puerto**: 5050
   - **Credenciales**:
     - Email: `admin@admin.com`
     - Contraseña: `admin`
   - **Dependencia**: Requiere que PostgreSQL esté en ejecución

### Redes y Volúmenes

- **Red**: `postgres_network`
  - Tipo: bridge
  - Permite la comunicación entre servicios

- **Volumen**: `postgres_data`
  - Persiste los datos de PostgreSQL
  - Evita la pérdida de datos al reiniciar los contenedores

### Uso de Docker Compose

1. **Iniciar los servicios**:
```bash
pnpm docker:up
```

2. **Detener los servicios**:
```bash
pnpm docker:down
```

3. **Acceder a pgAdmin**:
   - URL: `http://localhost:5050`
   - Email: `admin@admin.com`
   - Contraseña: `admin`

4. **Conectar a PostgreSQL desde pgAdmin**:
   - Host: `postgres`
   - Puerto: `5432`
   - Base de datos: `mydb`
   - Usuario: `admin`
   - Contraseña: `admin`

### Variables de Entorno

El proyecto utiliza las siguientes variables de entorno para la conexión a la base de datos:

```env
DATABASE_URL="postgresql://admin:admin@localhost:5432/mydb?schema=public"
```

### Beneficios de esta Configuración

- **Entorno Aislado**: Cada servicio corre en su propio contenedor
- **Persistencia de Datos**: Los datos de la base de datos se mantienen entre reinicios
- **Fácil Administración**: Interfaz web (pgAdmin) para gestionar la base de datos
- **Escalabilidad**: Fácil de agregar nuevos servicios
- **Reproducibilidad**: Mismo entorno en cualquier máquina

## 📡 Endpoints Disponibles

El proyecto proporciona una serie de endpoints RESTful para gestionar tareas. A continuación se detallan los endpoints disponibles y ejemplos de uso.

### Endpoints de Tareas

#### 1. Obtener Todas las Tareas
```http
GET /api/tasks/get-all
```

**Respuesta Exitosa (200 OK)**:
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Task 1",
    "completed": false
  },
  {
    "id": "123e4567-e89b-12d3-a456-426614174001",
    "title": "Task 2",
    "completed": true
  }
]
```

#### 2. Crear una Nueva Tarea
```http
POST /api/tasks/create
```

**Cuerpo de la Petición**:
```json
{
  "title": "Nueva Tarea"
}
```

**Respuesta Exitosa (201 Created)**:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174002",
  "title": "Nueva Tarea",
  "completed": false
}
```

#### 3. Actualizar una Tarea
```http
PUT /api/tasks/update?id=123e4567-e89b-12d3-a456-426614174000
```

**Cuerpo de la Petición**:
```json
{
  "title": "Tarea Actualizada",
  "completed": true
}
```

**Respuesta Exitosa (200 OK)**:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Tarea Actualizada",
  "completed": true
}
```

#### 4. Eliminar una Tarea
```http
DELETE /api/tasks/delete?id=123e4567-e89b-12d3-a456-426614174000
```

**Respuesta Exitosa (200 OK)**:
```json
{
  "message": "Task deleted successfully"
}
```

### Notas Importantes

- Todos los endpoints requieren que el servidor esté en ejecución (`pnpm dev`)
- Las respuestas de error incluirán un mensaje descriptivo y un código de estado HTTP apropiado
- Los IDs de las tareas son generados automáticamente como UUID v4
- La validación de datos se realiza automáticamente mediante los schemas definidos
- Todos los endpoints devuelven respuestas en formato JSON
- Los endpoints que requieren un ID lo esperan como parámetro de consulta (query parameter)
