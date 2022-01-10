import { v4 as uuid } from 'uuid'
import { MessageCategory } from '.'

export interface PostMessageEventOptions {
  id?: string
  payload?: unknown
  category: MessageCategory
}

export class PostMessageEvent {
  constructor(
    type: string,
    { id, payload, category }: PostMessageEventOptions,
  ) {
    id = id || uuid()
    Object.assign(this, { id, type, payload, category })
  }

  public id: string
  public type: string
  public category: MessageCategory
}
