import React, { useEffect } from 'react';
import { ToastContainer, toast, ToastOptions } from 'react-toastify';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { selectToasts, hideToast, ToastMessage } from '../../store/slices/uiSlice';
import 'react-toastify/dist/ReactToastify.css';

const Toast: React.FC = () => {
  const toasts = useAppSelector(selectToasts);
  const dispatch = useAppDispatch();

  useEffect(() => {
    toasts.forEach((toastMessage: ToastMessage) => {
      const toastOptions: ToastOptions = {
        toastId: toastMessage.id,
        autoClose: toastMessage.duration || 5000,
        onClose: () => dispatch(hideToast(toastMessage.id)),
      };

      switch (toastMessage.type) {
        case 'success':
          toast.success(toastMessage.message, toastOptions);
          break;
        case 'error':
          toast.error(toastMessage.message, toastOptions);
          break;
        case 'warning':
          toast.warning(toastMessage.message, toastOptions);
          break;
        case 'info':
          toast.info(toastMessage.message, toastOptions);
          break;
        default:
          toast(toastMessage.message, toastOptions);
      }

      // Remove the toast from Redux store after showing it
      dispatch(hideToast(toastMessage.id));
    });
  }, [toasts, dispatch]);

  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      style={{ zIndex: 9999 }}
    />
  );
};

export default Toast;
