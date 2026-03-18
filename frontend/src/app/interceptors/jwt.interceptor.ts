import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    const user = JSON.parse(userStr);
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${user.token}` }
    });
  }
  return next(req);
};
