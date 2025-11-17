import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const swaggerDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Medical Appointments API - Rimac',
    version: '1.0.0',
    description: 'API para gestión de citas médicas en Perú y Chile con arquitectura serverless',
    contact: {
      name: 'Rimac API Support',
      email: 'api@rimac.com',
    },
  },
  servers: [
    {
      url: 'https://o7xrgouehf.execute-api.us-east-1.amazonaws.com/dev',
      description: 'Development server',
    },
  ],
  tags: [
    {
      name: 'Appointments',
      description: 'Endpoints para gestión de citas médicas',
    },
  ],
  paths: {
    '/appointments': {
      post: {
        tags: ['Appointments'],
        summary: 'Crear nueva cita médica',
        description: 'Crea una nueva cita médica para un asegurado en el país especificado (PE o CL)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['insuredId', 'countryISO', 'scheduleId'],
                properties: {
                  insuredId: {
                    type: 'string',
                    pattern: '^\\d{5}$',
                    description: 'ID del asegurado (5 dígitos)',
                    example: '12345',
                  },
                  countryISO: {
                    type: 'string',
                    enum: ['PE', 'CL'],
                    description: 'Código ISO del país',
                    example: 'PE',
                  },
                  scheduleId: {
                    type: 'integer',
                    minimum: 1,
                    description: 'ID del horario de la cita',
                    example: 100,
                  },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Cita creada exitosamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    appointmentId: {
                      type: 'string',
                      format: 'uuid',
                      example: '123e4567-e89b-12d3-a456-426614174000',
                    },
                    insuredId: {
                      type: 'string',
                      example: '12345',
                    },
                    countryISO: {
                      type: 'string',
                      example: 'PE',
                    },
                    scheduleId: {
                      type: 'integer',
                      example: 100,
                    },
                    status: {
                      type: 'string',
                      example: 'pending',
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Datos de entrada inválidos',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: {
                      type: 'string',
                      example: 'InsuredId must be exactly 5 digits',
                    },
                  },
                },
              },
            },
          },
          '500': {
            description: 'Error interno del servidor',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: {
                      type: 'string',
                      example: 'Internal server error',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/appointments/{insuredId}': {
      get: {
        tags: ['Appointments'],
        summary: 'Obtener citas por asegurado',
        description: 'Retorna todas las citas médicas de un asegurado específico',
        parameters: [
          {
            name: 'insuredId',
            in: 'path',
            required: true,
            description: 'ID del asegurado (5 dígitos)',
            schema: {
              type: 'string',
              pattern: '^\\d{5}$',
              example: '12345',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Lista de citas encontradas',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    appointments: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          appointmentId: {
                            type: 'string',
                            format: 'uuid',
                          },
                          insuredId: {
                            type: 'string',
                          },
                          countryISO: {
                            type: 'string',
                          },
                          scheduleId: {
                            type: 'integer',
                          },
                          status: {
                            type: 'string',
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'ID de asegurado inválido',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: {
                      type: 'string',
                      example: 'Invalid insuredId format',
                    },
                  },
                },
              },
            },
          },
          '500': {
            description: 'Error interno del servidor',
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Appointment: {
        type: 'object',
        properties: {
          appointmentId: {
            type: 'string',
            format: 'uuid',
            description: 'ID único de la cita',
          },
          insuredId: {
            type: 'string',
            pattern: '^\\d{5}$',
            description: 'ID del asegurado',
          },
          countryISO: {
            type: 'string',
            enum: ['PE', 'CL'],
            description: 'País de la cita',
          },
          scheduleId: {
            type: 'integer',
            minimum: 1,
            description: 'ID del horario',
          },
          status: {
            type: 'string',
            enum: ['pending', 'completed'],
            description: 'Estado de la cita',
          },
        },
      },
    },
  },
};

export const handler = async (
  _event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html',
      'Access-Control-Allow-Origin': '*',
    },
    body: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Medical Appointments API - Documentation</title>
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.10.0/swagger-ui.css" />
  <style>
    body { margin: 0; padding: 0; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.10.0/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@5.10.0/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {
      const ui = SwaggerUIBundle({
        spec: ${JSON.stringify(swaggerDocument)},
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout"
      });
      window.ui = ui;
    };
  </script>
</body>
</html>
    `,
  };
};
