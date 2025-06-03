const { app } = require('@azure/functions');

// Health check endpoint for Docker
app.http('health', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('Health check requested');
        
        return {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                status: 'healthy',
                timestamp: new Date().toISOString(),
                service: 'cloud-resume-api',
                version: '1.0.0',
                environment: 'docker-development'
            })
        };
    }
});