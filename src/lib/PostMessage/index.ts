import { PostMessageEvent, PostMessageEventOptions } from './PostMessageEvent'

export enum MessageCategory {
  message = 'MESSAGE',
  received = 'RECEIVED',
  resolved = 'RESOLVED',
  rejected = 'REJECTED',
}

function buildReceivedType(messageId: PostMessageEvent['id']): string {
  return `${MessageCategory.received}: ${messageId}`
}

export class PostMessage {
  static dispatch(
    type: string,
    target: WindowProxy,
    {
      category = MessageCategory.message,
      payload,
    }: Partial<PostMessageEventOptions> = {},
  ): Promise<PostMessageEvent> {
    return new Promise((resolve, reject) => {
      if (!target?.postMessage)
        return reject(new Error('target is not a window'))
      const messageEvent = new PostMessageEvent(type, { category, payload })

      if (category === MessageCategory.message) {
        let timer = null

        const listenerRemover = this.listen(
          buildReceivedType(messageEvent.id),
          event => {
            if (
              event.category === MessageCategory.received &&
              event.id === messageEvent.id
            ) {
              clearTimeout(timer)
              resolve(messageEvent)
            }
          },
        )

        timer = setTimeout(() => {
          listenerRemover()
          reject(new Error('timeout'))
        }, 2000)
      }

      target.postMessage(messageEvent, '*')
    })
  }

  /*
    @returns listenerRemover
  */
  static listen(
    type: string,
    callback: (event: PostMessageEvent) => void,
  ): () => void {
    const source = window
    const handler = (event: MessageEvent) => {
      if (
        event.data?.type === type &&
        Object.values(MessageCategory).includes(event.data.category)
      ) {
        if (event.data.category === MessageCategory.message) {
          this.sendReceived(event.data.id, event.source)
        }
        callback?.(event.data)
      }
    }
    source.addEventListener('message', handler)

    return () => source.removeEventListener('message', handler)
  }

  static sendReceived(
    messageId: PostMessageEvent['id'],
    target: MessageEventSource,
  ): void {
    if (target instanceof ServiceWorker || target instanceof MessagePort) return
    const messageEvent = new PostMessageEvent(buildReceivedType(messageId), {
      category: MessageCategory.received,
      id: messageId,
    })

    target.postMessage(messageEvent, '*')
  }
}
