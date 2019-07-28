import * as NodeRequest from "request";
import { get as configGet } from "config";
import { statSync, appendFileSync, Stats } from "fs";
import * as dateformat from "dateformat";
import { schedule } from "node-cron";
schedule("0 * * * * ", async () => {
  main();
});
async function main() {
  const requestUrls = configGet<string[]>("urlList");
  const logFileName = configGet<string>("log");
  for (let url of requestUrls) {
    const data = await getRequest(url);
    writeLogFile(logFileName, url, data);
  }

}
function getRequest(url: string): Promise<Response> {
  return new Promise((resolve) => {
    const requestStartDate = new Date();
    NodeRequest(url, { time: true }, (error, response, body) => {
      const requestEndDate = new Date();
      const byte = response.readableHighWaterMark;
      const responseUrl = response.request.uri.href;
      const statusCode = response.statusCode;
      const timings = response.timings;
      const timingPhases = response.timingPhases;
      const timingStart = new Date(response.timingStart!);
      resolve({
        byte,
        error,
        responseUrl,
        statusCode,
        methodDuration: requestEndDate.getTime() - requestStartDate.getTime(),
        timingPhases,
        timings,
        timingStart
      });
    })
  })
}
function writeLogFile(logFileName: string, requestUrl: string, data: Response) {
  let stat: Stats | undefined = undefined;
  try {
    stat = statSync(logFileName);
  } catch{ }
  if (!stat || stat.isFile() == false) {
    // ヘッダーを書き込む
    appendFileSync(logFileName, [
      "date",
      "requestUrl",
      "responseUrl",
      "statusCode",
      "byte",
      "error",
      "duration",
      "timings.socket",
      "timings.lookup",
      "timings.connect",
      "timings.response",
      "timings.end",
      "timingPhases.wait",
      "timingPhases.dns",
      "timingPhases.tcp",
      "timingPhases.firstByte",
      "timingPhases.download",
      "timingPhases.total",
    ].join("\t") + "\n");
  }
  appendFileSync(logFileName, [
    dateformat(data.timingStart, "yyyy/mm/dd HH:MM:ss.l"),
    requestUrl,
    data.responseUrl,
    String(data.statusCode),
    String(data.byte),
    String(data.error || ""),
    String(data.methodDuration),
    (data.timings ? String(data.timings.socket) : ""),
    (data.timings ? String(data.timings.lookup) : ""),
    (data.timings ? String(data.timings.connect) : ""),
    (data.timings ? String(data.timings.response) : ""),
    (data.timings ? String(data.timings.end) : ""),
    (data.timingPhases ? String(data.timingPhases.wait) : ""),
    (data.timingPhases ? String(data.timingPhases.dns) : ""),
    (data.timingPhases ? String(data.timingPhases.tcp) : ""),
    (data.timingPhases ? String(data.timingPhases.firstByte) : ""),
    (data.timingPhases ? String(data.timingPhases.download) : ""),
    (data.timingPhases ? String(data.timingPhases.total) : ""),
  ].join("\t") + "\n")
}

