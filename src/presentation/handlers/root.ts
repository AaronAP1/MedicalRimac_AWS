import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const stage = process.env.STAGE || 'dev';
  const baseUrl = `https://${event.requestContext.domainName}/${stage}`;

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      message: 'Medical Appointments API - Rimac',
      version: '1.0.0',
      endpoints: {
        documentation: `${baseUrl}/docs`,
        createAppointment: {
          method: 'POST',
          url: `${baseUrl}/appointments`,
          body: {
            insuredId: '12345',
            scheduleId: 100,
            countryISO: 'PE',
            centerId: 1,
            specialtyId: 10,
            medicId: 50,
            appointmentDate: '2025-11-20T10:00:00Z',
          },
        },
        getAppointments: {
          method: 'GET',
          url: `${baseUrl}/appointments/{insuredId}`,
          example: `${baseUrl}/appointments/12345`,
        },
      },
      repository: 'https://github.com/AaronAP1/MedicalRimac_AWS',
      author: 'Anthony Aarón Aquino Poma',
    }),
  };
};
