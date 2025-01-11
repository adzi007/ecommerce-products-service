import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class AuthorizationGuard implements CanActivate {

  constructor(private readonly reflector: Reflector) {}

  canActivate( context: ExecutionContext ): boolean | Promise<boolean> | Observable<boolean> {

    const request = context.switchToHttp().getRequest<Request>();
    const sourceHeader = request.headers['x-request-source'];

    if (sourceHeader === 'internal') {
      console.log('Request came from an internal route via custom header');
      return true;

    }else{

      // access from public

      const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
      
      if (!requiredRoles || requiredRoles.length === 0) {

        console.log("No roles required for this route");
        return true; // No roles required for this route

      }else{

        // check role from token

        const userRoles = request.headers['x-user-roles'];

        console.log("requiredRoles >>> ", requiredRoles);
        console.log("userRoles >> ", userRoles);
        
        return true;

      }


    }

    // return true;
  }
}
