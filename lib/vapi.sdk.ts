import Vapi from "@vapi-ai/web";

// Safe initialization of Vapi that will never throw if token is missing
class SafeVapi {
  private instance: Vapi | null = null;

  constructor() {
    const token = process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN;
    if (typeof window !== "undefined" && token && token.trim().length > 0) {
      try {
        this.instance = new Vapi(token);
      } catch (e) {
        console.warn("Vapi initialization warning:", e);
      }
    }
  }

  on(event: string, callback: (...args: any[]) => void) {
    if (this.instance) {
      this.instance.on(event as any, callback);
    }
  }

  off(event: string, callback: (...args: any[]) => void) {
    if (this.instance) {
      this.instance.off(event as any, callback);
    }
  }

  async start(assistantIdOrDto: any, options?: any) {
    if (this.instance) {
      return this.instance.start(assistantIdOrDto, options);
    }
    console.warn("Vapi is not configured. Falling back to native browser speech synthesizer.");
    return Promise.resolve();
  }

  stop() {
    if (this.instance) {
      this.instance.stop();
    }
  }
}

export const vapi = new SafeVapi();
