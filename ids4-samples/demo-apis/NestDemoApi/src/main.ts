import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: "http://localhost:4200",
    
  });

  const options = new DocumentBuilder()
    .setTitle('NestJS example')
    .setDescription('')
    .setVersion('1.0')
    .addOAuth2({
      type: 'oauth2',
      flows: {
        authorizationCode: {
          authorizationUrl: 'https://localhost:6001/connect/authorize',
          tokenUrl: 'https://localhost:6001/connect/token',
          scopes: {
            'openid profile offline_access api_resource.scope':
              'Sækir OpenId, Profile og claimið sem þarf',
          },
        },
      },
    })
    .build();
  
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('', app, document);

  await app.listen(5001);
}
bootstrap();
