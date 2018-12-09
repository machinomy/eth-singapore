export class SampleHandler {
  static endpoint (): string {
    return 'sample_handler'
  }

  // TODO Follow types in reply
  static async handler (params: any, reply: any) {
    // Do what you want here

    reply(null, [ 'well_done' ])
  }
}
