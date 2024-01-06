import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    console.log('User Object:', request.user); // Add this line for logging
    return data ? request.user && request.user[data] : request.user;
  },
);
