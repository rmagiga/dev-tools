// type DateTimeInput = {
//     dateTimeStr: string;
//     timeZone: string;
// };

function timeZoneList(): string[] {
    return Intl.supportedValuesOf('timeZone');
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
    const objectId = '0'.repeat(8 - hexSeconds.length) + hexSeconds + '0000000000000000';
    return objectId;
}

export {timeZoneList, objectIdToUnixTime, unixTimeToObjectId}