import { DateTime } from "luxon";
import { Result, ok, err } from "neverthrow";
import {validate, version } from "uuid";

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

function uuIdV7ToUnixTime(uuid: string): number | null {
  try {
    const sp = uuid.split("-");
    const hex = sp[0] + sp[1].slice(0, 4);
    const timestampMills = parseInt(hex, 16);

    return timestampMills;
  } catch (error) {
    console.error("Invalid ObjectId string format");
    return null;
  }
}
export const ConversionType = {
  AUTO: 0,
  UNIXTIME_SECONDS: 1,
  UNIXTIME_MILLIS: 2,
  JP_FORMAT: 3,
  RFC2822: 4,
  ISO8601_EXTENDED: 5,
  OBJECT_ID: 6,
  UUID_V7: 7,
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
function isUuidV7(str: string): boolean {
  return validate(str) && version(str) === 7
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
  } else if (isUuidV7(input)) {
    return ok(ConversionType.UUID_V7);
  }
  return err("日付形式ではありません。");
}

function getConversionType(
  input: string,
  conversionType: ConversionTypeValues
): Result<ConversionTypeValues, string> {
  let result: Result<ConversionTypeValues, string>;
  if (conversionType == ConversionType.AUTO) {
    result = autoConversionType(input);
  } else {
    result = ok(conversionType);
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
      const unixtimeObjectId = objectIdToUnixTime(input);
      if (unixtimeObjectId !== null) {
        dateTime = DateTime.fromSeconds(unixtimeObjectId);
      }
      break;
    case ConversionType.UUID_V7:
      const unixtimeUuid = uuIdV7ToUnixTime(input);
      if (unixtimeUuid !== null) {
        dateTime = DateTime.fromMillis(unixtimeUuid);
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
