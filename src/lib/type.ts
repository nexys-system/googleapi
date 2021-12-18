export interface GoogleEmailFilter {
  after?: string;
  before?: string;
  from?: string;
}

export interface GoogleProfile {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  link: string;
  picture: string;
  gender: string;
  locale: string;
  hd: string;
}

export interface Profile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface GoogleEmailPart {
  mimeType: string;
  filename: string;
  headers: {
    name: string;
    value: string;
  }[];
  body: {
    attachmentId: string;
    size: number;
    data?: string;
  };
  parts?: GoogleEmailPart[];
}

export interface GoogleEmail {
  id: string;
  snippet: string;
  internalDate: number;
  payload: GoogleEmailPart;
}

export interface Email {
  emailId: string;
  title: string | null;
  html: string;
  date: Date;
  attachments?: EmailAttachment[];
}

export interface EmailAttachment {
  filename: string;
  size: number;
  mimeType: string;
  content: Buffer;
}
