export enum MemberType {
  ADHERENT = 'Adhérent',
  ACTIF = 'Actif',
  BIENFAITEUR = 'Bienfaiteur',
}

export interface Person {
  id: string;
  nom: string;
  prenom: string;
  dateSoumission: string;
  email: string;
  telephone?: string;
  typeMembre?: MemberType | string; // Allow string for flexibility if needed, but primarily use MemberType
}

export interface PersonFormData {
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  typeMembre?: MemberType | string;
}

export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info'
}

export interface AppNotification {
  id: string;
  message: React.ReactNode;
  type: NotificationType;
}