export { MyDurableObject } from './MyDurableObject'

export default {
  /**
   * This is the standard fetch handler for a Cloudflare Worker
   *
   * @param request - The request submitted to the Worker from the client
   * @param env - The interface to reference bindings declared in wrangler.jsonc
   * @param ctx - The execution context of the Worker
   * @returns The response to be sent back to the client
   */
  async fetch(request, env, ctx): Promise<Response> {
    // Create a `DurableObjectId` for an instance of the `MyDurableObject`
    // class named "foo". Requests from all Workers to the instance named
    // "foo" will go to a single globally unique Durable Object instance.
    const id: DurableObjectId = env.MY_DURABLE_OBJECT.idFromName('foo')

    // Create a stub to open a communication channel with the Durable
    // Object instance.
    const stub = env.MY_DURABLE_OBJECT.get(id)

    return stub.fetch(request)
  },
} satisfies ExportedHandler<Env>
