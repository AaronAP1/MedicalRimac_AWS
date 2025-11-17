import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  SQSEvent,
} from 'aws-lambda';
import { DynamoDBAppointmentRepository } from '../../infrastructure/repositories/DynamoDBAppointmentRepository';
import { CreateAppointmentUseCase } from '../../application/use-cases/CreateAppointmentUseCase';
import { GetAppointmentsByInsuredUseCase } from '../../application/use-cases/GetAppointmentsByInsuredUseCase';

const repository = new DynamoDBAppointmentRepository();
const createAppointmentUseCase = new CreateAppointmentUseCase(repository);
const getAppointmentsByInsuredUseCase = new GetAppointmentsByInsuredUseCase(
  repository
);

export const handler = async (
  event: APIGatewayProxyEvent | SQSEvent
): Promise<APIGatewayProxyResult | void> => {
  if ('Records' in event) {
    return await handleSQSEvent(event as SQSEvent);
  }

  return await handleAPIGatewayEvent(event as APIGatewayProxyEvent);
};

async function handleAPIGatewayEvent(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers,
        body: '',
      };
    }

    if (event.httpMethod === 'POST' && event.path === '/appointments') {
      return await handlePostAppointment(event, headers);
    }

    if (
      event.httpMethod === 'GET' &&
      event.pathParameters?.insuredId
    ) {
      return await handleGetAppointments(event, headers);
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Not Found' }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
}

async function handlePostAppointment(
  event: APIGatewayProxyEvent,
  headers: Record<string, string>
): Promise<APIGatewayProxyResult> {
  try {
    const body = JSON.parse(event.body || '{}');

    if (!body.insuredId || !body.scheduleId || !body.countryISO) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Bad Request',
          message: 'insuredId, scheduleId, and countryISO are required',
        }),
      };
    }

    const result = await createAppointmentUseCase.execute(body);

    return {
      statusCode: 202,
      headers,
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error('Error in POST /appointments:', error);
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        error: 'Bad Request',
        message: error instanceof Error ? error.message : 'Validation failed',
      }),
    };
  }
}

async function handleGetAppointments(
  event: APIGatewayProxyEvent,
  headers: Record<string, string>
): Promise<APIGatewayProxyResult> {
  try {
    const insuredId = event.pathParameters?.insuredId || '';

    const result = await getAppointmentsByInsuredUseCase.execute(insuredId);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error('Error in GET /appointments/{insuredId}:', error);
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        error: 'Bad Request',
        message: error instanceof Error ? error.message : 'Invalid insuredId',
      }),
    };
  }
}

async function handleSQSEvent(event: SQSEvent): Promise<void> {
  console.log('Processing SQS messages:', event.Records.length);

  for (const record of event.Records) {
    try {
      const message = JSON.parse(record.body);
      console.log('Processing appointment completion:', message);
    } catch (error) {
      console.error('Error processing SQS message:', error);
    }
  }
}
