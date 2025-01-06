import { Injectable } from '@nestjs/common';
import { KeycloakConnectOptions, KeycloakConnectOptionsFactory, PolicyEnforcementMode, TokenValidation } from 'nest-keycloak-connect';
import 'dotenv/config';

@Injectable()
export class KeycloakConfigService implements KeycloakConnectOptionsFactory {

  createKeycloakConnectOptions(): KeycloakConnectOptions {
    
    return {
      authServerUrl: process.env.AUTH_SERVER_URL, //your URL Keycloak server
      realm: process.env.REALM, //realms that used for this app
      clientId: process.env.CLIENT_ID, //client id for this app
      secret: process.env.SECRET, //secret for this app
      logLevels: ['verbose'],
      useNestLogger: true, 
      policyEnforcement: PolicyEnforcementMode.PERMISSIVE,
      tokenValidation: TokenValidation.ONLINE,
    };
  }
}