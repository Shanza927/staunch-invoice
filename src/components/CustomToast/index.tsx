import { toast } from 'react-toastify';

class CustomToast {
  success = (message: string) => toast.success(message, { toastId: 'success' });
  error = (message: string) => toast.error(message, { toastId: 'error' });
  info = (message: string) => toast.info(message, { toastId: 'info' });
  warn = (message: string) => toast.warn(message, { toastId: 'warn' });
}

const customToast = new CustomToast();

export { customToast };
