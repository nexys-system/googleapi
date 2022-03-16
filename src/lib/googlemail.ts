// initially taken from https://github.com/nexys-admin/finy-server/blob/8279bac9a5081d4228bbdcf80526815717b500a2/src/service/googleapi/gmail/googlemail.ts

import * as T from './type';
import * as U from './utils';

//import fetch from '../fetch2';

const urlPrefix = 'https://www.googleapis.com/gmail/v1/users/me';

const fetchGetOptions = {
  method: 'GET',
  headers: { 'content-type': 'application/json' }
};

export const getEmailTitle = (g: T.GoogleEmail): string | null => {
  const titleObj = g.payload.headers.find(x => x.name == 'Subject');
  if (titleObj) {
    return titleObj.value;
  }

  return null;
};

// https://developers.google.com/gmail/api/v1/reference/users/messages/list
export const filterToQuery = (filter: T.GoogleEmailFilter): string => {
  const r: string[] = [];

  if (filter.from) {
    r.push(`from:${filter.from}`);
  }

  if (filter.after) {
    r.push(`after:${filter.after}`);
  }

  if (filter.before) {
    r.push(`before:${filter.before}`);
  }

  return r.join(' ');
};

/**
 * @return list of emails
 * @param {*} sender
 * @param {*} maxResults
 * @param {*} iter : a dummy arg (default: 1), that needs to be iterated when function is called async
 */
export const listEmail = async (
  queryFilter: T.GoogleEmailFilter,
  maxResults: number,
  userId: string = 'me',
  token: string
): Promise<T.Email[]> => {
  // get token

  const q: string = filterToQuery(queryFilter);

  const params = {
    maxResults,
    q,
    access_token: token
  };

  const url: string = `${urlPrefix}/messages?` + U.paramsToString(params);

  try {
    const r = await fetch(url, fetchGetOptions);
    const res: { messages: { id: string }[] } = await r.json();
    console.log(res);

    if (r.status === 401) {
      throw Error('unauthorized');
    }

    if (!res.messages) {
      return [];
    }

    // get highest id
    const futureResults: Promise<T.Email>[] = res.messages.map(
      async (r: { id: string }) => {
        return await getAndFormatEmail(r.id, userId, token);
      }
    );

    return Promise.all(futureResults);
  } catch (err) {
    throw err;
  }
};

export const listEmailWithIter = async (
  queryFilter: T.GoogleEmailFilter,
  maxResults: number,
  userId: string = 'me',
  tokens: T.Tokens,
  getRefreshToken: (r: string) => Promise<T.Tokens>,
  iter: number = 1
): Promise<T.Email[]> => {
  try {
    return await listEmail(
      queryFilter,
      maxResults,
      userId,
      tokens.access_token
    );
  } catch (err) {
    if (iter > 1) {
      throw Error(
        'The refresh token is no longer valid or accessible please login again via oauth'
      );
    }

    if (err as Error) {
      console.log(
        'access token no longer valid, trying to fetch new one using refresh token'
      );

      const rTokens = await getRefreshToken(tokens.refresh_token);

      return listEmailWithIter(
        queryFilter,
        maxResults,
        userId,
        rTokens,
        getRefreshToken,
        iter + 1
      );
    }

    throw Error('something went wrong');
  }
};

export const get = async (
  id: string,
  token: string
): Promise<T.GoogleEmail> => {
  const url: string = `${urlPrefix}/messages/${id}?access_token=${token}`;

  try {
    const r = await fetch(url, fetchGetOptions);
    return await r.json();
  } catch (err) {
    throw err;
  }
};

const getAndFormatEmail = async (
  emailId: string,
  userId: string = 'me',
  token: string
): Promise<T.Email> => {
  const g: T.GoogleEmail = await get(emailId, token);

  return formatEmail(g, emailId, userId, token);
};

const getContent = (payload: T.GoogleEmailPart) => {
  const parts = payload.parts;
  if (parts) {
    if (parts[0].body.data) {
      return parts[0].body.data;
    } else {
      const subparts = parts[0].parts;
      if (subparts && subparts[0].body.data) {
        return subparts[0].body.data;
      }
    }
  }

  if (payload.body && payload.body.data) {
    return payload.body.data;
  }

  return '';
};

export const formatEmail = async (
  g: T.GoogleEmail,
  emailId: string,
  userId: string = 'me',
  token: string
): Promise<T.Email> => {
  const parts: T.GoogleEmailPart[] | undefined = g.payload.parts;

  const d: string = getContent(g.payload);

  const date: Date = new Date(Number(g.internalDate));
  const html: string = U.decode(d);

  const title: string | null = getEmailTitle(g);

  const from = U.getFrom(g.payload);

  const attachments: T.EmailAttachment[] = parts
    ? await partsToAttachments(emailId, parts, userId, token)
    : [];

  return { emailId, title, html, date, attachments, from };
};

// await ScalaApp.upload(apiToken, fileContent, filename, mimeType);

const isDefined = <A>(a: any): a is A => a !== undefined;

const partsToAttachments = async (
  emailId: string,
  parts: T.GoogleEmailPart[],
  userId: string = 'me',
  token: string
): Promise<T.EmailAttachment[]> => {
  const r: Promise<T.EmailAttachment | undefined>[] = parts.map(
    async (part: T.GoogleEmailPart) => {
      const attachment: T.EmailAttachment | undefined =
        await getAttachmentWithFormat(emailId, part, userId, token);
      return attachment;
    }
  );

  const p: (T.EmailAttachment | undefined)[] = await Promise.all(r);
  const attachments: T.EmailAttachment[] = p.filter(
    isDefined
  ) as T.EmailAttachment[];

  return attachments;
};

const getAttachmentWithFormat = async (
  emailId: string,
  part: T.GoogleEmailPart,
  userId: string = 'me',
  token: string
): Promise<T.EmailAttachment | undefined> => {
  const { mimeType, filename, body } = part;

  if (body) { // any mime type. previsouly: `mimeType === 'application/pdf' &&`
    const { attachmentId, size } = body;

    if (attachmentId && size > 0) {
      const attachment = await getAttachment(
        attachmentId,
        emailId,
        userId,
        token
      );
      const content: Buffer = Buffer.from(attachment.data, 'base64');

      return {
        filename,
        size,
        mimeType,
        content
      };
    }
  }
};

export const getAttachment = async (
  attachmentId: string,
  emailId: string,
  userId: string = 'me',
  token: string
) => {
  const params = { access_token: token };

  const url =
    `https://www.googleapis.com/gmail/v1/users/${userId}/messages/${emailId}/attachments/${attachmentId}?` +
    U.paramsToString(params);

  try {
    const r = await fetch(url, fetchGetOptions);
    return r.json();
  } catch (err) {
    return err;
  }
};

export const deleteMessage = async (
  id: number,
  userId = 'me',
  token: string
) => {
  const params = { access_token: token };

  const url =
    `https://www.googleapis.com/gmail/v1/users/${userId}/messages/${id}?` +
    U.paramsToString(params);

  try {
    const r = await fetch(url, {
      method: 'DELETE',
      headers: { 'content-type': 'application/json' }
    });
    return r.json();
  } catch (err) {
    throw err;
  }
};
