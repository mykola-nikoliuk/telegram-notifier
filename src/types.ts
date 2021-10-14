export type TelegramMessage = {
  message_id: number,
  from: {
    id: number,
    is_bot: boolean,
    first_name: string,
    last_name: string,
    username: string,
    language_code: string
  },
  chat: {
    id: number,
    first_name: string,
    last_name: string,
    username: string,
    type: string
  },
  video?: {
    duration: number,
    width: number,
    height: number,
    mime_type: string,
    thumb: {},
    file_id: string,
    file_unique_id: string,
    file_size: number
  },
  date: number,
  text?: string,
  caption?: string,
  customVideo?: string,
  customImage?: string,
};