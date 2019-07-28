type Response = {
  responseUrl: string,
  statusCode: number,
  byte: number,
  error: any,
  methodDuration:number,
  timingStart:Date,
  timings?: {
    socket: number;
    lookup: number;
    connect: number;
    response: number;
    end: number;
  };
  timingPhases?: {
    wait: number;
    dns: number;
    tcp: number;
    firstByte: number;
    download: number;
    total: number;
  }
}