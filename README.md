# Medical Rimac - Sistema de Agendamiento de Citas Médicas

Sistema serverless de agendamiento de citas médicas para Perú y Chile, construido con AWS Lambda, DynamoDB, SNS, SQS y EventBridge.

## 🏗️ Arquitectura

Este proyecto implementa una arquitectura event-driven utilizando servicios AWS serverless:

- **API Gateway**: Endpoints REST para crear y consultar citas
- **Lambda Functions**: 3 funciones principales (appointment, appointment-pe, appointment-cl)
- **DynamoDB**: Almacenamiento de estado de agendamientos
- **SNS**: Distribución de mensajes con filtros por país
- **SQS**: Colas para procesamiento asíncrono por país
- **EventBridge**: Bus de eventos para actualizaciones de estado
- **RDS MySQL**: Base de datos relacional por país (PE/CL)

## 📋 Flujo del Sistema

1. Cliente envía petición POST a `/appointments`
2. Lambda `appointment` guarda registro en DynamoDB con estado "pending"
3. Lambda publica mensaje en SNS con atributos de filtro
4. SNS distribuye a SQS correspondiente según país (PE o CL)
5. Lambda específico (`appointment-pe` o `appointment-cl`) procesa y guarda en RDS
6. Lambda envía evento de confirmación a EventBridge
7. EventBridge envía mensaje a SQS de respuestas
8. Lambda `appointment` lee SQS y actualiza estado a "completed" en DynamoDB

## 🚀 Requisitos Previos

- Node.js 20.x
- AWS CLI configurado
- Cuenta AWS activa
- Serverless Framework v4

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno (opcional para desarrollo local)
cp .env.example .env
```

## 🛠️ Comandos Disponibles

```bash
# Desarrollo local
npm run dev                 # Ejecutar serverless offline

# Build
npm run build              # Compilar TypeScript

# Deploy
npm run deploy             # Deploy a dev
npm run deploy:dev         # Deploy a ambiente dev
npm run deploy:prod        # Deploy a ambiente prod
npm remove                 # Eliminar stack de AWS

# Testing
npm test                   # Ejecutar tests
npm run test:watch         # Tests en modo watch
npm run test:coverage      # Tests con coverage

# Linting y Formateo
npm run lint               # Verificar código
npm run lint:fix           # Corregir problemas de lint
npm run format             # Formatear código
npm run format:check       # Verificar formato

# Logs
npm run logs               # Ver logs del lambda appointment
```

## 📁 Estructura del Proyecto

```
medical-rimac-appointments/
├── src/
│   ├── domain/              # Capa de dominio (entidades, value objects)
│   │   ├── entities/
│   │   ├── repositories/
│   │   └── value-objects/
│   ├── application/         # Casos de uso y DTOs
│   │   ├── use-cases/
│   │   └── dtos/
│   ├── infrastructure/      # Implementaciones de infraestructura
│   │   ├── repositories/
│   │   ├── messaging/
│   │   └── database/
│   ├── presentation/        # Handlers de Lambda
│   │   └── handlers/
│   └── shared/              # Código compartido
│       ├── utils/
│       └── types/
├── tests/                   # Tests unitarios e integración
│   ├── unit/
│   └── integration/
├── serverless.yml           # Configuración de Serverless
├── tsconfig.json           # Configuración de TypeScript
├── jest.config.js          # Configuración de Jest
└── package.json
```

## 🔌 API Endpoints

### POST /appointments
Crear un nuevo agendamiento de cita médica.

**Request Body:**
```json
{
  "insuredId": "00123",
  "scheduleId": 100,
  "countryISO": "PE"
}
```

**Response:**
```json
{
  "message": "El agendamiento está en proceso",
  "appointmentId": "uuid-v4"
}
```

### GET /appointments/{insuredId}
Obtener todos los agendamientos de un asegurado.

**Response:**
```json
{
  "appointments": [
    {
      "appointmentId": "uuid-v4",
      "insuredId": "00123",
      "scheduleId": 100,
      "countryISO": "PE",
      "status": "completed",
      "createdAt": "2024-11-17T10:30:00Z",
      "updatedAt": "2024-11-17T10:35:00Z"
    }
  ]
}
```

## 🗄️ Modelo de Datos

### DynamoDB - Table: `medical-appointments`
```
appointmentId (PK)    - UUID
insuredId (GSI)       - String (5 dígitos)
scheduleId            - Number
countryISO            - String (PE | CL)
status                - String (pending | completed)
createdAt             - ISO 8601
updatedAt             - ISO 8601
```

### RDS MySQL - Table: `appointments`
```sql
CREATE TABLE appointments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  appointment_id VARCHAR(36) UNIQUE,
  insured_id VARCHAR(5),
  schedule_id INT,
  center_id INT,
  specialty_id INT,
  medic_id INT,
  appointment_date DATETIME,
  country_iso VARCHAR(2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_insured_id (insured_id)
);
```

## 🏛️ Principios Aplicados

- **SOLID**: Principios de diseño orientado a objetos
- **Clean Architecture**: Separación en capas (Domain, Application, Infrastructure, Presentation)
- **Repository Pattern**: Abstracción de acceso a datos
- **Dependency Injection**: Inversión de dependencias
- **Event-Driven Architecture**: Comunicación asíncrona mediante eventos

## 🔐 Variables de Entorno

Las siguientes variables se configuran automáticamente en el `serverless.yml`:

- `APPOINTMENTS_TABLE`: Nombre de la tabla DynamoDB
- `SNS_TOPIC_ARN`: ARN del topic SNS
- `SQS_PE_URL`: URL de la cola SQS para Perú
- `SQS_CL_URL`: URL de la cola SQS para Chile
- `SQS_RESPONSE_URL`: URL de la cola de respuestas
- `EVENT_BUS_NAME`: Nombre del bus de eventos
- `STAGE`: Ambiente de ejecución
- `REGION`: Región de AWS

## 📝 Notas Importantes

- El RDS debe ser creado manualmente y las credenciales configuradas
- Los lambdas PE y CL inicialmente usan mocks para RDS
- El sistema valida que `countryISO` solo sea "PE" o "CL"
- El `insuredId` debe tener exactamente 5 dígitos
- Todas las fechas se manejan en formato ISO 8601

## 🧪 Testing

El proyecto incluye tests unitarios con cobertura mínima del 70%.

```bash
# Ejecutar todos los tests
npm test

# Ver coverage
npm run test:coverage
```

## 📚 Documentación API

La documentación completa en formato OpenAPI/Swagger estará disponible en `/docs` después del despliegue.

## 🤝 Contribución

Este proyecto sigue las convenciones de commit de Conventional Commits:

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `test:` Añadir o modificar tests
- `refactor:` Refactorización de código

## 📄 Licencia

ISC

---

**Autor**: Medical Rimac Team  
**Versión**: 1.0.0
