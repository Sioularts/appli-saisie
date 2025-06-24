
import React from 'react';
import { AppNotification, NotificationType } from '../types';

interface NotificationProps {
  notification: AppNotification;
  onDismiss: (id: string) => void;
}

const NotificationItem: React.FC<NotificationProps> = ({ notification, onDismiss }) => {
  const baseClasses = "max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden";
  
  let iconColor = "text-slate-400";
  let titleColor = "text-slate-900";
  let borderColor = "border-slate-300";

  switch (notification.type) {
    case NotificationType.SUCCESS:
      iconColor = "text-emerald-500";
      titleColor = "text-emerald-700";
      borderColor = "border-emerald-500";
      break;
    case NotificationType.ERROR:
      iconColor = "text-red-500";
      titleColor = "text-red-700";
      borderColor = "border-red-500";
      break;
    case NotificationType.INFO:
      iconColor = "text-blue-500";
      titleColor = "text-blue-700";
      borderColor = "border-blue-500";
      break;
  }

  const Icon: React.FC<{type: NotificationType, className: string}> = ({ type, className }) => {
    if (type === NotificationType.SUCCESS) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }
    if (type === NotificationType.ERROR) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      );
    }
     // INFO or default
    return (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
      </svg>
    );
  };


  return (
    <div className={`${baseClasses} border-l-4 ${borderColor}`}>
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon type={notification.type} className={`h-6 w-6 ${iconColor}`} />
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <div className={`text-sm font-medium ${titleColor}`}>
              {notification.message}
            </div>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={() => onDismiss(notification.id)}
              className="bg-white rounded-md inline-flex text-slate-400 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


interface NotificationAreaProps {
  notifications: AppNotification[];
  onDismiss: (id: string) => void;
}

const NotificationArea: React.FC<NotificationAreaProps> = ({ notifications, onDismiss }) => {
  return (
    <div
      aria-live="assertive"
      className="fixed inset-0 flex flex-col items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-end z-50 space-y-4"
    >
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

export default NotificationArea;
    