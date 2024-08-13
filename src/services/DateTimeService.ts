import { DateTime } from "luxon";
import { Result, ok, err } from "neverthrow";

function timeZoneList(): string[] {
  return Intl.supportedValuesOf("timeZone");
}

function objectIdToUnixTime(idString: string): number | null {
  try {
    const timestamp = parseInt(idString.substring(0, 8), 16);
    return timestamp;
  } catch (error) {
    console.error("Invalid ObjectId string format");
    return null;
  }
}

function unixTimeToObjectId(unixTime: number): string {
  const hexSeconds = unixTime.toString(16);
  const objectId =
    "0".repeat(8 - hexSeconds.length) + hexSeconds + "0000000000000000";
  return objectId;
}

export const ConversionType = {
  AUTO: 0,
  UNIXTIME_SECONDS: 1,
  UNIXTIME_MILLIS: 2,
  JP_FORMAT: 3,
  RFC2822: 4,
  ISO8601_EXTENDED: 5,
  OBJECT_ID: 6,
} as const;

export type Values<T> = T[keyof T];
export type Keys<T> = keyof T;
export type ConversionTypekeys = Keys<typeof ConversionType>;
export type ConversionTypeValues = Values<typeof ConversionType>;

function isNumber(value: any): boolean {
  return /^\d+$/.test(value);
}
function isMongoObjectId(str: string): boolean {
  const objectIdPattern = /^[0-9a-fA-F]{24}$/;
  return objectIdPattern.test(str);
}

const JP_FORMAT_STR: string = "yyyy/MM/dd HH:mm:ss";

function autoConversionType(
  input: string
): Result<ConversionTypeValues, string> {
  if (isNumber(input) && input.length <= 10) {
    return ok(ConversionType.UNIXTIME_SECONDS);
  } else if (isNumber(input)) {
    return ok(ConversionType.UNIXTIME_MILLIS);
  } else if (DateTime.fromFormat(input, JP_FORMAT_STR).isValid) {
    return ok(ConversionType.JP_FORMAT);
  } else if (DateTime.fromRFC2822(input).isValid) {
    return ok(ConversionType.RFC2822);
  } else if (DateTime.fromISO(input).isValid) {
    return ok(ConversionType.ISO8601_EXTENDED);
  } else if (isMongoObjectId(input)) {
    return ok(ConversionType.OBJECT_ID);
  }
  return err("日付形式ではありません。");
}

function getConversionType(
  input: string,
  conversionType: ConversionTypeValues
): Result<ConversionTypeValues, string> {
  let result: Result<ConversionTypeValues, string>;
  switch (conversionType) {
    case ConversionType.UNIXTIME_SECONDS:
      result = ok(ConversionType.UNIXTIME_MILLIS);
      break;
    case ConversionType.UNIXTIME_MILLIS:
      result = ok(ConversionType.UNIXTIME_MILLIS);
      break;
    case ConversionType.JP_FORMAT:
      result = ok(ConversionType.JP_FORMAT);
      break;
    case ConversionType.RFC2822:
      result = ok(ConversionType.RFC2822);
      break;
    case ConversionType.ISO8601_EXTENDED:
      result = ok(ConversionType.ISO8601_EXTENDED);
      break;
    case ConversionType.OBJECT_ID:
      result = ok(ConversionType.OBJECT_ID);
      break;
    default:
      result = autoConversionType(input);
      break;
  }
  return result;
}

function detectDateTimeFormat(
  input: string,
  conversionType: ConversionTypeValues,
  timeZone: string
): Result<DateTime, string> {
  let dateTime: DateTime | null = null;
  switch (conversionType) {
    case ConversionType.UNIXTIME_SECONDS:
      dateTime = DateTime.fromSeconds(Number(input));
      break;
    case ConversionType.UNIXTIME_MILLIS:
      dateTime = DateTime.fromMillis(Number(input));
      break;
    case ConversionType.JP_FORMAT:
      dateTime = DateTime.fromFormat(input, "yyyy/MM/dd HH:mm:ss", {
        zone: timeZone.toString(),
      });
      break;
    case ConversionType.RFC2822:
      dateTime = DateTime.fromRFC2822(input);
      break;
    case ConversionType.ISO8601_EXTENDED:
      dateTime = DateTime.fromISO(input);
      break;
    case ConversionType.OBJECT_ID:
      let unixtime = objectIdToUnixTime(input);
      if (unixtime !== null) {
        dateTime = DateTime.fromSeconds(unixtime);
      }
      break;
    default:
      break;
  }
  if (dateTime == null || !dateTime.isValid) {
    return err("日付形式ではありません。");
  }
  return ok(dateTime);
}

function createDateConversion(
  input: string,
  conversionType: ConversionTypeValues,
  timeZone: string
): Result<DateTime, string> {
  const conversionTypeRet = getConversionType(input, conversionType);

  return conversionTypeRet.andThen((conversionType) =>
    detectDateTimeFormat(input, conversionType, timeZone)
  );
}

export {
  createDateConversion,
  timeZoneList,
  objectIdToUnixTime,
  unixTimeToObjectId,
};
